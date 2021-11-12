"use strict";

document.querySelectorAll('.header__items ul li')[0].classList.add('active-item');

if (document.getElementById('btn-change')) {
  var btnChange = document.getElementById('btn-change');

  btnChange.onclick = function (e) {
    e.preventDefault();
    var oldP = document.getElementById('old-password').value;
    var newP = document.getElementById('new-password').value;
    var repeatP = document.getElementById('repeat-password').value;

    if (validDate(oldP, newP, repeatP)) {
      updatePassword(oldP, newP, repeatP);
    }
  };
}

function updatePassword(oldP, newP, repeatP) {
  $.ajax({
    url: '/account/updatePass',
    method: 'POST',
    data: {
      currentpassword: oldP,
      password: newP
    },
    success: function success(data) {
      if (data.status) {
        showSuccessToast(data.message);
        hiddenModal();
      } else {
        showErrorToast(data.message);
      }
    }
  });
}

function hiddenModal() {
  document.getElementById('modal-change-password').checked = false;
}

function validDate(oldP, newP, repeatP) {
  if (oldP === '') {
    showErrorToast('Current password can not be empty');
    return false;
  }

  if (newP === '') {
    showErrorToast('New password can not be empty');
    return false;
  }

  if (newP.length < 8) {
    showErrorToast('New password need more than 8 characters');
    return false;
  }

  if (newP !== repeatP) {
    showErrorToast('Repeat password not match');
    return false;
  }

  return true;
}