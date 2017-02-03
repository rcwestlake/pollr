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
