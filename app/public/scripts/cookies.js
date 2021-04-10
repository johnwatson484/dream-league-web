const acceptButton = document.querySelector('.js-cookies-button-accept')
const questionBanner = document.querySelector('.js-question-banner')
const cookieContainer = document.querySelector('.js-cookies-container')

cookieContainer.style.display = 'block'

acceptButton.addEventListener('click', function (event) {
  questionBanner.setAttribute('hidden', 'hidden')
  event.preventDefault()
  submitPreference(true)
  const gtmScript = document.createElement('script')
  gtmScript.setAttribute('src', 'https://www.googletagmanager.com/gtag/js?id=G-C35GGT2X1B')
  document.body.appendChild(gtmScript)
  const gaScript = document.createElement('script')
  gaScript.setAttribute('src', '/assets/google-analytics.js')
  document.body.appendChild(gaScript)
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
