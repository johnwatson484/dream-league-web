$(function () {
  $('#GameWeekId').change()
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
