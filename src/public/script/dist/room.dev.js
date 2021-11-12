"use strict";

// view
document.querySelectorAll('.header__items ul li')[1].classList.add('active-item');
getDataRooms();
getDataDevice();
var itemClicked;

function hiddenCreateRoomModal() {
  document.getElementById('modal__add-room').checked = false;
}

function validateRoomData(name, maximum, area, price, description) {
  if (name === '') {
    showErrorToast("Name of room can not be empty");
    return false;
  }

  if (maximum === '' || maximum <= 0) {
    showErrorToast("Maximum people is not valid");
    return false;
  }

  if (area === '' || area < 0) {
    showErrorToast("Area is not valid");
    return false;
  }

  if (price === '' || price < 0) {
    showErrorToast("Price is not valid");
    return false;
  }

  if (description === '') {
    showErrorToast("Description can not be empty");
    return false;
  }

  return true;
}

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

function getDataRooms() {
  $.ajax({
    url: '/room/getData',
    type: 'GET',
    success: function success(data) {
      renderDataRoom(data);
    }
  });
}

function renderDataRoom(data) {
  var listRoom = document.getElementById('rooms');
  listRoom.innerHTML = '';
  data.forEach(function (item) {
    var tr = document.createElement('tr');
    tr.innerHTML = "\n                <td>\n                    <div class=\"operations\">\n                        <div data-id=".concat(item._id, " class=\"edit edit-room\">\n                            <i class=\"fas fa-pen\"></i>\n                        </div>\n                        <div data-id=").concat(item._id, " data-name=\"").concat(item.number, "\" class=\"delete delete-room\">\n                            <i class=\"fas fa-trash-alt\"></i>\n                        </div>\n                    </div>\n                </td>\n                <td>").concat(item.number, "</td>\n                <td>").concat(item.renter, "</td>\n                <td>").concat(item.maximum, "</td>\n                <td>").concat(item.numberpeople, "</td>\n                <td>").concat(item.area, " m2</td>\n                <td>").concat(item.price, " $</td>\n                <td>").concat(item.description, "</td>\n        ");
    var tdStatus = document.createElement('td');

    if (item.numberpeople === 0) {
      tdStatus.className = "empty";
      tdStatus.innerText = "Empty";
    } else {
      tdStatus.className = "hired";
      tdStatus.innerText = "Being hired";
    }

    tr.appendChild(tdStatus);
    listRoom.appendChild(tr);
  });
  loadEventEdit();
  loadEventDelete();
}

function resestDataCreateRoomModal() {
  document.getElementById('name').value = '';
  document.getElementById('maximum').value = '';
  document.getElementById('area').value = '';
  document.getElementById('price').value = '';
  document.getElementById('description').value = '';
}

if (document.getElementById('btn-create-room')) {
  var btnCreateRoom = document.getElementById('btn-create-room');

  btnCreateRoom.onclick = function (e) {
    e.preventDefault();
    var name = document.getElementById('name').value;
    var maximum = document.getElementById('maximum').value;
    var area = document.getElementById('area').value;
    var price = document.getElementById('price').value;
    var description = document.getElementById('description').value;

    if (validateRoomData(name, maximum, area, price, description)) {
      createRoom(name, maximum, area, price, description);
      hiddenCreateRoomModal();
      resestDataCreateRoomModal();
    }
  };
}

function addDataRoom(data) {
  var listRoom = document.getElementById('rooms');
  var tr = document.createElement('tr');
  tr.innerHTML = "\n                <td>\n                    <div class=\"operations\">\n                        <div data-id=".concat(data._id, " class=\"edit edit-room\">\n                            <i class=\"fas fa-pen\"></i>\n                        </div>\n                        <div data-id=").concat(data._id, " data-name=\"").concat(data.number, "\" class=\"delete delete-room\">\n                            <i class=\"fas fa-trash-alt\"></i>\n                        </div>\n                    </div>\n                </td>\n                <td>").concat(data.number, "</td>\n                <td>").concat(data.renter, "</td>\n                <td>").concat(data.maximum, "</td>\n                <td>").concat(data.numberpeople, "</td>\n                <td>").concat(data.area, " m2</td>\n                <td>").concat(data.price, " $</td>\n                <td>").concat(data.description, "</td>\n                <td class=\"empty\">Empty</td>\n        ");
  listRoom.appendChild(tr);
  loadEventEdit();
  loadEventDelete();
}

function createRoom(name, maximum, area, price, description) {
  $.ajax({
    url: '/room/create',
    type: 'POST',
    data: {
      number: name,
      maximum: maximum,
      area: area,
      price: price,
      description: description
    },
    success: function success(data) {
      if (data.status) {
        toast({
          title: 'Room created',
          message: data.message,
          type: 'success',
          duration: 3000
        });
        addDataRoom(data.data);
      } else {
        showErrorToast(data.message);
      }
    }
  });
}

function editModalStatus(status) {
  var modalEditRoom = document.querySelector('.modal__edit-room');
  var hiddenLayer = document.querySelector('#hidden-layer');

  if (status) {
    modalEditRoom.style.display = "block";
    hiddenLayer.style.display = "block";
  } else {
    modalEditRoom.style.display = "none";
    hiddenLayer.style.display = "none";
  }
}

if (document.getElementById('hidden-layer')) {
  var layer = document.getElementById('hidden-layer');

  layer.onclick = function (e) {
    modalDeleteStatus(false);
    editModalStatus(false);
  };
}

if (document.querySelector('.close-edit-room-modal')) {
  var btnClose = document.querySelector('.close-edit-room-modal');

  btnClose.onclick = function (e) {
    editModalStatus(false);
  };
}

function loadEventEdit() {
  var itemsEdit = document.querySelectorAll('.edit-room');
  itemsEdit.forEach(function (item) {
    item.onclick = function (e) {
      itemClicked = item;
      var id = item.getAttribute('data-id');
      editModalStatus(true);
      getDataRoom(id);
    };
  });
}

function getDataRoom(id) {
  // Get data room
  $.ajax({
    url: '/room/getDataRoom',
    type: 'POST',
    data: {
      id: id
    },
    success: function success(data) {
      if (data.status) {
        setDataToEditModal(data.data);
      } else {
        showErrorToast(data.message);
      }
    }
  }); // Get data Device In room

  $.ajax({
    url: '/room/deviceInRoom',
    type: 'POST',
    data: {
      id: id
    },
    success: function success(data) {
      if (data) {
        setDataDeviceInRoom(data);
      }
    }
  });
}

function resestDataDeviceInRoom() {
  if (document.querySelectorAll('.item-device')) {
    var listDevice = document.querySelectorAll('.item-device');
    listDevice.forEach(function (item) {
      item.checked = false;
    });
  }
}

function setDataDeviceInRoom(data) {
  resestDataDeviceInRoom();
  data.forEach(function (item) {
    var idRoom = document.getElementById(item.iddevice);
    idRoom.checked = true;
  });
}

function setDataToEditModal(data) {
  var name = document.getElementById('name-edit');
  var maximum = document.getElementById('maximum-edit');
  var area = document.getElementById('area-edit');
  var price = document.getElementById('price-edit');
  var description = document.getElementById('description-edit');
  var id = document.getElementById('id-edit');
  name.value = data.number;
  maximum.value = data.maximum;
  area.value = data.area;
  price.value = data.price;
  description.value = data.description;
  id.value = data._id;
}

function getDataDevice() {
  $.ajax({
    url: '/device/getDevices',
    type: 'GET',
    success: function success(data) {
      if (data) {
        renderDataDevice(data);
      }
    }
  });
}

function renderDataDevice(data) {
  var main = document.querySelector('.list-device-choose');
  main.innerHTML = '';
  data.forEach(function (item) {
    var div = document.createElement('div');
    div.className = "item";
    div.innerHTML = "\n            <input type=\"checkbox\" class=\"item-device\" id=\"".concat(item._id, "\" value=\"").concat(item._id, "\" >\n            <label for=\"").concat(item._id, "\">").concat(item.name, " (").concat(item.price, "$)</label>\n        ");
    main.appendChild(div);
  });
}

if (document.getElementById('btn-save')) {
  var btnSave = document.getElementById('btn-save');

  btnSave.onclick = function (e) {
    e.preventDefault();
    var name = document.getElementById('name-edit').value;
    var maximum = document.getElementById('maximum-edit').value;
    var area = document.getElementById('area-edit').value;
    var price = document.getElementById('price-edit').value;
    var description = document.getElementById('description-edit').value;
    var id = document.getElementById('id-edit').value;

    if (validateRoomData(name, maximum, area, price, description)) {
      updateRoomData(id, name, maximum, area, price, description);
    }

    editModalStatus(false);
  };
}

function getDeviceChecked(idroom) {
  var listDevice = document.querySelectorAll('.item-device');
  var listIdDevice = [];
  listDevice.forEach(function (item) {
    if (item.checked) {
      listIdDevice.push(item.value);
    }
  });
  saveDataDevice(idroom, listIdDevice);
}

function saveDataDevice(idroom, listIdDevice) {
  $.ajax({
    url: '/room/device',
    type: 'PUT',
    data: {
      idroom: idroom,
      listIdDevice: listIdDevice
    },
    success: function success(data) {
      if (data.status) {
        showSuccessToast(data.message);
      } else {
        showErrorToast(data.message);
      }
    }
  });
}

function updateRoomData(id, name, maximum, area, price, description) {
  $.ajax({
    url: '/room/update',
    type: 'PUT',
    data: {
      id: id,
      number: name,
      maximum: maximum,
      area: area,
      price: price,
      description: description
    },
    success: function success(data) {
      if (data.status) {
        changeDataRoom(data.data);
        showSuccessToast(data.message);
        getDeviceChecked(id);
      } else {
        showErrorToast(data.message);
      }
    }
  });
}

function changeDataRoom(data) {
  console.log(data);
  var tr = itemClicked.parentNode.parentNode.parentNode;
  console.log(tr);
  tr.innerHTML = "<td>\n                        <div class=\"operations\">\n                            <div data-id=".concat(data._id, " class=\"edit edit-room\">\n                                <i class=\"fas fa-pen\"></i>\n                            </div>\n                            <div data-id=").concat(data._id, " data-name=\"").concat(data.number, "\" class=\"delete delete-room\">\n                                <i class=\"fas fa-trash-alt\"></i>\n                            </div>\n                        </div>\n                    </td>\n                    <td>").concat(data.number, "</td>\n                    <td>").concat(data.renter, "</td>\n                    <td>").concat(data.maximum, "</td>\n                    <td>").concat(data.numberpeople, "</td>\n                    <td>").concat(data.area, " m2</td>\n                    <td>").concat(data.price, " $</td>\n                    <td>").concat(data.description, "</td>\n                ");
  var tdStatus = document.createElement('td');

  if (data.numberpeople === 0) {
    tdStatus.className = "empty";
    tdStatus.innerText = "Empty";
  } else {
    tdStatus.className = "hired";
    tdStatus.innerText = "Being hired";
  }

  tr.appendChild(tdStatus);
  loadEventEdit();
  loadEventDelete();
} // DELÊT ROOM


function loadEventDelete() {
  var listDelete = document.querySelectorAll('.delete-room');
  listDelete.forEach(function (item) {
    item.onclick = function () {
      itemClicked = item;
      modalDeleteStatus(true);
      var idRoom = item.getAttribute('data-id');
      var nameRoom = item.getAttribute('data-name');
      setDataToModalDeleteRoom(idRoom, nameRoom);
    };
  });
}

function setDataToModalDeleteRoom(idRoom, nameRoom) {
  document.getElementById('id-room-delete').value = idRoom;
  document.querySelector('.text-delete-modal').innerText = "\n        Are you sure want to delete this Room ( ".concat(nameRoom, " )!\n    ");
}

function modalDeleteStatus(status) {
  var modalDelete = document.querySelector('.modal__confirm-delete');
  var hiddenLayer = document.querySelector('#hidden-layer');

  if (status) {
    modalDelete.style.display = "block";
    hiddenLayer.style.display = "block";
  } else {
    modalDelete.style.display = "none";
    hiddenLayer.style.display = "none";
  }
}

if (document.querySelector('.close-modal-delete')) {
  var _btnClose = document.querySelector('.close-modal-delete');

  _btnClose.onclick = function (e) {
    modalDeleteStatus(false);
  };
}

if (document.querySelector('.cancel-modal-delete')) {
  var btnCancel = document.querySelector('.cancel-modal-delete');

  btnCancel.onclick = function (e) {
    modalDeleteStatus(false);
  };
}

if (document.querySelector('.btn-delete-room')) {
  var btnDelete = document.querySelector('.btn-delete-room');

  btnDelete.onclick = function (e) {
    e.preventDefault();
    var idRoom = document.getElementById('id-room-delete').value;
    modalDeleteStatus(false);
    deleteRoom(idRoom);
  };
}

function deleteRoom(idRoom) {
  $.ajax({
    url: '/room/delete',
    type: 'DELETE',
    data: {
      idroom: idRoom
    },
    success: function success(data) {
      if (data.status) {
        showSuccessToast(data.message);
        deleteDataView();
      } else {
        showErrorToast(data.message);
      }
    }
  });
}

function deleteDataView() {
  var parent = document.getElementById('rooms');
  var itemLi = itemClicked.parentNode.parentNode.parentNode;
  parent.removeChild(itemLi);
}