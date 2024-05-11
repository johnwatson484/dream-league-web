$('#gameweekId').change(function () {
  $('#frm-gameweek').submit()
})

$('#send').click(function () {
  $('#send-results').html("<i class='fa-solid fa-circle-notch fa-spin'></i> Sending Results...")
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
      $('#send-results').html('Send results')
    }
  })
})
