"use strict";

document.querySelectorAll('.header__items ul li')[0].classList.add('active-item');
var xmlhttp = new XMLHttpRequest();
var url = '/api/month.json';
xmlhttp.open("GET", url, true);
xmlhttp.send(null);
var datamonth = [];
var labelmonth = [];

xmlhttp.onreadystatechange = function (data) {
  if (this.readyState == 4 && this.status == 200) {
    var dt = JSON.parse(this.responseText);
    dt.ven.forEach(function (item) {
      labelmonth.push(item.Month);
      datamonth.push(item.v);
    });
    drawChartMonth(labelmonth, datamonth);
  }
};

function drawChartMonth(labelmonth, datamonth) {
  var ctx = document.getElementById('month').getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labelmonth,
      datasets: [{
        label: 'Doanh Thu',
        data: datamonth,
        backgroundColor: 'transparent',
        borderColor: 'red',
        borderWidth: 1
      }]
    },
    options: {
      elements: {
        line: {
          tension: 0
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

var xmlhttp = new XMLHttpRequest();
var url = '/api/year.json';
xmlhttp.open("GET", url, true);
xmlhttp.send(null);
var datayear = [];
var labelyear = [];

xmlhttp.onreadystatechange = function (data) {
  if (this.readyState == 4 && this.status == 200) {
    var dt = JSON.parse(this.responseText);
    dt.ven.forEach(function (item) {
      labelyear.push(item.Year);
      datayear.push(item.v);
    });
    drawChartYear(labelyear, datayear);
  }
};

function drawChartYear(labelyear, datayear) {
  var ctx = document.getElementById('year').getContext('2d');
  var myChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labelyear,
      datasets: [{
        label: 'Doanh Thu',
        data: datayear,
        backgroundColor: 'transparent',
        borderColor: 'blue',
        borderWidth: 1
      }]
    },
    options: {
      elements: {
        line: {
          tension: 0
        }
      },
      scales: {
        y: {
          beginAtZero: true
        }
      }
    }
  });
}

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