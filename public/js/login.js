$(document).ready(function() {
  axios.get('/authkeys')
  .then(response => {
    doAuth(response)
  })
});

const doAuth = (response) => {
  var lock = new Auth0Lock(response.data.authId, response.data.authDomain, {
    auth: {
      params: {
        scope: 'openid email'
      }
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
