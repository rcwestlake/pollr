const socket = io()

const pollContainer = $('#poll-container')
const pollQuestion = $('#poll-question')
const pollOptions = $('#poll-options')
const connectionCount = $('#connection-count')
const userMessage = $('#user-message')
const voteMessage = $('.vote-message')

$(document).ready(function() {
  const getParameterByName = (name, url) => {
   if (!url) {
     url = window.location.href;
   }
   name = name.replace(/[\[\]]/g, "\\$&");
   var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
       results = regex.exec(url);
   if (!results) return null;
   if (!results[2]) return '';
   return decodeURIComponent(results[2].replace(/\+/g, " "));
 }

 if(localStorage.getItem('id_token') !== null) {
   pollContainer.css('display', 'block')
 }

 getPollDataFromServer(getParameterByName('id'))

  axios.get('/authkeys')
  .then(response => {
    doAuth(response, getParameterByName('id'))
  })

  socket.on('usersConnected', (count) => {
    connectionCount.text('# of connected users: ' + count)
  })

  socket.on('userMessage', (message) => {
    userMessage.text(message)
  })

  socket.on('voteMessage', (id, message) => {
    $(`.${id}`).append(`<p>${message}</p>`)
  })
})

const getPollDataFromServer = (id) => {
  debugger
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

const doAuth = (response, id) => {
  var lock = new Auth0Lock(response.data.authId, response.data.authDomain, {
    auth: {
      params: { scope: 'openid email' }
    }
  });

  $('.btn-login').click(function(e) {
    e.preventDefault();
    lock.show();
  });

  $('.btn-logout').click(function(e) {
    e.preventDefault();
    logout();
  })

  lock.on("authenticated", function(authResult) {
    lock.getProfile(authResult.idToken, function(error, profile) {
      if (error) {
        return;
      }
      localStorage.setItem('id_token', authResult.idToken);
      pollContainer.css('display', 'block')
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

        show_profile_info(profile);
      });
    }
  };

  var show_profile_info = function(profile) {
     $('.nickname').text(profile.nickname);
     $('.btn-login').hide();
     $('.avatar').attr('src', profile.picture).show();
     $('.btn-logout').show();
  };

  var logout = function() {
    localStorage.removeItem('id_token');
    window.location.href = `/polls/?id=${id}`;
  };

  retrieve_profile();
}
