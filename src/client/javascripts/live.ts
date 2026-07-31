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
  scorer?: { name: string }
  scoringTeam?: { name: string }
  potentialGoalFor?: { managerId: number; playerId: number; player: string }
  potentialConcedingFor?: { managerId: number }
}

const MAX_FEED_ROWS = 50

function isMatched (event: GoalEvent): boolean {
  return Boolean(event?.potentialGoalFor?.managerId || event?.potentialConcedingFor?.managerId)
}

$(function () {
  const liveData = JSON.parse($('#live-data').text() || '{}')
  const streamUrl: string = liveData.streamUrl || ''
  const historyUrl: string = liveData.historyUrl || ''

  const scores = new Map<number, LiveScore>()
  for (const score of (liveData.scores || []) as LiveScore[]) {
    scores.set(score.managerId, score)
  }

  const countedEventIds = new Set<string>()

  const $status = $('#connection-status')
  const $feed = $('#goal-feed')
  const $feedEmpty = $('#goal-feed-empty')

  function setStatus (text: string, badge: string): void {
    $status.text(text).removeClass('badge-secondary badge-success badge-warning badge-danger').addClass(badge)
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

  function addToFeed (event: GoalEvent, prepend: boolean): void {
    const scorer = event.potentialGoalFor?.player || event.scorer?.name || 'Unknown'
    const team = event.scoringTeam?.name || ''
    const minute = event.minute ? `${event.minute}'` : ''

    const $row = $('<tr>')
      .append($('<td class="numeric">').text(minute))
      .append($('<td>').text(scorer))
      .append($('<td>').text(team))

    if (prepend) {
      $feed.prepend($row)
    } else {
      $feed.append($row)
    }

    $feed.children().slice(MAX_FEED_ROWS).remove()
    $feedEmpty.hide()
  }

  function applyGoal (event: GoalEvent): boolean {
    if (!event?.id || countedEventIds.has(event.id) || !isMatched(event)) { return false }

    countedEventIds.add(event.id)

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

  function seedFeed (): void {
    if (!historyUrl) { return }

    $.getJSON(historyUrl).done(function (data: { events?: GoalEvent[] }) {
      // The server summary already counted these, so only record the ids to stop the stream double counting.
      for (const event of (data?.events || []).filter(isMatched)) {
        if (!event.id || countedEventIds.has(event.id)) { continue }
        countedEventIds.add(event.id)
        addToFeed(event, false)
      }
    })
  }

  if (!streamUrl) {
    setStatus('Unavailable', 'badge-warning')
    return
  }

  seedFeed()

  const source = new EventSource(streamUrl)

  source.addEventListener('connected', function () {
    setStatus('Live', 'badge-success')
  })

  source.addEventListener('goal', function (e: MessageEvent) {
    let event: GoalEvent
    try {
      event = JSON.parse(e.data)
    } catch {
      return
    }

    if (!applyGoal(event)) { return }

    renderScores()
    addToFeed(event, true)
  })

  source.onerror = function () {
    // EventSource retries on its own, so only report a hard failure once it has given up.
    if (source.readyState === EventSource.CLOSED) {
      setStatus('Disconnected', 'badge-danger')
    } else {
      setStatus('Reconnecting', 'badge-warning')
    }
  }
})
