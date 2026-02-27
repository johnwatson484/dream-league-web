$(function () {
  $('#global-search').autocomplete({
    source: function (request, response) {
      $.ajax({
        url: '/search/autocomplete',
        type: 'POST',
        dataType: 'json',
        data: { prefix: request.term },
        success: function (data) {
          response($.map(data, function (item) {
            return {
              label: item.label,
              value: item.label,
              type: item.type,
              data: item.data,
            }
          }))
        },
      })
    },
    select: function (event, ui) {
      // Build URL based on type
      let url = '/'
      switch (ui.item.type) {
        case 'player':
          url = `/league/player/detail?playerId=${ui.item.data.playerId}`
          break
        case 'team':
          url = `/league/team/detail?teamId=${ui.item.data.teamId}`
          break
        case 'manager':
          url = `/manager?managerId=${ui.item.data.managerId}`
          break
        case 'division':
          url = `/league/teams?division=${encodeURIComponent(ui.item.data.name)}`
          break
        case 'page':
          const pageMap = {
            players: '/league/players',
            teams: '/league/teams',
            managers: '/managers',
            meetings: '/meetings',
            results: '/results',
            teamsheet: '/teamsheet',
            history: '/history',
            rules: '/rules',
            cups: '/cups',
            groups: '/groups',
            fixtures: '/fixtures',
          }
          url = pageMap[ui.item.data.page] || '/'
          break
      }
      window.location.href = url
      return false
    },
    messages: {
      noResults: '', results: '',
    },
  })
})
