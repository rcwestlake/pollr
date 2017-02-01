$('#submit-poll-btn').on('click', (e) => {
  e.preventDefault()
  const question = $('#question').val()
  let options = []
  getOptionsOnClick(options)
  sendPollToServer(question, options)
})

const getOptionsOnClick = (options) => {
  $('.option').each(function() {
    options.push($(this).val())
  })
  return options
}

const sendPollToServer = (question, options) => {
  axios.post('/polls', { question, options })
  .then(response => {
    console.log(response);
    appendLinkToPage(response.data)
  })
}

const appendLinkToPage = (response) => {
  console.log('uid', response.uid);
  $('#link').html(`<a href='/${response.uid}'>Click to share link!</a>`)
}
