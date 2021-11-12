"use strict";

document.querySelectorAll('.header__items ul li')[3].classList.add('active-item');
getDataAccounts();
getDataRoom();

function showErrorToast(message) {
  toast({
    title: 'Error',
    message: message,
    type: 'error',
    duration: 3000
  });
}

function showSuccessToast(message) {
  toast({
    title: 'Success',
    message: message,
    type: 'success',
    duration: 3000
  });
}

function getDataAccounts() {
  $.ajax({
    url: '/account/getData',
    type: 'GET',
    success: function success(data) {
      renderDataAccount(data);
    }
  });
}

function renderDataAccount(data) {
  var main = document.querySelector('#accounts');
  main.innerHTML = '';
  data.forEach(function (item) {
    var tr = document.createElement('tr');
    tr.innerHTML = "\n                        <td>\n                        <div class=\"operations\">\n                            <div class=\"edit edit-account\" data-name=\"".concat(item.username, "\">\n                                <i class=\"fas fa-pen\"></i>\n                            </div>\n                            <div class=\"delete delete-account\"  data-name=\"").concat(item.username, "\">\n                                <i class=\"fas fa-trash-alt\"></i>\n                            </div>\n                        </div>\n                    </td>\n                    <td>").concat(item.username, "</td>\n                    <td>").concat(item.roomnumber, "</td>\n                    <td>").concat(item.email, "</td>\n                    <td>Yes</td>\n        ");
    main.appendChild(tr);
  });
  loadEventEdit();
}

function getDataRoom() {
  $.ajax({
    url: '/room/getData',
    type: 'GET',
    success: function success(data) {
      renderDataRoom(data);
    }
  });
}

function renderDataRoom(data) {
  var list = document.getElementById('list-room');
  data.forEach(function (item) {
    var option = document.createElement('option');
    option.value = item._id + '+' + item.number;
    option.innerText = item.number;
    list.appendChild(option);
  });
}

function validateAccount(username, room, email) {
  if (username === '') {
    showErrorToast("Username can not be empty");
    return false;
  }

  if (room === '') {
    showErrorToast("Room was not choose");
    return false;
  }

  if (email === '') {
    showErrorToast("Email can not be empty");
    return false;
  }

  return true;
}

if (document.getElementById('btn-create-account')) {
  var btnCreate = document.getElementById('btn-create-account');

  btnCreate.onclick = function (e) {
    e.preventDefault();
    var username = document.getElementById('username').value;
    var room = document.getElementById('list-room').value;
    var email = document.getElementById('email').value;
    var roomData = room.split('+');
    var roomId = roomData[0];
    var roomNumber = roomData[1];

    if (validateAccount(username, room, email)) {
      createAccount(username, roomId, email, roomNumber);
    }
  };
}

function createAccount(username, room, email, roomnumber) {
  $.ajax({
    url: '/account/create',
    type: 'POST',
    data: {
      username: username,
      roomid: room,
      roomnumber: roomnumber,
      email: email
    },
    success: function success(data) {
      console.log(data);

      if (data.status) {
        showSuccessToast(data.message);
        renderDataAccountView(username, roomnumber, email);
      } else {
        showErrorToast(data.message);
      }

      hiddenCreateAccountModal();
      resestDataModalCreate();
    }
  });
}

function resestDataModalCreate() {
  document.getElementById('username').value = '';
  document.getElementById('list-room').value = '';
  document.getElementById('email').value = '';
}

function hiddenCreateAccountModal() {
  document.querySelector('#modal__add-account').checked = false;
}

function renderDataAccountView(username, roomnumber, email) {
  var tr = document.createElement('tr');
  tr.innerHTML = "\n                    <td>\n                    <div class=\"operations\">\n                        <div class=\"edit edit-account\" data-name=\"".concat(username, "\">\n                            <i class=\"fas fa-pen\"></i>\n                        </div>\n                        <div class=\"delete delete-account\"  data-name=\"").concat(username, "\">\n                            <i class=\"fas fa-trash-alt\"></i>\n                        </div>\n                    </div>\n                </td>\n                <td>").concat(username, "</td>\n                <td>").concat(roomnumber, "</td>\n                <td>").concat(email, "</td>\n                <td>Yes</td>\n    ");
  var main = document.querySelector('#accounts');
  main.appendChild(tr);
  loadEventEdit();
}

function loadEventEdit() {
  var listEdit = document.querySelectorAll('.edit-account');
  listEdit.forEach(function (item) {
    item.onclick = function (e) {
      editAccountModal(true);
      var username = item.getAttribute('data-name');
      loadDataForEditModal(username);
    };
  });
}

function loadDataForEditModal(username) {
  $.ajax({
    url: '/account/getaccount',
    type: 'POST',
    data: {
      username: username
    },
    success: function success(data) {
      console.log(data);
    }
  });
}

function editAccountModal(status) {
  var modal = document.querySelector('.modal__edit-account');
  var layer = document.querySelector('.layer-hidden-modal');

  if (status) {
    modal.style.display = 'block';
    layer.style.display = 'block';
  } else {
    modal.style.display = 'none';
    layer.style.display = 'none';
  }
}

if (document.querySelector('.layer-hidden-modal')) {
  var layer = document.querySelector('.layer-hidden-modal');

  layer.onclick = function () {
    editAccountModal(false);
  };
}

if (document.querySelector('.close-edit-modal')) {
  var btnClose = document.querySelector('.close-edit-modal');

  btnClose.onclick = function () {
    editAccountModal(false);
  };
}