$(function () {
  const manager = JSON.parse(document.getElementById('manager-heading').dataset.manager)
  $('.manager-id').each(function () {
    const managerId = $(this)
    if (Number(managerId.val()) === manager.managerId) {
      managerId.closest('tr').addClass('table-info')
    }
  })
})
