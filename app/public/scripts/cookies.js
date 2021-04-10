const acceptButton = document.querySelector('.js-cookies-button-accept')
const questionBanner = document.querySelector('.js-question-banner')
const cookieContainer = document.querySelector('.js-cookies-container')

cookieContainer.style.display = 'block'

acceptButton.addEventListener('click', function (event) {
  questionBanner.setAttribute('hidden', 'hidden')
  event.preventDefault()
  submitPreference(true)
})

function submitPreference (accepted) {
  const xhr = new XMLHttpRequest()
  xhr.open('POST', '/cookies', true)
  xhr.setRequestHeader('Content-Type', 'application/json')
  xhr.send(JSON.stringify({
    analytics: accepted,
    async: true
  }))
}
