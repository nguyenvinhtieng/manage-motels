"use strict";

document.querySelectorAll('.header__items ul li')[4].classList.add('active-item');
getDataCustomers();
getDataRoom();
var itemClicked;

function showSuccessToast(message) {
  toast({
    title: "Successfully",
    message: message,
    type: 'success',
    duration: 3000
  });
}

function showErrorToast(message) {
  toast({
    title: "Error",
    message: message,
    type: 'error',
    duration: 3000
  });
}

function getDataCustomers() {
  $.ajax({
    url: '/customer/getData',
    type: 'GET',
    success: function success(data) {
      renderDataToView(data);
    }
  });
}

function renderDataToView(data) {
  var main = document.querySelector('#customers');
  main.innerHTML = '';
  data.forEach(function (item) {
    var tr = document.createElement('tr');
    tr.innerHTML = "\n                    <td>\n                        <div class=\"operations\">\n                            <div class=\"view view-customer\" data-id=\"".concat(item._id, "\">\n                                <i class=\"far fa-eye\"></i>\n                            </div>\n                            <div class=\"edit edit-customer\" data-id=\"").concat(item._id, "\">\n                                <i class=\"fas fa-pen\"></i>\n                            </div>\n                        </div>\n                    </td>\n                    <td>").concat(item.name, "</td>\n                    <td>").concat(item.sex, "</td>\n                    <td>").concat(item.identity, "</td>\n                    <td>").concat(item.roomnumber, "</td>\n                    <td>").concat(item.phone, "</td>\n                    <td>").concat(item.startday, "</td>\n                    <td>").concat(item.leaveday, "</td>\n                    <td>").concat(item.note, "</td>\n            ");
    var td = document.createElement("td");
    var isHere = true;

    if (item.leaveday) {
      isHere = false;
    }

    if (isHere) {
      td.innerText = "Live";
      td.className = "live";
    } else {
      td.innerText = "Not in there now";
      td.className = "not-live";
    }

    tr.appendChild(td);
    main.appendChild(tr);
  });
  loadEventView();
  loadEditEvent();
}

function getDataRoom() {
  $.ajax({
    url: '/room/getData',
    method: 'GET',
    success: function success(data) {
      renderDataRoom(data);
    }
  });
}

function renderDataRoom(data) {
  var listRoom = document.querySelector('.rooms');
  var listRoomEdit = document.querySelector('.list-room-edit');
  data.forEach(function (item) {
    var option = document.createElement('option');
    option.value = item._id + '+' + item.number;
    option.innerText = item.number;
    listRoom.appendChild(option);
  });
  data.forEach(function (item) {
    var option = document.createElement('option');
    option.value = item._id + '+' + item.number;
    option.innerText = item.number;
    listRoomEdit.appendChild(option);
  });
}

if (document.querySelector('.btn-add-customer')) {
  var btnAdd = document.querySelector('.btn-add-customer');

  btnAdd.onclick = function (e) {
    e.preventDefault(); //get data

    var name = document.getElementById('name').value;
    var identity = document.getElementById('identity').value;
    var phone = document.getElementById('phone').value;
    var dateofbirth = document.getElementById('dayofbirtd').value;
    var sex = document.getElementById('sex').value;
    var job = document.getElementById('job').value;
    var email = document.getElementById('email').value;
    var note = document.getElementById('note').value;
    var room = document.getElementById('room').value;
    var roomData = room.split('+');
    var roomId = roomData[0];
    var roomNumber = roomData[1];
    var startday = document.getElementById('startday').value;
    var frontIdentity = document.getElementById('front-identity').value;
    var backIdentity = document.getElementById('back-identity').value;

    if (validateInfor(name, identity, phone, dateofbirth, sex, job, email, note, room, startday, '', frontIdentity, backIdentity)) {
      addCustomer(name, identity, phone, dateofbirth, sex, job, email, note, roomId, roomNumber, startday, frontIdentity, backIdentity);
    }
  };
}

function validateInfor(name, identity, phone, dateofbirth, sex, job, email, note, room, startday) {
  var leaveday = arguments.length > 10 && arguments[10] !== undefined ? arguments[10] : '';
  var frontIdentity = arguments.length > 11 ? arguments[11] : undefined;
  var backIdentity = arguments.length > 12 ? arguments[12] : undefined;

  if (name === '') {
    showErrorToast('Name is required');
    return false;
  }

  if (dateofbirth === '') {
    showErrorToast('Date ofbirth is required');
    return false;
  }

  var today = new Date();
  var dob = new Date(dateofbirth);

  if (dob >= today) {
    showErrorToast('Dateofbirth is not valid, To day is :' + today);
    return false;
  }

  if (sex === '') {
    showErrorToast('Sex is required');
    return false;
  }

  if (job === '') {
    showErrorToast('Job is required');
    return false;
  }

  if (room === "") {
    showErrorToast('Room was not choose');
    return false;
  }

  if (startday === "") {
    showErrorToast('Start day is required');
    return false;
  }

  if (leaveday !== '') {
    var ld = new Date(leaveday);
    var st = new Date(startday);

    if (ld < st) {
      showErrorToast('Leave day is not valid');
      return false;
    }
  }

  return true;
}

function resestDataAddModal() {
  document.getElementById('name').value = '';
  document.getElementById('identity').value = '';
  document.getElementById('phone').value = '';
  document.getElementById('dayofbirtd').value = '';
  document.getElementById('sex').value = '';
  document.getElementById('job').value = '';
  document.getElementById('email').value = '';
  document.getElementById('note').value = '';
  document.getElementById('room').value = '';
  document.getElementById('startday').value = '';
  document.getElementById('front-identity').value = '';
  document.getElementById('back-identity').value = '';
}

function addCustomer(name, identity, phone, dateofbirth, sex, job, email, note, roomId, roomNumber, startday, frontIdentity, backIdentity) {
  $.ajax({
    url: '/customer/add',
    method: 'POST',
    data: {
      name: name,
      identity: identity,
      phone: phone,
      dateofbirth: dateofbirth,
      sex: sex,
      job: job,
      email: email,
      note: note,
      roomid: roomId,
      roomnumber: roomNumber,
      startday: startday,
      frontIdentity: frontIdentity,
      backIdentity: backIdentity
    },
    success: function success(data) {
      if (data.status) {
        showSuccessToast(data.message);
        addDataToView(data.data);
        hiddenModalAddCustomer();
        resestDataAddModal();
      } else {
        showErrorToast(data.message);
      }
    }
  });
}

function addDataToView(data) {
  var main = document.querySelector('#customers');
  var tr = document.createElement('tr');
  tr.innerHTML = "\n            <td>\n                <div class=\"operations\">\n                    <div class=\"view view-customer\" data-id=\"".concat(data._id, "\">\n                        <i class=\"far fa-eye\"></i>\n                    </div>\n                    <div class=\"edit edit-customer\" data-id=\"").concat(data._id, "\">\n                        <i class=\"fas fa-pen\"></i>\n                    </div>\n                </div>\n            </td>\n            <td>").concat(data.name, "</td>\n            <td>").concat(data.sex, "</td>\n            <td>").concat(data.identity, "</td>\n            <td>").concat(data.roomnumber, "</td>\n            <td>").concat(data.phone, "</td>\n            <td>").concat(data.startday, "</td>\n            <td>").concat(data.leaveday, "</td>\n            <td>").concat(data.note, "</td>\n            <td class=\"live\">Live</td>\n    ");
  main.appendChild(tr);
  loadEventView();
  loadEditEvent();
}

function hiddenModalAddCustomer() {
  document.getElementById('modal__add-customer').checked = false;
}

function loadEventView() {
  var listView = document.querySelectorAll('.view-customer');
  listView.forEach(function (item) {
    item.onclick = function (e) {
      itemClicked = item;
      var id = item.getAttribute('data-id');
      getDataOfCustomer(id, 'view');
      modalViewCustomer(true);
    };
  });
}

function modalViewCustomer(status) {
  var modal = document.querySelector('.modal__view-customer');
  var layer = document.querySelector('.hidden-modal-view');

  if (status) {
    modal.style.display = "block";
    layer.style.display = "block";
  } else {
    modal.style.display = "none";
    layer.style.display = "none";
  }
}

if (document.querySelector('.hidden-modal-view')) {
  var layer = document.querySelector('.hidden-modal-view');

  layer.onclick = function (e) {
    modalViewCustomer(false);
  };
}

if (document.querySelector('.close-view-modal')) {
  var btnClose = document.querySelector('.close-view-modal');

  btnClose.onclick = function (e) {
    modalViewCustomer(false);
  };
}

function getDataOfCustomer(id, modal) {
  $.ajax({
    url: '/customer/getCustomer',
    type: 'POST',
    data: {
      id: id
    },
    success: function success(data) {
      if (modal === 'view') {
        renderDataToViewModal(data.data);
      } else if (modal === 'edit') {
        renderDataToEditModal(data.data);
      }
    }
  });
}

function renderDataToViewModal(data) {
  document.getElementById('name-view').value = data.name;
  document.getElementById('identity-view').value = data.identity;
  document.getElementById('phone-view').value = data.phone;
  document.getElementById('dateofbirtd-view').value = data.dateofbirth;
  document.getElementById('sex-view').value = data.sex;
  document.getElementById('job-view').value = data.job;
  document.getElementById('email-view').value = data.email;
  document.getElementById('note-view').value = data.note;
  document.getElementById('room-view').value = data.roomnumber;
  document.getElementById('startday-view').value = data.startday;
}

function renderDataToEditModal(data) {
  document.getElementById('name-edit').value = data.name;
  document.getElementById('id-edit').value = data._id;
  document.getElementById('identity-edit').value = data.identity;
  document.getElementById('phone-edit').value = data.phone;
  document.getElementById('dateofbirtd-edit').value = data.dateofbirth;
  document.getElementById('job-edit').value = data.job;
  document.getElementById('email-edit').value = data.email;
  document.getElementById('note-edit').value = data.note;
  document.getElementById('startday-edit').value = data.startday;
  var sex = document.querySelector('.first-item-sex');
  sex.innerText = data.sex;
  sex.value = data.sex;
  var room = document.querySelector('.first-item-room');
  room.innerText = data.roomnumber;
  room.value = data.roomid + '+' + data.roomnumber;
}

function loadEditEvent() {
  var listEdit = document.querySelectorAll('.edit-customer');
  listEdit.forEach(function (item) {
    item.onclick = function (e) {
      itemClicked = item;
      var id = item.getAttribute('data-id');
      getDataOfCustomer(id, 'edit');
      modalEditCustomer(true);
    };
  });
}

function modalEditCustomer(status) {
  var modal = document.querySelector('.modal__edit-customer');
  var layer = document.querySelector('.hidden-modal-edit');

  if (status) {
    modal.style.display = "block";
    layer.style.display = "block";
  } else {
    modal.style.display = "none";
    layer.style.display = "none";
  }
}

if (document.querySelector('.hidden-modal-edit')) {
  var _layer = document.querySelector('.hidden-modal-edit');

  _layer.onclick = function (e) {
    modalEditCustomer(false);
  };
}

if (document.querySelector('.close-edit-modal')) {
  var _btnClose = document.querySelector('.close-edit-modal');

  _btnClose.onclick = function (e) {
    modalEditCustomer(false);
  };
}

if (document.querySelector('.btn-save')) {
  var btnSave = document.querySelector('.btn-save');

  btnSave.onclick = function (e) {
    e.preventDefault();
    var name = document.getElementById('name-edit').value;
    var id = document.getElementById('id-edit').value;
    var identity = document.getElementById('identity-edit').value;
    var phone = document.getElementById('phone-edit').value;
    var dateofbirth = document.getElementById('dateofbirtd-edit').value;
    var sex = document.getElementById('sex-edit').value;
    var job = document.getElementById('job-edit').value;
    var email = document.getElementById('email-edit').value;
    var note = document.getElementById('note-edit').value;
    var room = document.getElementById('room-edit').value;
    var roomData = room.split('+');
    var roomId = roomData[0];
    var roomNumber = roomData[1];
    var startday = document.getElementById('startday-edit').value;
    var leaveday = document.getElementById('leaveday-edit').value;
    var frontIdentity = document.getElementById('front-identity-edit').value;
    var backIdentity = document.getElementById('back-identity-edit').value;

    if (validateInfor(name, identity, phone, dateofbirth, sex, job, email, note, room, startday, leaveday, frontIdentity, backIdentity)) {
      updateCustomer(id, name, identity, phone, dateofbirth, sex, job, email, note, roomId, roomNumber, startday, leaveday, frontIdentity, backIdentity);
    }
  };
}

function updateCustomer(id, name, identity, phone, dateofbirth, sex, job, email, note, roomId, roomNumber, startday, leaveday, frontIdentity, backIdentity) {
  $.ajax({
    url: '/customer/update',
    method: 'PUT',
    data: {
      id: id,
      name: name,
      identity: identity,
      phone: phone,
      dateofbirth: dateofbirth,
      sex: sex,
      job: job,
      email: email,
      note: note,
      roomid: roomId,
      roomnumber: roomNumber,
      startday: startday,
      leaveday: leaveday,
      frontIdentity: frontIdentity,
      backIdentity: backIdentity
    },
    success: function success(data) {
      console.log(data);

      if (data.status) {
        editDataView(id, name, identity, phone, dateofbirth, sex, note, roomId, roomNumber, startday, leaveday);
        showSuccessToast(data.message);
        modalEditCustomer(false);
      } else {
        showErrorToast(data.message);
      }
    }
  });
}

function editDataView(id, name, identity, phone, dateofbirth, sex, note, roomId, roomNumber, startday, leaveday) {
  var tr = itemClicked.parentNode.parentNode.parentNode;
  tr.innerHTML = "<td>\n                        <div class=\"operations\">\n                            <div class=\"view view-customer\" data-id=\"".concat(id, "\">\n                                <i class=\"far fa-eye\"></i>\n                            </div>\n                            <div class=\"edit edit-customer\" data-id=\"").concat(id, "\">\n                                <i class=\"fas fa-pen\"></i>\n                            </div>\n                        </div>\n                    </td>\n                    <td>").concat(name, "</td>\n                    <td>").concat(sex, "</td>\n                    <td>").concat(identity, "</td>\n                    <td>").concat(roomNumber, "</td>\n                    <td>").concat(phone, "</td>\n                    <td>").concat(startday, "</td>\n                    <td>").concat(leaveday, "</td>\n                    <td>").concat(note, "</td>");
  var td = document.createElement('td');
  var isHere = true;

  if (leaveday) {
    isHere = false;
  }

  if (isHere) {
    td.innerText = "Live";
    td.className = "live";
  } else {
    td.innerText = "Not in there now";
    td.className = "not-live";
  }

  tr.appendChild(td);
  loadEditEvent();
  loadEventView();
}