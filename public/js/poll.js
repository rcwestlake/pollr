const socket = io()

const pollQuestion = $('#poll-question')
const pollOptions = $('#poll-options')
const connectionCount = $('#connection-count')
const voteMessage = $('#vote-message')

$(document).ready(function() {
  let pollData;
  const uid = window.location.href.substr(window.location.href.lastIndexOf('/') + 1)

  if(uid) {
    axios.get(`/api/polls/${uid}`)
    .then(response => {
      pollData = response.data
      appendPollToDom(pollData)
    })
  }

  socket.on('usersConnected', (count) => {
    connectionCount.text('# of connected users: ' + count)
  })

  socket.on('voteMessage', (message) => {
    voteMessage.text(message)
  })
})

const appendPollToDom = (poll) => {
  if(!poll.question || !poll.options.length) {
    throw new Error('You do not have the proper info for a poll')
  }

  pollQuestion.text(poll.question)
  poll.options.map(option => {
    pollOptions.append(`<li class='option'>${option}</li>`)
  })
  $('.option').on('click', function() {
    socket.emit('userVote', this.innerText)
    console.log(this);
  })
}
