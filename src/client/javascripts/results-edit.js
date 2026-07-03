$('#gameweekId').change(function () {
  $('.manager-cup-input').hide()
  $('.manager-cup-input-container').hide()

  const gameweekId = Number($(this).val())

  cupWeeks.forEach(cupWeek => { // eslint-disable-line
    if (cupWeek.gameweekId === gameweekId) {
      $('.manager-cup-input-container').show()
      $('.manager-cup-' + cupWeek.managerId).show()
    }
  })
})

$(function () {
  $('#gameweekId').change()
})

$('#submit').click(function () {
  $('#frm-results').submit()
})

$('.plus').click(function (e) {
  e.preventDefault()
  const input = $(this).closest('td').find('.result-input')
  const value = input.val() === '' ? 0 : parseInt(input.val())
  input.val(value + 1)
})

$('.minus').click(function (e) {
  e.preventDefault()
  const input = $(this).closest('td').find('.result-input')
  const value = parseInt(input.val())
  if (value > 0) {
    input.val(value - 1)
  }
})
