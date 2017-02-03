const socket = io()

const pollContainer = $('#poll-container')
const pollQuestion = $('#poll-question')
const pollOptions = $('#poll-options')
const connectionCount = $('#connection-count')
const userMessage = $('#user-message')
const voteMessage = $('.vote-message')
let img;
let nickname;

$(document).ready(function() {
 if(localStorage.getItem('id_token') !== null) {
   pollContainer.css('display', 'block')
   getProfileFromStorage()
 }

 getPollDataFromServer(getParameterByName('id'))

  axios.get('/authkeys')
  .then(response => {
    doAuth(response, getParameterByName('id'))
  })

  socketIoActivity()
})

const getProfileFromStorage = () => {
  let profileData = JSON.parse(localStorage.getItem('profile'))
  img = profileData.picture
  nickname = profileData.nickname
}

const socketIoActivity = () => {
  socket.on('usersConnected', (count) => {
    connectionCount.text('# of connected users: ' + count)
  })

  socket.on('userMessage', (message) => {
    userMessage.text(message)
  })

  socket.on('voteMessage', (id, image, votes) => {
    $('.vote-img').remove()
    console.log('updated votes', votes);
    votes.map(vote => {
      return $(`.${vote.choice_id}`).append(`<img
                              src=${vote.img}
                              alt="user image"
                              class="vote-img"
                            />`)
    })
  })
}

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
    .then(() => {
      axios.get('/api/votes')
      .then(votes => {
        console.log('votes in getPollDataFromServer', votes);
        votes.data.map(vote => {
          return $(`.${vote.choice_id}`).append(`<img
                                  src=${vote.img}
                                  alt="user image"
                                  class="vote-img"
                                />`)
        })
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
    pollOptions.append(`<div class='option ${option.id}'>${option.text}<br></div>`)
    $(`.${option.id}`).on('click', function() {
      socket.emit('userVote', option.id, img, nickname)
    })
  })
}

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
    logout(id);
  })

  lock.on("authenticated", function(authResult) {
    lock.getProfile(authResult.idToken, function(error, profile) {
      if (error) {
        return;
      }

      localStorage.setItem('id_token', authResult.idToken);
      localStorage.setItem('profile', JSON.stringify(profile))
      setProfileVariables(profile)
      pollContainer.css('display', 'block')

      showProfileInfo(profile);
    });
  });

  retrieveProfile(lock);
}

const showProfileInfo = (profile) => {
   $('.nickname').text(profile.nickname);
   $('.btn-login').hide();
   $('.avatar').attr('src', profile.picture).show();
   $('.btn-logout').show();
}

const retrieveProfile = (lock) => {
  var id_token = localStorage.getItem('id_token');
  if (id_token) {
    lock.getProfile(id_token, function (err, profile) {
      if (err) {
        return alert('There was an error getting the profile: ' + err.message);
      }

      showProfileInfo(profile);
    })
  }
}

const logout = (id) => {
  localStorage.removeItem('id_token');
  window.location.href = `/polls/?id=${id}`;
}

const setProfileVariables = (profile) => {
  img = profile.picture
  nickname = profile.nickname
}

//exports function for testing
if(typeof module !== 'undefined') {
  module.exports = getParameterByName
}
