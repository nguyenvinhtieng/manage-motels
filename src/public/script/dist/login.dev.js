"use strict";

var TIME_COOKIE_VALID = 60;

function validateLogin(username, password) {
  var isOk = true;
  var usernameBlock = document.getElementById('username');
  var passwordBlock = document.getElementById('password');

  if (username === '') {
    usernameBlock.style.border = "1px solid var(--danger-color)";
    toast({
      title: 'Invalid',
      message: 'Please enter username',
      type: 'error',
      duration: 3000
    });
    isOk = false;
  } else {
    usernameBlock.style.border = "1px solid var(--grey-color)";
  }

  if (password === '') {
    toast({
      title: 'Invalid',
      message: 'Please enter password',
      type: 'error',
      duration: 3000
    });
    passwordBlock.style.border = "1px solid var(--danger-color)";
    isOk = false;
  } else {
    passwordBlock.style.border = "1px solid var(--grey-color)";
  }

  return isOk;
}

function setCookie(cname, cvalue, exminutes) {
  var d = new Date();
  d.setTime(d.getTime() + exminutes * 60 * 1000);
  var expires = "expires=" + d.toUTCString();
  document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

function getCookie(cname) {
  var name = cname + "=";
  var decodedCookie = decodeURIComponent(document.cookie);
  var ca = decodedCookie.split(';');

  for (var i = 0; i < ca.length; i++) {
    var c = ca[i];

    while (c.charAt(0) == ' ') {
      c = c.substring(1);
    }

    if (c.indexOf(name) == 0) {
      return c.substring(name.length, c.length);
    }
  }

  return "";
}

if (document.getElementById('btn-login')) {
  var btnLogin = document.getElementById('btn-login');
  btnLogin.addEventListener('click', function (e) {
    e.preventDefault();
    var username = $('#username').val();
    var password = $('#password').val();

    if (validateLogin(username, password)) {
      login(username, password);
    }
  });
}

function login(username, password) {
  $.ajax({
    url: '/login',
    type: 'POST',
    data: {
      username: username,
      password: password
    },
    success: function success(data) {
      if (data) {
        if (data.role === 'admin') {
          setCookie('token', data.token, TIME_COOKIE_VALID);
          window.location.href = "/admin/home";
        }

        if (data.role === 'guest') {
          setCookie('token', data.token, TIME_COOKIE_VALID);
          window.location.href = "/me/home";
        }
      } else {
        var usernameBlock = document.getElementById('username');
        var passwordBlock = document.getElementById('password');
        usernameBlock.style.border = "1px solid var(--grey-color)";
        passwordBlock.style.border = "1px solid var(--grey-color)";
        toast({
          title: 'Warning',
          message: 'Username or password is not correct',
          type: 'error',
          duration: 3000
        });
      }
    }
  });
}