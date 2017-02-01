const pollQuestion = $('#poll-question')
const pollOptions = $('#poll-options')
let pollData;
$(document).ready(function() {
  const uid = window.location.href.substr(window.location.href.lastIndexOf('/') + 1)

  axios.get(`/api/polls/${uid}`)
  .then(response => {
    pollData = response.data
    appendPollToDom(pollData)
  })
})

const appendPollToDom = (poll) => {
  pollQuestion.text(poll.question)
  poll.options.map(option => {
    pollOptions.append(`<p>${option}</p>`)
  })
}
