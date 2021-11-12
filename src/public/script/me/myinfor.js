document.querySelectorAll('.header__items ul li')[1].classList.add('active-item')

loadData()
function loadData(){
    $.ajax({
        url: '/me/getMyInfor',
        method: 'GET',
        success: function(data){
            console.log(data)
            renderData(data)
        }
    })
}

function renderData(data){
    let list = document.querySelector('#customers')
    data.forEach(function(item){
        let tr = document.createElement('tr')
        tr.innerHTML = `
        <td>${item.name}</td>
        <td>${item.sex}</td>
        <td>${item.identity}</td>
        <td>${item.roomnumber}</td>
        <td>${item.phone}</td>
        <td>${item.startday}</td>
        <td>${item.leaveday}</td>
        <td>${item.note}</td>
            `
        list.appendChild(tr)
    })
}