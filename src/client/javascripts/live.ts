interface Scorer {
  playerId: number
  name: string
  goals: number
}

interface LiveScore {
  managerId: number
  manager: string
  goals: number
  conceded: number
  result: string
  scorers: Scorer[]
}

interface GoalEvent {
  id: string
  minute: number | null
  utcTimestamp?: string
  scorer?: { name: string }
  potentialGoalFor?: { managerId: number; manager: string; playerId: number; player: string }
  potentialConcedingFor?: { managerId: number; manager: string; team: string }
  // Set when this replaces a previously broadcast goal with the same id (e.g. scorer renamed).
  correction?: boolean
}

interface GoalRetraction {
  id: string
  fixtureId: string
}

const MAX_FEED_ROWS = 50
const POLL_INTERVAL_MS = 60000
const HEARTBEAT_DISPLAY_INTERVAL_MS = 5000
const MAX_RETRY_DELAY_MS = 15000

function isMatched (event: GoalEvent): boolean {
  return Boolean(event?.potentialGoalFor?.managerId || event?.potentialConcedingFor?.managerId)
}

function formatEventDate (event: GoalEvent): string {
  if (!event.utcTimestamp) { return '' }
  const date = new Date(event.utcTimestamp)
  if (Number.isNaN(date.getTime())) { return '' }
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${day}/${month}`
}

$(function () {
  const liveData = JSON.parse($('#live-data').text() || '{}')
  const streamUrl: string = liveData.streamUrl || ''
  const historyUrl: string = liveData.historyUrl || ''
  const initialGameweekId: number | null = liveData.gameweekId ?? null

  const scores = new Map<number, LiveScore>()
  for (const score of (liveData.scores || []) as LiveScore[]) {
    scores.set(score.managerId, score)
  }

  // Tracks exactly what was applied per event id (not just that it was seen), so a later
  // correction or retraction for the same id can be undone precisely before re-applying.
  const appliedEvents = new Map<string, GoalEvent>()
  let lastEventTimestamp: string | null = null
  let lastHeartbeatTs: number | null = null
  let statusIsLive = false
  let retryDelay = 1000
  let source: EventSource | null = null

  const $status = $('#connection-status')
  const $feed = $('#goal-feed')
  const $feedEmpty = $('#goal-feed-empty')

  const $refreshButton = $('#refresh-goals')
  const $refreshConfirmButton = $('#refresh-confirm-btn')
  const $refreshStatus = $('#refresh-status')

  $refreshConfirmButton.on('click', function () {
    $refreshButton.prop('disabled', true)
    $refreshStatus.text('Refreshing…')
    $.ajax({
      type: 'POST',
      url: '/live/refresh',
      data: { crumb: $('#refresh-crumb').val() },
      success: function (summary: { eventsChanged?: number }) {
        $refreshStatus.text(`Done - ${summary?.eventsChanged ?? 0} goal(s) updated.`)
      },
      error: function () {
        $refreshStatus.text('Refresh failed. Please try again.')
      },
      complete: function () {
        $refreshButton.prop('disabled', false)
      },
    })
  })

  function setStatus (text: string, badge: string): void {
    $status.text(text).removeClass('badge-secondary badge-success badge-warning badge-danger').addClass(badge)
  }

  function timeAgo (ts: number): string {
    const elapsed = Date.now() - ts
    if (elapsed < 2000) { return '1s' }
    if (elapsed < 60000) { return `${Math.floor(elapsed / 1000)}s` }
    return `${Math.floor(elapsed / 60000)}m`
  }

  function setLiveStatus (text: string, badge: string, isLive: boolean): void {
    statusIsLive = isLive
    const suffix = lastHeartbeatTs ? ` (last hb ${timeAgo(lastHeartbeatTs)})` : ''
    setStatus(`${text}${suffix}`, badge)
  }

  function resultClass (score: LiveScore): string {
    if (score.goals > score.conceded) { return 'badge-success' }
    if (score.goals < score.conceded) { return 'badge-danger' }
    return 'badge-primary'
  }

  function renderScorer (scorer: Scorer): JQuery<HTMLElement> {
    const $link = $('<a>')
      .attr('href', `/league/player/detail?playerId=${encodeURIComponent(String(scorer.playerId))}`)
      .text(scorer.name)
    const $em = $('<em>').append($link)
    if (scorer.goals > 1) {
      $em.append(document.createTextNode(` (${scorer.goals})`))
    }
    return $('<div class="row">').append($('<div class="col-md-12">').append($em))
  }

  function renderScoreRow (score: LiveScore): JQuery<HTMLElement> {
    const $manager = $('<a>')
      .attr('href', `/manager?managerId=${encodeURIComponent(String(score.managerId))}`)
      .text(score.manager)

    const $badge = $('<span>')
      .addClass(`badge ${resultClass(score)}`)
      .text(`${score.goals} - ${score.conceded}`)

    const $detail = $('<td>').append($('<div class="row">').append($('<div class="col-md-12">').append($badge)))
    for (const scorer of score.scorers) {
      $detail.append(renderScorer(scorer))
    }

    return $('<tr>')
      .attr('data-manager-id', score.managerId)
      .append($('<td>').append($manager))
      .append($detail)
  }

  function renderScores (): void {
    const ordered = [...scores.values()].sort((a, b) =>
      b.goals - a.goals ||
      a.conceded - b.conceded ||
      a.manager.localeCompare(b.manager))

    const $body = $('#live-scores-table tbody')
    $body.empty()
    for (const score of ordered) {
      $body.append(renderScoreRow(score))
    }
  }

  function buildFeedRow (event: GoalEvent): JQuery<HTMLElement> {
    const scorer = event.potentialGoalFor
      ? event.potentialGoalFor.player
      : event.potentialConcedingFor
        ? `${event.potentialConcedingFor.team} conceded`
        : event.scorer?.name || 'Unknown'
    const manager = event.potentialGoalFor?.manager || event.potentialConcedingFor?.manager || ''
    const minute = event.minute ? `${event.minute}'` : ''
    const dateMinute = [formatEventDate(event), minute].filter(Boolean).join(' ')

    return $('<tr>')
      .attr('data-event-id', event.id)
      .append($('<td class="numeric">').text(dateMinute))
      .append($('<td>').text(scorer))
      .append($('<td>').text(manager))
  }

  function addToFeed (event: GoalEvent, prepend: boolean): void {
    const $row = buildFeedRow(event)

    if (prepend) {
      $feed.prepend($row)
    } else {
      $feed.append($row)
    }

    $feed.children().slice(MAX_FEED_ROWS).remove()
    $feedEmpty.hide()
  }

  // Replaces the row in place so a correction doesn't show up as a second goal in the feed.
  function replaceFeedRow (event: GoalEvent): void {
    const $existing = $feed.find(`tr[data-event-id="${event.id}"]`)
    if ($existing.length) {
      $existing.replaceWith(buildFeedRow(event))
    } else {
      addToFeed(event, true)
    }
  }

  function removeFeedRow (id: string): void {
    $feed.find(`tr[data-event-id="${id}"]`).remove()
    if (!$feed.children().length) { $feedEmpty.show() }
  }

  function undoGoal (event: GoalEvent): void {
    const scoredFor = event.potentialGoalFor
    if (scoredFor?.managerId) {
      const score = scores.get(scoredFor.managerId)
      if (score) {
        score.goals = Math.max(0, score.goals - 1)
        const existing = score.scorers.find(s => s.playerId === scoredFor.playerId)
        if (existing) {
          existing.goals--
          if (existing.goals <= 0) {
            score.scorers = score.scorers.filter(s => s !== existing)
          }
        }
      }
    }

    const concededFor = event.potentialConcedingFor
    if (concededFor?.managerId) {
      const score = scores.get(concededFor.managerId)
      if (score) { score.conceded = Math.max(0, score.conceded - 1) }
    }
  }

  function applyGoal (event: GoalEvent): boolean {
    if (!event?.id || appliedEvents.has(event.id) || !isMatched(event)) { return false }

    appliedEvents.set(event.id, event)

    const scoredFor = event.potentialGoalFor
    if (scoredFor?.managerId) {
      const score = scores.get(scoredFor.managerId)
      if (score) {
        score.goals++
        const existing = score.scorers.find(s => s.playerId === scoredFor.playerId)
        if (existing) {
          existing.goals++
        } else {
          score.scorers.push({ playerId: scoredFor.playerId, name: scoredFor.player, goals: 1 })
        }
        score.scorers.sort((a, b) => b.goals - a.goals || a.name.localeCompare(b.name))
      }
    }

    const concededFor = event.potentialConcedingFor
    if (concededFor?.managerId) {
      const score = scores.get(concededFor.managerId)
      if (score) { score.conceded++ }
    }

    return true
  }

  // Undoes whatever this id previously contributed (if anything), then applies the new content.
  function applyCorrection (event: GoalEvent): boolean {
    const prior = appliedEvents.get(event.id)
    if (prior) {
      undoGoal(prior)
      appliedEvents.delete(event.id)
    }
    return applyGoal(event)
  }

  function retractGoal (retraction: GoalRetraction): void {
    const prior = appliedEvents.get(retraction.id)
    if (!prior) { return }
    undoGoal(prior)
    appliedEvents.delete(retraction.id)
    renderScores()
    removeFeedRow(retraction.id)
  }

  function recordTimestamp (event: GoalEvent): void {
    if (event.utcTimestamp && (!lastEventTimestamp || event.utcTimestamp > lastEventTimestamp)) {
      lastEventTimestamp = event.utcTimestamp
    }
  }

  function seedFeed (): void {
    if (!historyUrl) { return }

    $.getJSON(historyUrl).done(function (data: { events?: GoalEvent[] }) {
      // The server summary already counted these, so only record them to stop the stream double counting.
      for (const event of (data?.events || []).filter(isMatched)) {
        if (!event.id || appliedEvents.has(event.id)) { continue }
        appliedEvents.set(event.id, event)
        recordTimestamp(event)
        addToFeed(event, false)
      }
    })
  }

  // On reconnect, replay any goals missed while the stream was down or stalled.
  function fetchMissedEvents (): void {
    if (!historyUrl || !lastEventTimestamp) { return }

    $.getJSON(historyUrl).done(function (data: { events?: GoalEvent[] }) {
      const missed = (data?.events || [])
        .filter(isMatched)
        .filter(event => event.id && !appliedEvents.has(event.id) && event.utcTimestamp && event.utcTimestamp > lastEventTimestamp!)
        .reverse()

      let changed = false
      for (const event of missed) {
        if (!applyGoal(event)) { continue }
        addToFeed(event, true)
        changed = true
      }

      if (changed) { renderScores() }
    })
  }

  function pollSummary (): void {
    $.getJSON('/live/summary').done(function (data: { gameweekId?: number | null; scores?: LiveScore[] }) {
      if ((data?.gameweekId ?? null) !== initialGameweekId) {
        window.location.reload()
        return
      }

      scores.clear()
      for (const score of (data?.scores || [])) {
        scores.set(score.managerId, score)
      }
      renderScores()
    })
  }

  function connect (): void {
    setLiveStatus('Connecting', 'badge-secondary', false)

    if (!source) {
      seedFeed()
    } else {
      fetchMissedEvents()
    }

    source = new EventSource(streamUrl)

    source.addEventListener('connected', function () {
      retryDelay = 1000
      setLiveStatus('Live', 'badge-success', true)
    })

    source.addEventListener('heartbeat', function () {
      lastHeartbeatTs = Date.now()
      setLiveStatus('Live', 'badge-success', true)
    })

    source.addEventListener('goal', function (e: MessageEvent) {
      let event: GoalEvent
      try {
        event = JSON.parse(e.data)
      } catch {
        return
      }

      recordTimestamp(event)
      const applied = event.correction ? applyCorrection(event) : applyGoal(event)
      if (!applied) { return }

      renderScores()
      if (event.correction) {
        replaceFeedRow(event)
      } else {
        addToFeed(event, true)
      }
    })

    source.addEventListener('goal-retracted', function (e: MessageEvent) {
      let retraction: GoalRetraction
      try {
        retraction = JSON.parse(e.data)
      } catch {
        return
      }

      retractGoal(retraction)
    })

    // EventSource retries on its own, but we manage reconnection manually so we can
    // back off and replay missed events once the stream comes back.
    source.addEventListener('error', function () {
      setLiveStatus('Reconnecting', 'badge-warning', false)
      source?.close()
      setTimeout(connect, retryDelay)
      retryDelay = Math.min(retryDelay * 2, MAX_RETRY_DELAY_MS)
    })
  }

  setInterval(pollSummary, POLL_INTERVAL_MS)

  setInterval(function () {
    if (statusIsLive) { setLiveStatus('Live', 'badge-success', true) }
  }, HEARTBEAT_DISPLAY_INTERVAL_MS)

  if (!streamUrl) {
    setStatus('Unavailable', 'badge-warning')
    return
  }

  connect()
})
