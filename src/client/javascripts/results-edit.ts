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
  let changedCount = 0

  if (data.goals) {
    data.goals.forEach(g => {
      const hidden = $('input[name^="goals["][name$="[playerId]"][value="' + g.playerId + '"]')
      const input = hidden.closest('td').find('.result-input')
      if (input.length && Number(input.val()) !== g.goals) {
        input.val(g.goals).addClass('table-warning')
        changedCount++
      }
    })
  }
  if (data.conceded) {
    data.conceded.forEach(c => {
      const hidden = $('input[name^="conceded["][name$="[teamId]"][value="' + c.teamId + '"]')
      const input = hidden.closest('td').find('.result-input')
      if (input.length && Number(input.val()) !== c.conceded) {
        input.val(c.conceded).addClass('table-warning')
        changedCount++
      }
    })
  }

  let alertHtml = '<div class="alert alert-success alert-dismissible fade show" role="alert">' +
    '<strong>Results Assistant:</strong> Updated ' + changedCount + ' field(s) from videprinter data.' +
    '<button type="button" class="close" data-dismiss="alert"><span>&times;</span></button></div>'

  if (data.unmatched && data.unmatched.length > 0) {
    alertHtml += '<div class="alert alert-warning alert-dismissible fade show" role="alert">' +
      '<strong>Unmatched goals (' + data.unmatched.length + '):</strong><ul class="mb-0 mt-1">'
    data.unmatched.forEach(u => {
      alertHtml += '<li>' + u.scorer + ' (' + u.team + ', ' + u.minute + '\') - ' + u.competition + '</li>'
    })
    alertHtml += '</ul><button type="button" class="close" data-dismiss="alert"><span>&times;</span></button></div>'
  }

  $('#assistant-alerts').html(alertHtml)
}
