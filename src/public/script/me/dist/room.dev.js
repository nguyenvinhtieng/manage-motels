"use strict";

document.querySelectorAll('.header__items ul li')[2].classList.add('active-item');
loadData();
var sum = 0;

function loadData() {
  $.ajax({
    url: '/me/device',
    method: 'GET',
    success: function success(data) {
      renderData(data);
    }
  });
}

function renderData(data) {
  var list = document.getElementById('devices');
  data.forEach(function (item) {
    var tr = document.createElement('tr');
    tr.innerHTML = "\n        <td>".concat(item.name, "</td>\n        <td>").concat(item.price, "</td>\n        <td>").concat(item.indemnify, "</td>\n        <td>").concat(item.description, "</td>    \n        ");
    list.appendChild(tr);
    sum += item.price;
  });
  getTotal();
}

function getTotal() {
  var price = Number(document.getElementById('price-room').innerText);
  sum = sum + price;
  var total = document.querySelector('.total');
  total.innerText = 'Total : ' + sum + '$/month';
}