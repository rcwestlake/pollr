const socket = io()

const pollQuestion = $('#poll-question')
const pollOptions = $('#poll-options')
const connectionCount = $('#connection-count')
const voteMessage = $('#vote-message')

$(document).ready(function() {
  const id = window.location.href.substr(window.location.href.lastIndexOf('/') + 1)

  if(id) {
    axios.get(`/api/polls/${id}`)
    .then(response => {
      appendQuestionToDom(response.data)
    })
    .then(() => {
      axios.get(`/api/options/${id}`)
      .then(response => {
        appendOptionsToDom(response.data)
      })
    })
  }

  socket.on('usersConnected', (count) => {
    connectionCount.text('# of connected users: ' + count)
  })

  socket.on('voteMessage', (message) => {
    voteMessage.text(message)
  })
})

const appendQuestionToDom = (poll) => {
  if(!poll.question) {
    throw new Error('You do not have a question for your poll')
  }

  pollQuestion.text(poll.question)
}

const appendOptionsToDom = (options) => {
  if(!options.length) {
    throw new Error('You do not have options for your poll')
  }
  
  options.map(option => {
    pollOptions.append(`<li class='option'>${option.text}</li>`)
  })
  $('.option').on('click', function() {
    socket.emit('userVote', this.innerText)
    console.log(this);
  })
}
