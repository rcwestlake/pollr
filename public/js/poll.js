const socket = io()

const pollQuestion = $('#poll-question')
const pollOptions = $('#poll-options')
const connectionCount = $('#connection-count')
const userMessage = $('#user-message')
const voteMessage = $('.vote-message')

$(document).ready(function() {
  const id = window.location.href.substr(window.location.href.lastIndexOf('/') + 1)

  getPollDataFromServer(id)

  socket.on('usersConnected', (count) => {
    connectionCount.text('# of connected users: ' + count)
  })

  socket.on('userMessage', (message) => {
    userMessage.text(message)
  })

  socket.on('voteMessage', (id, message) => {
    $(`.${id}`).append(`<p>${message}</p>`)
    // voteMessage.append(`<p>${message}</p>`)
  })
})

const getPollDataFromServer = (id) => {
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
}

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
    pollOptions.append(`<li class='option ${option.id}'>${option.text}</li>`)
    $(`.${option.id}`).on('click', function() {
      console.log(option);
      socket.emit('userVote', option.id, 'ryan')
    })
  })
  // $('.option').on('click', function() {
  //   console.log(this);
  //   debugger
  //   socket.emit('userVote', this.classList[1])
  // })
}
