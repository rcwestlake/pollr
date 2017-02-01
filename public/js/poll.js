const pollQuestion = $('#poll-question')
const pollOptions = $('#poll-options')

$(document).ready(function() {
  let pollData;
  const uid = window.location.href.substr(window.location.href.lastIndexOf('/') + 1)

  axios.get(`/api/polls/${uid}`)
  .then(response => {
    pollData = response.data
    appendPollToDom(pollData)
  })
})

const appendPollToDom = (poll) => {
  if(!poll.question || !poll.options.length) {
    throw new Error('You do not have the proper info for a poll')
  }

  pollQuestion.text(poll.question)
  poll.options.map(option => {
    pollOptions.append(`<li>${option}</li>`)
  })
}
