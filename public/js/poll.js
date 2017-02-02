const socket = io()

const pollContainer = $('#poll-container')
const pollQuestion = $('#poll-question')
const pollOptions = $('#poll-options')
const connectionCount = $('#connection-count')
const userMessage = $('#user-message')
const voteMessage = $('.vote-message')

$(document).ready(function() {
  const id = window.location.href.substr(window.location.href.lastIndexOf('/') + 1)

  axios.get('/authkeys')
  .then(response => {
    doAuth(response)
  })


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
}

/* Auth  --> remove this comment after refactor */

const doAuth = (response) => {
  var lock = new Auth0Lock(response.data.authId, response.data.authDomain, {
    auth: {
      redirectUrl: window.location.href
    }
  })

  $('.btn-login').click(function(e) {
    e.preventDefault();
    lock.show();
  });

  $('.btn-logout').click(function(e) {
    e.preventDefault();
    logout();
  })

  lock.on("authenticated", function(authResult) {
    pollContainer.show()
    lock.getProfile(authResult.idToken, function(error, profile) {
      if (error) {
        return;
      }
      localStorage.setItem('id_token', authResult.idToken);
      // Display user information
      show_profile_info(profile);
    });
  });

  //retrieve the profile:
  var retrieve_profile = function() {
    var id_token = localStorage.getItem('id_token');
    if (id_token) {
      lock.getProfile(id_token, function (err, profile) {
        if (err) {
          return alert('There was an error getting the profile: ' + err.message);
        }
        // Display user information
        show_profile_info(profile);
      });
    }
  };

  function sendProfileToServer(profile) {
    axios.post('/login', {profile: profile})
    .then(function(response) {
      console.log('server response', response);
    })
  }

  var show_profile_info = function(profile) {
     $('.nickname').text(profile.nickname);
     $('.btn-login').hide();
     $('.avatar').attr('src', profile.picture).show();
     $('.btn-logout').show();
     sendProfileToServer(profile)
  };

  var logout = function() {
    localStorage.removeItem('id_token');
    window.location.href = "/login";
  };

  retrieve_profile();
}
