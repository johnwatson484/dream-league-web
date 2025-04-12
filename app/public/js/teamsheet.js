$(function () {
  $('.player-input').autocomplete({
    source: function (request, response) {
      $.ajax({
        url: '/league/players/autocomplete',
        type: 'POST',
        dataType: 'json',
        data: {
          prefix: request.term,
        },
        success: function (data) {
          response($.map(data, function (item) {
            return item
          }))
        },
      })
    },
    select: function (event, ui) {
      $(this).closest('.row').find('.player-id').val(ui.item.val).trigger('change')
    },
  })
})

$('.player-id').change(function () {
  const managerId = $(this).closest('.card-body').find('.manager-id').val()
  const playerIds = []
  const playerSubs = []

  $(this).closest('.card-body').find('.player-id').each(function (i) {
    playerIds[i] = $(this).val()

    if ($(this).closest('.row').find('.player-substitute').is(':checked')) {
      playerSubs.push($(this).val())
    }
  })

  $.ajax({
    type: 'POST',
    url: '/teamsheet/edit/player',
    data: { managerId, playerIds, playerSubs },
    traditional: true,
    success: function () {
      $('#save-confirmation').fadeIn(2000)
      $('#save-confirmation').fadeOut(2000)
    },
  })
})

$('.player-input').change(function () {
  if ($(this).val() === '') {
    $(this).closest('.row').find('.player-id').val(0).trigger('change')
  }
})

$('.player-substitute').change(function () {
  $(this).closest('.row').find('.player-id').trigger('change')
})

$(function () {
  $('.keeper-input').autocomplete({
    source: function (request, response) {
      $.ajax({
        url: '/league/teams/autocomplete',
        type: 'POST',
        dataType: 'json',
        data: {
          prefix: request.term,
        },
        success: function (data) {
          response($.map(data, function (item) {
            return item
          }))
        },
      })
    },
    select: function (event, ui) {
      $(this).closest('.row').find('.team-id').val(ui.item.val).trigger('change')
    },
  })
})

$('.team-id').change(function () {
  const managerId = $(this).closest('.card-body').find('.manager-id').val()
  const teamIds = []
  const teamSubs = []

  $(this).closest('.card-body').find('.team-id').each(function (i) {
    teamIds[i] = $(this).val()

    if ($(this).closest('.row').find('.keeper-substitute').is(':checked')) {
      teamSubs.push($(this).val())
    }
  })

  $.ajax({
    type: 'POST',
    url: '/teamsheet/edit/keeper',
    data: { managerId, teamIds, teamSubs },
    traditional: true,
    success: function () {
      $('#save-confirmation').fadeIn(2000)
      $('#save-confirmation').fadeOut(2000)
    },
  })
})

$('.keeper-input').change(function () {
  if ($(this).val() === '') {
    $(this).closest('.row').find('.keeper-id').val(0).trigger('change')
  }
})

$('.keeper-substitute').change(function () {
  $(this).closest('.row').find('.team-id').trigger('change')
})
