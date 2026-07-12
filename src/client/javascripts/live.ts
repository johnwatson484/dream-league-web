declare const videprinterStreamUrl: string
declare const managerScores: Record<number, { goals: number; conceded: number }>

$(function () {
  const $status = $('#connection-status')
  const $feed = $('#goal-feed')

  function updateTable (): void {
    $('#live-scores-table tbody tr').each(function () {
      const managerId = Number($(this).data('manager-id'))
      const scores = managerScores[managerId]
      if (scores) {
        $(this).find('.goals-for').text(scores.goals)
        $(this).find('.goals-against').text(scores.conceded)
      }
    })
  }

  function addGoalToFeed (event: any): void {
    const scorer = event.scorer?.name || 'Unknown'
    const team = event.scoringTeam?.name || ''
    const minute = event.minute ? `${event.minute}'` : ''
    const manager = event.potentialGoalFor?.manager || ''
    const managerBadge = manager ? `<span class="badge badge-success ml-2">${manager}</span>` : ''

    const html = `<div class="alert alert-success py-1 px-2 mb-1">
      <strong>${minute}</strong> ${scorer} (${team}) ${managerBadge}
    </div>`
    $feed.prepend(html)
  }

  if (!videprinterStreamUrl) {
    $status.text('No stream').removeClass('badge-secondary').addClass('badge-warning')
    return
  }

  const source = new EventSource(videprinterStreamUrl)

  source.addEventListener('connected', function () {
    $status.text('Connected').removeClass('badge-secondary').addClass('badge-success')
  })

  source.addEventListener('goal', function (e: any) {
    const event = JSON.parse(e.data)

    if (event.potentialGoalFor?.manager) {
      const managerId = findManagerId(event.potentialGoalFor.manager)
      if (managerId && managerScores[managerId]) {
        managerScores[managerId].goals++
      }
    }

    if (event.potentialConcedingFor?.manager) {
      const managerId = findManagerId(event.potentialConcedingFor.manager)
      if (managerId && managerScores[managerId]) {
        managerScores[managerId].conceded++
      }
    }

    updateTable()
    addGoalToFeed(event)
  })

  source.onerror = function () {
    $status.text('Disconnected').removeClass('badge-success badge-secondary').addClass('badge-danger')
  }

  function findManagerId (managerName: string): number | null {
    const $rows = $('#live-scores-table tbody tr')
    let found: number | null = null
    $rows.each(function () {
      const name = $(this).find('td:first').text()
      if (name === managerName) {
        found = Number($(this).data('manager-id'))
        return false
      }
    })
    return found
  }

  updateTable()
})
