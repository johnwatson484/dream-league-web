$(function () {
  $('.player-input').autocomplete({
    source: function (request, response) {
      $.ajax({
        url: '/league/players/autocomplete',
        type: 'POST',
        dataType: 'json',
        data: { prefix: request.term },
        success: function (data) {
          response($.map(data, function (item) {
            return item
          }))
        }
      })
    },
    select: function (event, ui) {
      $(this).closest('.row').find('.player-id').val(ui.item.val).trigger('change')
    }
  })
})

// $('.player-id').change(function () {
//   var managerId = $(this).closest('.form-horizontal').find('.managerTeamId').val()

//   var playerIds = []
//   var playerSubs = []

//   $(this).closest('.form-horizontal').find('.player-id').each(function (i) {
//     playerIds[i] = $(this).val()

//     if ($(this).closest('.form-group').find('.teamsheet-player-substitute').is(':checked')) {
//       playerSubs.push($(this).val())
//     }
//   })

//   $.ajax({
//     type: 'POST',
//     url: '/TeamSheet/EditPlayer',
//     data: { managerId: managerId, playerIds: playerIds, playerSubs: playerSubs },
//     traditional: true,
//     success: function () {
//       $('#save-confirmation').fadeIn(2000)
//       $('#save-confirmation').fadeOut(2000)
//     }
//   })
// })

// $('.player-input').change(function () {
//   if ($(this).val() === '') {
//     $(this).closest('.form-group').find('.player-id').val(0).trigger('change')
//   }
// })

// $('.teamsheet-player-substitute').change(function () {
//   $(this).closest('.form-group').find('.player-id').trigger('change')
// })

$(function () {
  $('.keeper-input').autocomplete({
    source: function (request, response) {
      $.ajax({
        url: '/league/teams/autocomplete',
        type: 'POST',
        dataType: 'json',
        data: { prefix: request.term },
        success: function (data) {
          response($.map(data, function (item) {
            return item
          }))
        }
      })
    },
    select: function (event, ui) {
      $(this).closest('.row').find('.team-id').val(ui.item.val).trigger('change')
    }
  })
})

// $('.teamsheet-goalkeeper-id').change(function () {
//   var managerId = $(this).closest('.form-horizontal').find('.managerTeamId').val()

//   var teamIds = []
//   var teamSubs = []

//   $(this).closest('.form-horizontal').find('.teamsheet-goalkeeper-id').each(function (i) {
//     teamIds[i] = $(this).val()

//     if ($(this).closest('.form-group').find('.teamsheet-goalkeeper-substitute').is(':checked')) {
//       teamSubs.push($(this).val())
//     }
//   })

//   $.ajax({
//     type: 'POST',
//     url: '/TeamSheet/EditGoalKeeper',
//     data: { managerId: managerId, teamIds: teamIds, teamSubs: teamSubs },
//     traditional: true,
//     success: function () {
//       $('#save-confirmation').fadeIn(2000)
//       $('#save-confirmation').fadeOut(2000)
//     }
//   })
// })

// $('.keeper-input').change(function () {
//   if ($(this).val() === '') {
//     $(this).closest('.form-group').find('.teamsheet-goalkeeper-id').val(0).trigger('change')
//   }
// })

// $('.teamsheet-goalkeeper-substitute').change(function () {
//   $(this).closest('.form-group').find('.teamsheet-goalkeeper-id').trigger('change')
// })
