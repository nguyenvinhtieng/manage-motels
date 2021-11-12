"use strict";

document.querySelectorAll('.header__items ul li')[5].classList.add('active-item');
var itemClicked;
getDataNotification();

function getDataNotification() {
  $.ajax({
    url: '/notification/getData',
    type: 'GET',
    success: function success(data) {
      if (data.status) {
        renderData(data.data);
      }
    }
  });
}

function renderData(data) {
  var ul = document.getElementById('list-item');
  ul.innerHTML = "";
  data.forEach(function (item) {
    var li = document.createElement('li');
    li.className = 'item-notification';
    li.innerHTML = "\n                <div class=\"delete-noti\" data-id=".concat(item._id, ">\n                    <i class=\"fas fa-trash\"></i>\n                </div>\n                <div class=\"content\">\n                    <div class=\"text\">\n                        ").concat(item.title, "\n                        <span class=\"time\">\n                            ( ").concat(handleDate(item.createdAt), " )\n                        </span>\n                    </div>\n                    <a href=\"/notification/view/").concat(item._id, "\">Details...</a>\n                </div>\n            ");
    ul.appendChild(li);
  });
  loadEventDelete();
}

function handleDate(date) {
  return date.slice(0, 10);
}

if (document.querySelector('.btn-create')) {
  var btnCreate = document.querySelector('.btn-create');

  btnCreate.onclick = function (e) {
    e.preventDefault();
    var title = document.querySelector('#title').value;
    var text = document.querySelector('#text').value;

    if (validdate(title, text)) {
      createNotification(title, text);
    }
  };
}

function createNotification(title, text) {
  $.ajax({
    url: '/notification/create',
    type: 'POST',
    data: {
      title: title,
      text: text
    },
    success: function success(data) {
      if (data.status) {
        hideModal();
        resetData();
        showSuccessToast(data.message);
        addNotificationToView(data.data);
      } else {
        showErrorToast('Has error creating notification');
      }
    }
  });
}

function addNotificationToView(data) {
  var ul = document.getElementById('list-item');
  var li = document.createElement('li');
  li.className = 'item-notification';
  li.innerHTML = "\n            <div class=\"delete-noti\" data-id=".concat(data._id, ">\n                <i class=\"fas fa-trash\"></i>\n            </div>\n            <div class=\"content\">\n                <div class=\"text\">\n                    ").concat(data.title, "\n                    <span class=\"time\">\n                        ( ").concat(data.createdAt, " )\n                    </span>\n                </div>\n                <a href=\"/notification/view/").concat(data._id, "\">Details...</a>\n            </div>\n        ");

  if (document.querySelectorAll('.item-notification')) {
    var item0 = document.querySelectorAll('.item-notification')[0];
    ul.insertBefore(li, item0);
  } else {
    appendChild(ul, li);
  }

  loadEventDelete();
}

function resetData() {
  document.querySelector('#title').value = '';
  document.querySelector('#text').value = '';
}

function hideModal() {
  document.querySelector('#modal-create-notification').checked = false;
}

function validdate(title, text) {
  if (title === '') {
    showErrorToast('Title can not be empty');
    return false;
  }

  if (text === '') {
    showErrorToast('Content can not be empty');
    return false;
  }

  return true;
}

function loadEventDelete() {
  var listDelete = document.querySelectorAll('.delete-noti');
  listDelete.forEach(function (item) {
    item.onclick = function (e) {
      itemClicked = item;
      var id = item.getAttribute('data-id');
      setDataToModalDelete(id);
      modalDeleteNotification(true);
    };
  });
}

function setDataToModalDelete(id) {
  document.querySelector('#id-delete-notification').value = id;
}

if (document.querySelector('.close-delete-modal')) {
  var btnClose = document.querySelector('.close-delete-modal');

  btnClose.onclick = function (e) {
    modalDeleteNotification(false);
  };
}

if (document.querySelector('.cancel-delete-modal')) {
  var btnCancel = document.querySelector('.cancel-delete-modal');

  btnCancel.onclick = function (e) {
    modalDeleteNotification(false);
  };
}

function modalDeleteNotification(status) {
  var modal = document.querySelector('.modal__confirm-delete');
  var layer = document.querySelector('.layer-close');

  if (status) {
    modal.style.display = 'block';
    layer.style.display = 'block';
  } else {
    modal.style.display = 'none';
    layer.style.display = 'none';
  }
}

if (document.querySelector('.layer-close')) {
  var layer = document.querySelector('.layer-close');

  layer.onclick = function (e) {
    modalDeleteNotification(false);
  };
}

if (document.querySelector('#btn-delete')) {
  var btnDelete = document.querySelector('#btn-delete');

  btnDelete.onclick = function (e) {
    var id = document.querySelector('#id-delete-notification').value;
    DeleteNotification(id);
  };
}

function DeleteNotification(id) {
  $.ajax({
    url: '/notification/delete',
    type: 'DELETE',
    data: {
      _id: id
    },
    success: function success(data) {
      if (data.status) {
        modalDeleteNotification(false);
        showSuccessToast(data.message);
        deleteFromView();
      } else {
        showErrorToast(data.message);
      }
    }
  });
}

function deleteFromView() {
  var li = itemClicked.parentNode;
  var parent = document.querySelector('#list-item');
  parent.removeChild(li);
}