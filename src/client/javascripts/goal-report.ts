declare const managerPlayers: Record<string, { playerId: number; name: string }[]>

$(function () {
  const $managerId = $('#managerId')
  const $playerId = $('#playerId')
  const $gameweekId = $('#gameweekId')
  const $cupGoalsGroup = $('#cupGoalsGroup')
  const $goalsCup = $('#goalsCup')

  $managerId.on('change', function () {
    const managerId = $(this).val() as string
    $playerId.empty()

    if (!managerId) {
      $playerId.append('<option value="">Select a manager first</option>')
      return
    }

    const players = managerPlayers[managerId] || []
    $playerId.append('<option value="">Select a player</option>')
    players.sort((a, b) => a.name.localeCompare(b.name))
    players.forEach(function (player) {
      $playerId.append(`<option value="${player.playerId}">${player.name}</option>`)
    })
  })

  $gameweekId.on('change', function () {
    const $selected = $(this).find(':selected')
    const isCupWeek = $selected.data('cup-week') === true || $selected.data('cup-week') === 'true'

    if (isCupWeek) {
      $cupGoalsGroup.show()
    } else {
      $cupGoalsGroup.hide()
      $goalsCup.val(0)
    }
  })
})
