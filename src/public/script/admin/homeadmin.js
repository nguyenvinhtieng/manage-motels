document.querySelectorAll('.header__items ul li')[0].classList.add('active-item')

let btnView = document.querySelector('#btn-view')

btnView.onclick = (e) => {
    e.preventDefault();
    let year = document.querySelector('#year').value
    if (year == '' || year < 2000) {
        showErrorToast("Year a not valid")
    } else {
        let month = document.querySelector('#month').value
        // getData(year, month)
        if (month == '') {
            getDataYear(year)
        } else {
            getDataMonth(year, month)
        }
    }

}
function getDataYear(year) {
    $.ajax({
        url: '/admin/getrevenue-year',
        type: 'POST',
        data: { year },
        success: function (data) {
            const dataYear = data.data;
            renderChartYear(dataYear)
        }
    })
}
function getDataMonth(year, month) {
    $.ajax({
        url: '/admin/getrevenue-month',
        type: 'POST',
        data: { year, month },
        success: function (data) {
            renderDataMonth(data.data, year, month)
        }
    })
}
function renderChartYear(dataYear) {
    let month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    let main = document.querySelector('.revenue')
    main.innerHTML = ''
    dataYear.forEach((pr, index) => {
        let div = document.createElement('div')
        div.innerHTML = `Month ${month[index]} : ${pr}$`
        main.appendChild(div)
    })
}

function renderDataMonth(data, year, month) {
    let main = document.querySelector('.revenue')
    main.innerHTML = `Revenue month ${month}/${year} : ${data}$`
}

// function drawChartMonth(labelmonth, datamonth) {

//     var ctx = document.getElementById('month').getContext('2d');
//     var myChart = new Chart(ctx, {
//         type: 'line',
//         data: {
//             labels: labelmonth,
//             datasets: [{
//                 label: 'Doanh Thu',
//                 data: datamonth,
//                 backgroundColor: 'transparent',
//                 borderColor: 'red',
//                 borderWidth: 1
//             }]
//         },
//         options: {
//             elements: {
//                 line: {
//                     tension: 0
//                 }
//             },
//             scales: {
//                 y: {
//                     beginAtZero: true
//                 }
//             }
//         }
//     });
// }

// var xmlhttp = new XMLHttpRequest();
// var url = '/api/year.json'
// xmlhttp.open("GET", url, true);
// xmlhttp.send(null);
// let datayear = [];
// let labelyear = [];
// xmlhttp.onreadystatechange = function (data) {
//     if (this.readyState == 4 && this.status == 200) {
//         var dt = JSON.parse(this.responseText);
//         dt.ven.forEach(function (item) {
//             labelyear.push(item.Year)
//             datayear.push(item.v)
//         })
//         drawChartYear(labelyear, datayear)
//     }
// }

if (document.getElementById('btn-change')) {
    let btnChange = document.getElementById('btn-change')
    btnChange.onclick = (e) => {
        e.preventDefault();
        let oldP = document.getElementById('old-password').value
        let newP = document.getElementById('new-password').value
        let repeatP = document.getElementById('repeat-password').value
        if (validDate(oldP, newP, repeatP)) {
            updatePassword(oldP, newP, repeatP)
        }
    }
}

function updatePassword(oldP, newP, repeatP) {
    $.ajax({
        url: '/account/updatePass',
        method: 'POST',
        data: { currentpassword: oldP, password: newP },
        success: function (data) {
            if (data.status) {
                showSuccessToast(data.message)
                hiddenModal()
            } else {
                showErrorToast(data.message)
            }
        }
    })
}

function hiddenModal() {
    document.getElementById('modal-change-password').checked = false
}
function validDate(oldP, newP, repeatP) {
    if (oldP === '') {
        showErrorToast('Current password can not be empty')
        return false
    }
    if (newP === '') {
        showErrorToast('New password can not be empty')
        return false
    }
    if (newP.length < 8) {
        showErrorToast('New password need more than 8 characters')
        return false
    }
    if (newP !== repeatP) {
        showErrorToast('Repeat password not match')
        return false
    }
    return true

}