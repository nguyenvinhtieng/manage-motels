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
    var dt = JSON.parse(this.responseText); //console.log(datamonth);

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
    var dt = JSON.parse(this.responseText); //console.log(datamonth);

    dt.ven.forEach(function (item) {
      labelyear.push(item.Year);
      datayear.push(item.v);
    });
    console.log(datayear);
    console.log(labelyear);
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