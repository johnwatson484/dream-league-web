$('#gameweekId').change(function () {
  $('#frm-gameweek').submit()
})

$('#send-results').click(function () {
  $('#send-results').button('loading')
  $.ajax({
    type: 'POST',
    url: '/results/send',
    data: { gameweekId: $('#gameweekId').val() },
    traditional: true,
    success: function () {
      $('#email-confirmation').fadeIn(2000)
      $('#email-confirmation').fadeOut(2000)
    },
    complete: function () {
      $('#send-results').button('reset')
    }
  })
})
