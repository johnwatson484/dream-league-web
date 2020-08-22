document.querySelector('.custom-file-input').addEventListener('change', function (e) {
  const fileName = document.getElementById('playerFile').files[0].name
  const nextSibling = e.target.nextElementSibling
  nextSibling.innerText = fileName
})
