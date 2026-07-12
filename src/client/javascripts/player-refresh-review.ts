const previewData = JSON.parse($('#preview-data').val() as string)

function checkAllResolved (): void {
  const allResolved = $('.team-select').toArray().every(
    (el) => $(el).val() !== ''
  )
  $('#confirm-btn').prop('disabled', !allResolved)
}

$(function () {
  $(document).on('change', '.team-select', checkAllResolved)

  $('#confirm-btn').on('click', function () {
    const $btn = $(this)
    $btn.prop('disabled', true).text('Saving...')

    const allPlayers = [...previewData.mappedPlayers]

    previewData.unmappedTeams.forEach((item: any, index: number) => {
      const teamId = Number($(`select[data-index="${index}"]`).val())
      for (const player of item.players) {
        allPlayers.push({
          firstName: player.firstName,
          lastName: player.lastName,
          position: player.position,
          teamId,
        })
      }
    })

    $.ajax({
      url: '/league/refresh/players/confirm',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ players: allPlayers }),
      success () {
        window.location.href = '/league/players'
      },
      error () {
        $btn.prop('disabled', false).text('Confirm and Save All Players')
        $('#status-message').text('Failed to save players. Please try again.')
        $('#review-status').show()
      },
    })
  })
})
