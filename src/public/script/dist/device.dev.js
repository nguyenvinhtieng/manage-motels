"use strict";

document.querySelectorAll('.header__items ul li')[2].classList.add('active-item');
loadEventEdit();
loadEventDelete();
var itemClicked; // Create device

if (document.getElementById('btn-add-device')) {
  var _validateDevice = function _validateDevice(name, price, indemnify, description) {
    if (name === '') {
      toast({
        title: 'Warrning',
        message: 'Name of device is required',
        type: 'error',
        duration: 3000
      });
      return false;
    }

    if (price == '' || price < 0) {
      toast({
        title: 'Warrning',
        message: 'Price is not valid',
        type: 'error',
        duration: 3000
      });
      return false;
    }

    if (indemnify == '' || indemnify < 0) {
      toast({
        title: 'Warrning',
        message: 'Indemnify is not valid',
        type: 'error',
        duration: 3000
      });
      return false;
    }

    if (description === '') {
      toast({
        title: 'Warrning',
        message: 'Description can not be empty',
        type: 'error',
        duration: 3000
      });
      return false;
    }

    return true;
  };

  var btnAdd = document.getElementById('btn-add-device');

  btnAdd.onclick = function (e) {
    e.preventDefault();
    var name = $('#name').val();
    var price = $('#price').val();
    var indemnify = $('#indemnify').val();
    var description = $('#description').val();

    if (_validateDevice(name, price, indemnify, description)) {
      $.ajax({
        url: '/device/add',
        type: 'POST',
        data: {
          name: name,
          price: price,
          indemnify: indemnify,
          description: description
        },
        success: function success(data) {
          toast({
            title: 'Succcessfull',
            message: 'Create device successfully',
            type: 'success',
            duration: 3000
          });
          addDataDevice(data.data);
          hiddenModal();
        }
      });
    }
  };
}

function addDataDevice(data) {
  var tbodyData = document.getElementById('devices');
  var tr = document.createElement('tr');
  tr.innerHTML = "\n                    <td>\n                    <div class=\"operations\">\n                        <div data-id=\"".concat(data._id, "\" class=\"edit edit-device\">\n                            <i class=\"fas fa-pen\"></i>\n                        </div>\n                        <div data-id=\"").concat(data._id, "\" data-name=\"").concat(data.name, "\" class=\"delete delete-device\">\n                            <i class=\"fas fa-trash-alt\"></i>\n                        </div>\n                    </div>\n                </td>\n                <td>").concat(data.name, "</td>\n                <td>").concat(data.price, "$</td>\n                <td>").concat(data.indemnify, "$</td>\n                <td>").concat(data.description, "</td>\n            ");
  tbodyData.appendChild(tr);
  resestDataAddModal();
  loadEventEdit();
  loadEventDelete();
}

function resestDataAddModal() {
  document.getElementById('name').value = '';
  document.getElementById('price').value = '';
  document.getElementById('indemnify').value = '';
  document.getElementById('description').value = '';
}

function hiddenModal() {
  var checkBoxModal = document.getElementById('modal__add-device');
  checkBoxModal.checked = false;
}
/**             Edit
********************
*/


function loadEventEdit() {
  if (document.querySelector('.edit-device')) {
    var itemsEdit = document.querySelectorAll('.edit-device');
    itemsEdit.forEach(function (item) {
      item.onclick = function (e) {
        itemClicked = item;
        modalEdit(true);
        var id = item.getAttribute('data-id');
        $.ajax({
          url: '/device/getData',
          type: 'POST',
          data: {
            id: id
          },
          success: function success(data) {
            if (data) {
              renderDataToModalEdit(data);
            } else {
              toast({
                title: 'Error',
                message: 'Has Error, please do not edit this page',
                type: 'error',
                duration: 3000
              });
            }
          }
        });
      };
    });
  }
}

function modalEdit(status) {
  var modalEdit = document.querySelector('.modal__edit-device');
  var hiddenModal = document.querySelector('#hidden-modal');

  if (status) {
    modalEdit.style.display = 'block';
    hiddenModal.style.display = "block";
  } else {
    modalEdit.style.display = 'none';
    hiddenModal.style.display = "none";
  }
}

if (document.querySelector('.close-edit-modal')) {
  var closeModal = document.querySelector('.close-edit-modal');

  closeModal.onclick = function () {
    modalEdit(false);
  };
}

if (document.querySelector('#hidden-modal')) {
  var _hiddenModal = document.querySelector('#hidden-modal');

  _hiddenModal.onclick = function () {
    modalEdit(false);
    modalDelete(false);
  };
}

function renderDataToModalEdit(data) {
  document.getElementById('id-edit').value = data._id;
  document.getElementById('name-edit').value = data.name;
  document.getElementById('price-edit').value = data.price;
  document.getElementById('indemnify-edit').value = data.indemnify;
  document.getElementById('description-edit').value = data.description;
  loadEventSave();
}

function loadEventSave() {
  var btnSave = document.getElementById('btn-save');

  btnSave.onclick = function (e) {
    e.preventDefault();
    var id = document.getElementById('id-edit').value;
    var name = document.getElementById('name-edit').value;
    var price = document.getElementById('price-edit').value;
    var indemnify = document.getElementById('indemnify-edit').value;
    var description = document.getElementById('description-edit').value;

    if (validateDevice(name, price, indemnify, description)) {
      updateDevice(id, name, price, indemnify, description);
      modalEdit(false);
    }
  };
}

function updateDevice(id, name, price, indemnify, description) {
  $.ajax({
    url: '/device/update',
    type: 'PUT',
    data: {
      id: id,
      name: name,
      price: price,
      indemnify: indemnify,
      description: description
    },
    success: function success(data) {
      if (data.status) {
        toast({
          title: 'Successfull',
          message: 'Device updated',
          type: 'success',
          duration: 3000
        });
        updateFillDevice(id, name, price, indemnify, description);
      } else {
        toast({
          title: 'Error',
          message: 'Please do not edit this page',
          type: 'error',
          duration: 3000
        });
      }
    }
  });
}

function updateFillDevice(id, name, price, indemnify, description) {
  var trElement = itemClicked.parentNode.parentNode.parentNode;
  trElement.innerHTML = "\n                        <td>\n                        <div class=\"operations\">\n                            <div data-id=\"".concat(id, "\" class=\"edit edit-device\">\n                                <i class=\"fas fa-pen\"></i>\n                            </div>\n                            <div data-id=\"").concat(id, "\" data-name=\"").concat(name, "\" class=\"delete delete-device\">\n                                <i class=\"fas fa-trash-alt\"></i>\n                            </div>\n                        </div>\n                    </td>\n                    <td>").concat(name, "</td>\n                    <td>").concat(price, "$</td>\n                    <td>").concat(indemnify, "$</td>\n                    <td>").concat(description, "</td>\n    ");
  loadEventEdit();
  loadEventDelete();
}
/**                      Delete
********************************
*/


function loadEventDelete() {
  var itemsDelete = document.querySelectorAll('.delete-device');
  itemsDelete.forEach(function (item) {
    item.onclick = function (e) {
      itemClicked = item;
      var id = item.getAttribute('data-id');
      var name = item.getAttribute('data-name');
      setDataModalDelete(id, name);
      modalDelete(true);
    };
  });
}

if (document.querySelector('.close-delete-modal')) {
  var btnClose = document.querySelector('.close-delete-modal');

  btnClose.onclick = function (e) {
    modalDelete(false);
  };
}

if (document.querySelector('.cancel-delete-modal')) {
  var btnCancelDeleteModal = document.querySelector('.cancel-delete-modal');

  btnCancelDeleteModal.onclick = function (e) {
    modalDelete(false);
  };
}

function setDataModalDelete(id, name) {
  var message = document.querySelector('.delete-device-message');
  var idInput = document.getElementById('id-delete-device');
  idInput.value = id;
  message.innerText = 'Are you sure want to delete this device (' + name + ')!';
}

function modalDelete(status) {
  var modalDelete = document.querySelector('.modal__confirm-delete');
  var hiddenModal = document.querySelector('#hidden-modal');

  if (status) {
    modalDelete.style.display = 'block';
    hiddenModal.style.display = "block";
  } else {
    modalDelete.style.display = 'none';
    hiddenModal.style.display = "none";
  }
}

if (document.getElementById('btn-delete')) {
  var btnDelete = document.getElementById('btn-delete');

  btnDelete.onclick = function (e) {
    var id = document.getElementById('id-delete-device').value;
    $.ajax({
      url: '/device/delete',
      type: 'DELETE',
      data: {
        id: id
      },
      success: function success(data) {
        if (data.status) {
          toast({
            title: 'Delete Device',
            message: data.message,
            type: 'success',
            duration: 3000
          });
          deleteViewItem();
        } else {
          toast({
            title: 'Error',
            message: data.message,
            type: 'error',
            duration: 3000
          });
        }
      }
    });
    modalDelete(false);
  };
}

function deleteViewItem() {
  var parent = document.getElementById('devices');
  var itemLi = itemClicked.parentNode.parentNode.parentNode;
  parent.removeChild(itemLi);
}