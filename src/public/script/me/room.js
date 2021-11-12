document.querySelectorAll('.header__items ul li')[2].classList.add('active-item')

loadData()
let sum = 0;
function loadData() {
    $.ajax({
        url: '/me/device',
        method: 'GET',
        success: function (data) {
            renderData(data)
        }
    })
}

function renderData(data) {
    let list = document.getElementById('devices')
    data.forEach(function (item) {
        let tr = document.createElement('tr')
        tr.innerHTML = `
        <td>${item.name}</td>
        <td>${item.price}</td>
        <td>${item.indemnify}</td>
        <td>${item.description}</td>    
        `
        list.appendChild(tr)
        sum += item.price
    })
    getTotal();
}


function getTotal() {
    let price = Number(document.getElementById('price-room').innerText)
    sum = sum + price
    let total = document.querySelector('.total')
    total.innerText = 'Total : ' + price + '$/month'
}

