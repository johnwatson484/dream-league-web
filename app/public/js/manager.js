$(function () {
  $('.manager-id').each(function () {
    const managerId = $(this)
    if (Number(managerId.val()) === manager.managerId) { // eslint-disable-line
      managerId.closest('tr').addClass('table-info')
    }
  })
})
