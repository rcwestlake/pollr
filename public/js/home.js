$('#submit-poll-btn').on('click', (e) => {
  e.preventDefault()
  const question = $('#question').val()
  let options = []
  getOptionsOnClick(options)
  sendPollToServer(question, options)
})

$('#back-to-poll-btn').on('click', () => {
  $('#link-container').hide()
})

const getOptionsOnClick = (options) => {
  $('.option').each(function() {
    options.push($(this).val())
  })
  return options
}

const sendPollToServer = (question, options) => {
  axios.post('/api/polls', { question })
  .then(response => {
    appendLinkToPage(response.data)
    console.log(options);
    console.log(response.data);
    axios.post('/api/options', ({id: response.data.id, options: options}))
    .then(response => {
      console.log(response);
    })
  })
}

const appendLinkToPage = (response) => {
  $('#link-container').show()
  $('#link').html(`<a href='/polls/${response.id}'>Click to share link!</a>`)
}
