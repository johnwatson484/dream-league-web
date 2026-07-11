const previewData = JSON.parse($('#preview-data').val() as string)

interface MatchState {
  resolved: boolean
  playerId: number | null
  teamId: number | null
  isKeeper: boolean
}

const matchStates: Map<string, MatchState> = new Map()

function initStates () {
  for (const team of previewData.teams) {
    for (let i = 0; i < team.matches.length; i++) {
      const match = team.matches[i]
      const key = `${team.managerId}-${i}`
      const isKeeper = match.position === 'Goalkeeper'

      if (match.category === 'confident' && match.bestMatch) {
        matchStates.set(key, {
          resolved: true,
          playerId: isKeeper ? null : match.bestMatch.playerId,
          teamId: isKeeper ? match.bestMatch.teamId : null,
          isKeeper,
        })
      } else {
        matchStates.set(key, {
          resolved: false,
          playerId: null,
          teamId: null,
          isKeeper,
        })
      }
    }
  }
}

function showStatus (message: string, type: 'success' | 'error' = 'success') {
  const $alert = $('#review-status .alert')
  $alert.removeClass('alert-info alert-success alert-danger')
  $alert.addClass(type === 'error' ? 'alert-danger' : 'alert-success')
  $('#status-message').text(message)
  $('#review-status').fadeIn(300).delay(3000).fadeOut(300)
}

function markRowResolved ($row: JQuery, label: string) {
  $row.find('.card').removeClass('border-danger border-warning border-info').addClass('border-success')
  $row.find('.badge').first().removeClass('badge-danger badge-warning badge-info').addClass('badge-success').text(label)
  $row.find('.create-player-form, .candidate-buttons, .confirm-transfer-btn, .manual-search-input').hide()
}

function getMatchKey ($row: JQuery): string {
  const managerId = $row.data('manager-id')
  const index = $row.data('index')
  return `${managerId}-${index}`
}

function resolveTeamFromName (teamName: string): Promise<number | null> {
  return new Promise((resolve) => {
    $.ajax({
      url: '/league/teams/autocomplete',
      type: 'POST',
      dataType: 'json',
      data: { prefix: teamName },
      success: (data) => {
        if (data && data.length > 0) {
          resolve(data[0].val || data[0].teamId)
        } else {
          resolve(null)
        }
      },
      error: () => resolve(null),
    })
  })
}

$(function () {
  initStates()

  // Resolve pre-filled team names to IDs on page load
  $('.create-team-input').each(function () {
    const $input = $(this)
    const teamName = $input.val() as string
    if (teamName) {
      resolveTeamFromName(teamName).then((teamId) => {
        if (teamId) {
          $input.closest('.form-row').find('.create-teamId').val(teamId)
        }
      })
    }
  })

  // Team autocomplete for create form
  $('.create-team-input').autocomplete({
    source (request: any, response: any) {
      $.ajax({
        url: '/league/teams/autocomplete',
        type: 'POST',
        dataType: 'json',
        data: { prefix: request.term },
        success (data: any) {
          response($.map(data, (item: any) => item))
        },
      })
    },
    select (_event: any, ui: any) {
      $(this).closest('.form-row').find('.create-teamId').val(ui.item.val)
    },
  })

  // Player search autocomplete for manual override (outfield players)
  $('.match-row[data-is-keeper="false"] .manual-search-input').autocomplete({
    source (request: any, response: any) {
      $.ajax({
        url: '/league/players/autocomplete',
        type: 'POST',
        dataType: 'json',
        data: { prefix: request.term },
        success (data: any) {
          response($.map(data, (item: any) => item))
        },
      })
    },
    select (_event: any, ui: any) {
      const $row = $(this).closest('.match-row')
      const key = getMatchKey($row)
      const state = matchStates.get(key)
      if (state) {
        state.resolved = true
        state.playerId = ui.item.val
      }
      markRowResolved($row, 'Resolved')
      showStatus(`Assigned: ${ui.item.label}`)
    },
  })

  // Team search autocomplete for manual override (keepers)
  $('.match-row[data-is-keeper="true"] .manual-search-input, .keeper-team-input').autocomplete({
    source (request: any, response: any) {
      $.ajax({
        url: '/league/teams/autocomplete',
        type: 'POST',
        dataType: 'json',
        data: { prefix: request.term },
        success (data: any) {
          response($.map(data, (item: any) => item))
        },
      })
    },
    select (_event: any, ui: any) {
      const $row = $(this).closest('.match-row')
      if ($row.length) {
        const key = getMatchKey($row)
        const state = matchStates.get(key)
        if (state) {
          state.resolved = true
          state.teamId = ui.item.val
        }
        markRowResolved($row, 'Resolved')
        showStatus(`Assigned team: ${ui.item.label}`)
      }
      $(this).closest('.keeper-search-form, .form-row').find('.keeper-teamId').val(ui.item.val)
    },
  })

  // Create player button
  $(document).on('click', '.create-player-btn', async function () {
    const $row = $(this).closest('.match-row')
    const $form = $(this).closest('.create-player-form, .inline-create-form')

    const firstName = $form.find('.create-firstName').val() as string
    const lastName = $form.find('.create-lastName').val() as string
    let teamId = $form.find('.create-teamId').val() as string
    const position = $form.find('.create-position').val() as string

    if (!lastName) {
      showStatus('Last name is required', 'error')
      return
    }

    if (!teamId) {
      const teamName = $form.find('.create-team-input').val() as string
      if (teamName) {
        const resolved = await resolveTeamFromName(teamName)
        if (resolved) {
          teamId = String(resolved)
          $form.find('.create-teamId').val(teamId)
        }
      }
    }

    if (!teamId) {
      showStatus('Please select a team from the dropdown', 'error')
      return
    }

    const $btn = $(this)
    $btn.prop('disabled', true).text('Creating...')

    $.ajax({
      url: '/teamsheet/player/create',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ firstName, lastName, position, teamId: parseInt(teamId) }),
      success (data: any) {
        const key = getMatchKey($row)
        const state = matchStates.get(key)
        if (state) {
          state.resolved = true
          state.playerId = data.playerId
        }
        markRowResolved($row, 'Created')
        showStatus(`Created: ${lastName}, ${firstName || ''} - ${position}`)
      },
      error (xhr: any) {
        $btn.prop('disabled', false).text('Create & Assign')
        const detail = xhr.responseJSON?.message || ''
        showStatus(`Failed to create player${detail ? ': ' + detail : ''}`, 'error')
      },
    })
  })

  // Transfer team search autocomplete
  $('.transfer-team-input').autocomplete({
    source (request: any, response: any) {
      $.ajax({
        url: '/league/teams/autocomplete',
        type: 'POST',
        dataType: 'json',
        data: { prefix: request.term },
        success (data: any) {
          response($.map(data, (item: any) => item))
        },
      })
    },
    select (_event: any, ui: any) {
      $(this).closest('.form-row').find('.transfer-teamId').val(ui.item.val)
    },
  })

  // Resolve pre-filled transfer team names to IDs on page load
  $('.transfer-team-input').each(function () {
    const $input = $(this)
    const teamName = $input.val() as string
    if (teamName) {
      resolveTeamFromName(teamName).then((teamId) => {
        if (teamId) {
          $input.closest('.form-row').find('.transfer-teamId').val(teamId)
        }
      })
    }
  })

  // Toggle create form
  $(document).on('click', '.toggle-create-btn', function () {
    $(this).closest('.match-row').find('.inline-create-form').toggle()
  })

  // Confirm transfer button
  $(document).on('click', '.confirm-transfer-btn', async function () {
    const $row = $(this).closest('.match-row')
    const playerId = $(this).data('player-id')

    const $btn = $(this)
    $btn.prop('disabled', true).text('Transferring...')

    let teamId = $row.find('.transfer-teamId').val() as string
    if (!teamId) {
      const teamName = $row.find('.transfer-team-input').val() as string
      const resolved = await resolveTeamFromName(teamName)
      if (!resolved) {
        $btn.prop('disabled', false).text('Confirm Transfer')
        showStatus(`Could not find team: ${teamName}. Select from autocomplete.`, 'error')
        return
      }
      teamId = String(resolved)
    }

    $.ajax({
      url: '/teamsheet/player/transfer',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ playerId, teamId: parseInt(teamId) }),
      success () {
        const key = getMatchKey($row)
        const state = matchStates.get(key)
        if (state) {
          state.resolved = true
          state.playerId = playerId
        }
        markRowResolved($row, 'Transferred')
        showStatus('Transfer confirmed')
      },
      error () {
        $btn.prop('disabled', false).text('Confirm Transfer')
        showStatus('Failed to confirm transfer', 'error')
      },
    })
  })

  // Accept candidate button
  $(document).on('click', '.accept-candidate-btn', function () {
    const $row = $(this).closest('.match-row')
    const isKeeper = $row.data('is-keeper') === 'true' || $row.data('is-keeper') === true
    const key = getMatchKey($row)
    const state = matchStates.get(key)

    if (state) {
      state.resolved = true
      if (isKeeper) {
        state.teamId = $(this).data('team-id')
      } else {
        state.playerId = $(this).data('player-id')
      }
    }
    markRowResolved($row, 'Accepted')
    showStatus(isKeeper ? 'Team accepted' : 'Player accepted')
  })

  // Confirm all button
  $('#confirm-all-btn').on('click', function () {
    const unresolved: string[] = []
    matchStates.forEach((state, key) => {
      if (!state.resolved) {
        unresolved.push(key)
      }
    })

    if (unresolved.length > 0) {
      if (!confirm(`${unresolved.length} match(es) are still unresolved. These will be skipped. Continue?`)) {
        return
      }
    }

    const assignments: any[] = []
    const keeperAssignments: any[] = []
    const teamsheetRecords: any[] = []

    for (const team of previewData.teams) {
      for (let i = 0; i < team.matches.length; i++) {
        const match = team.matches[i]
        const key = `${team.managerId}-${i}`
        const state = matchStates.get(key)

        if (!state || !state.resolved) { continue }

        if (state.isKeeper && state.teamId) {
          keeperAssignments.push({
            managerId: team.managerId,
            teamId: state.teamId,
            substitute: match.substitute,
          })
        } else if (!state.isKeeper && state.playerId) {
          assignments.push({
            managerId: team.managerId,
            playerId: state.playerId,
            substitute: match.substitute,
          })
        }

        teamsheetRecords.push({
          managerId: team.managerId,
          player: match.sourceText,
          position: match.position,
          substitute: match.substitute,
          bestMatchId: state.playerId || state.teamId || 0,
          distance: 0,
          confidence: match.confidence,
          category: match.category,
          parsedName: match.parsedName,
          parsedTeam: match.parsedTeam,
        })
      }
    }

    const $btn = $(this)
    $btn.prop('disabled', true).text('Confirming...')

    $.ajax({
      url: '/teamsheet/confirm',
      type: 'POST',
      contentType: 'application/json',
      data: JSON.stringify({ assignments, keeperAssignments, teamsheetRecords }),
      success () {
        window.location.href = '/teamsheet/edit'
      },
      error () {
        $btn.prop('disabled', false).text('Confirm All')
        showStatus('Failed to save teamsheet', 'error')
      },
    })
  })
})
