$(document).on('click', '.js-select-on-click', function () { this.select() })

$('#gameweekId').change(function () {
  $('.manager-cup-input').hide()
  $('.manager-cup-input-container').hide()

  const gameweekId = Number($(this).val())
  const cupWeeks = JSON.parse(document.getElementById('frm-results').dataset.cupWeeks)

  cupWeeks.forEach(cupWeek => {
    if (cupWeek.gameweekId === gameweekId) {
      $('.manager-cup-input-container').show()
      $('.manager-cup-' + cupWeek.managerId).show()
    }
  })

  loadExistingResults(gameweekId)
})

$(function () {
  $('#gameweekId').change()
  $('[data-toggle="tooltip"]').tooltip()
})

$('#submit').click(function () {
  $('#frm-results').submit()
})

$('.plus').click(function (e) {
  e.preventDefault()
  const input = $(this).closest('td').find('.result-input')
  const value = input.val() === '' ? 0 : Number.parseInt(input.val())
  input.val(value + 1)
  input.removeClass('table-warning')
})

$('.minus').click(function (e) {
  e.preventDefault()
  const input = $(this).closest('td').find('.result-input')
  const value = Number.parseInt(input.val())
  if (value > 0) {
    input.val(value - 1)
    input.removeClass('table-warning')
  }
})

$('#results-assistant').click(async function () {
  const gameweekId = Number($('#gameweekId').val())
  const btn = $(this)
  btn.prop('disabled', true).html('<i class="fa-solid fa-spinner fa-spin"></i> Loading...')

  try {
    const response = await $.get('/results/assisted?gameweekId=' + gameweekId)
    applyAssistedResults(response)
  } catch (err) {
    $('#assistant-alerts').html(
      '<div class="alert alert-danger alert-dismissible fade show" role="alert">' +
      'Failed to load assisted results. Is the videprinter running?' +
      '<button type="button" class="close" data-dismiss="alert"><span>&times;</span></button></div>'
    )
  } finally {
    btn.prop('disabled', false).html('<i class="fa-solid fa-wand-magic-sparkles"></i> Results Assistant')
  }
})

function loadExistingResults (gameweekId) {
  $.get('/results/existing?gameweekId=' + gameweekId, function (data) {
    $('.result-input').val('0').removeClass('table-warning')

    if (data.goals) {
      data.goals.forEach(g => {
        const input = $('input[name$="[playerId]"][value="' + g.playerId + '"]')
          .closest('td').find('.result-input')
        if (input.length) { input.val(g.goals) }
      })
    }
    if (data.goalsCup) {
      data.goalsCup.forEach(g => {
        const hidden = $('input[name^="goalsCup"][name$="[playerId]"][value="' + g.playerId + '"]')
        const input = hidden.closest('td').find('.result-input')
        if (input.length) { input.val(g.goals) }
      })
    }
    if (data.conceded) {
      data.conceded.forEach(c => {
        const input = $('input[name$="[teamId]"][value="' + c.teamId + '"]')
          .closest('td').find('.result-input')
        if (input.length) { input.val(c.conceded) }
      })
    }
    if (data.concededCup) {
      data.concededCup.forEach(c => {
        const hidden = $('input[name^="concededCup"][name$="[teamId]"][value="' + c.teamId + '"]')
        const input = hidden.closest('td').find('.result-input')
        if (input.length) { input.val(c.conceded) }
      })
    }
  })
}

function applyAssistedResults (data) {
  const appliedGoals: string[] = []
  const appliedConceded: string[] = []
  const appliedGoalsCup: string[] = []
  const appliedConcededCup: string[] = []

  if (data.goals) {
    data.goals.forEach(g => {
      const hidden = $('input[name^="goals["][name$="[playerId]"][value="' + g.playerId + '"]')
      const input = hidden.closest('td').find('.result-input')
      if (input.length && Number(input.val()) !== g.goals) {
        input.val(g.goals).addClass('table-warning')
        appliedGoals.push(g.player + ' (' + g.team + ') x' + g.goals)
      }
    })
  }
  if (data.conceded) {
    data.conceded.forEach(c => {
      const hidden = $('input[name^="conceded["][name$="[teamId]"][value="' + c.teamId + '"]')
      const input = hidden.closest('td').find('.result-input')
      if (input.length && Number(input.val()) !== c.conceded) {
        input.val(c.conceded).addClass('table-warning')
        appliedConceded.push(c.team + ' x' + c.conceded)
      }
    })
  }
  if (data.goalsCup) {
    data.goalsCup.forEach(g => {
      const hidden = $('input[name^="goalsCup"][name$="[playerId]"][value="' + g.playerId + '"]')
      const input = hidden.closest('td').find('.result-input')
      if (input.length && Number(input.val()) !== g.goals) {
        input.val(g.goals).addClass('table-warning')
        appliedGoalsCup.push(g.player + ' (' + g.team + ') x' + g.goals)
      }
    })
  }
  if (data.concededCup) {
    data.concededCup.forEach(c => {
      const hidden = $('input[name^="concededCup"][name$="[teamId]"][value="' + c.teamId + '"]')
      const input = hidden.closest('td').find('.result-input')
      if (input.length && Number(input.val()) !== c.conceded) {
        input.val(c.conceded).addClass('table-warning')
        appliedConcededCup.push(c.team + ' x' + c.conceded)
      }
    })
  }

  let alertHtml = '<div class="alert alert-success alert-dismissible fade show" role="alert">' +
    '<strong>Results Assistant</strong>' +
    '<button type="button" class="close" data-dismiss="alert"><span>&times;</span></button>'

  if (appliedGoals.length) {
    alertHtml += '<div class="mt-2"><strong>Goals:</strong><ul class="mb-1">'
    appliedGoals.forEach(g => { alertHtml += '<li>' + g + '</li>' })
    alertHtml += '</ul></div>'
  }

  if (appliedConceded.length) {
    alertHtml += '<div><strong>Conceded:</strong><ul class="mb-1">'
    appliedConceded.forEach(c => { alertHtml += '<li>' + c + '</li>' })
    alertHtml += '</ul></div>'
  }

  if (appliedGoalsCup.length) {
    alertHtml += '<div><strong>Cup Goals (first match only):</strong><ul class="mb-1">'
    appliedGoalsCup.forEach(g => { alertHtml += '<li>' + g + '</li>' })
    alertHtml += '</ul></div>'
  }

  if (appliedConcededCup.length) {
    alertHtml += '<div><strong>Cup Conceded (first match only):</strong><ul class="mb-1">'
    appliedConcededCup.forEach(c => { alertHtml += '<li>' + c + '</li>' })
    alertHtml += '</ul></div>'
  }

  if (!appliedGoals.length && !appliedConceded.length && !appliedGoalsCup.length && !appliedConcededCup.length) {
    alertHtml += '<p class="mb-0 mt-2">No changes to apply.</p>'
  }

  alertHtml += '</div>'
  $('#assistant-alerts').html(alertHtml)
}
