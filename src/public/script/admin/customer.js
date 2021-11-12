document.querySelectorAll('.header__items ul li')[4].classList.add('active-item')

getDataCustomers();
getDataRoom();
let itemClicked;
function showSuccessToast(message) {
    toast({
        title: "Successfully",
        message: message,
        type: 'success',
        duration: 3000
    })
}

function showErrorToast(message) {
    toast({
        title: "Error",
        message: message,
        type: 'error',
        duration: 3000
    })
}

function getDataCustomers() {
    $.ajax({
        url: '/customer/getData',
        type: 'GET',
        success: function (data) {
            renderDataToView(data)
        }
    })
}

function renderDataToView(data) {
    let main = document.querySelector('#customers')
    main.innerHTML = ''
    data.forEach(function (item) {
        let tr = document.createElement('tr')
        tr.innerHTML = `
                    <td>
                        <div class="operations">
                            <div class="view view-customer" data-id="${item._id}">
                                <i class="far fa-eye"></i>
                            </div>
                            <div class="edit edit-customer" data-id="${item._id}">
                                <i class="fas fa-pen"></i>
                            </div>
                        </div>
                    </td>
                    <td>${item.name}</td>
                    <td>${item.sex}</td>
                    <td>${item.identity}</td>
                    <td>${item.roomnumber}</td>
                    <td>${item.phone}</td>
                    <td>${item.startday}</td>
                    <td>${item.leaveday}</td>
                    <td>${item.note}</td>
            `

        let td = document.createElement("td")
        let today = new Date();
        let l = new Date(item.leaveday)
        let s = new Date(item.startday)
        let isHere = true;
        if (l < today || s > today) {
            isHere = false;
        }
        console.log(l < today)
        console.log(s > today)
        if (isHere) {
            td.innerText = "Live"
            td.className = "live"
        } else {
            td.innerText = "Not in there now"
            td.className = "not-live"
        }
        tr.appendChild(td)
        main.appendChild(tr)
    })

    loadEventView()
    loadEditEvent()
}

function getDataRoom() {
    $.ajax({
        url: '/room/getData',
        method: 'GET',
        success: function (data) {
            renderDataRoom(data)
        }
    })
}

function renderDataRoom(data) {
    let listRoom = document.querySelector('.rooms')
    let listRoomEdit = document.querySelector('.list-room-edit')
    data.forEach(item => {
        let option = document.createElement('option')
        option.value = item._id + '+' + item.number;
        option.innerText = item.number;
        listRoom.appendChild(option)
    })
    data.forEach(item => {
        let option = document.createElement('option')
        option.value = item._id + '+' + item.number;
        option.innerText = item.number;
        listRoomEdit.appendChild(option)
    })
}

if (document.querySelector('.btn-add-customer')) {
    let btnAdd = document.querySelector('.btn-add-customer')
    btnAdd.onclick = function (e) {
        e.preventDefault();
        //get data
        let name = document.getElementById('name').value
        let identity = document.getElementById('identity').value
        let phone = document.getElementById('phone').value
        let dateofbirth = document.getElementById('dayofbirtd').value
        let sex = document.getElementById('sex').value
        let job = document.getElementById('job').value
        let email = document.getElementById('email').value
        let note = document.getElementById('note').value
        let room = document.getElementById('room').value
        let roomData = room.split('+')
        let roomId = roomData[0]
        let roomNumber = roomData[1]
        let startday = document.getElementById('startday').value
        let frontIdentity = document.getElementById('front-identity').value
        let backIdentity = document.getElementById('back-identity').value

        if (validateInfor(name, identity, phone, dateofbirth, sex, job, email, note, room, startday, '', frontIdentity, backIdentity)) {
            addCustomer(name, identity, phone, dateofbirth, sex, job, email, note, roomId, roomNumber, startday, frontIdentity, backIdentity)
        }
    }
}

function validateInfor(name, identity, phone, dateofbirth, sex, job, email, note, room, startday, leaveday = '', frontIdentity, backIdentity) {
    if (name === '') {
        showErrorToast('Name is required')
        return false;
    }
    if (dateofbirth === '') {
        showErrorToast('Date ofbirth is required')
        return false;
    }
    var today = new Date();
    let toYear = today.getFullYear()
    let dob = new Date(dateofbirth)
    if (dob >= today) {
        showErrorToast('Dateofbirth is not valid, To day is :' + today)
        return false;
    }
    let yearDayOfBirth = dateofbirth.split('-')[0]
    yearDayOfBirth = parseInt(yearDayOfBirth)
    if (toYear - yearDayOfBirth > 15 && identity === '') {
        showErrorToast('This person is over 15 year old so identity card is required!')
        return false
    }
    if (sex === '') {
        showErrorToast('Sex is required')
        return false;
    }
    if (job === '') {
        showErrorToast('Job is required')
        return false;
    }
    if (room === "") {
        showErrorToast('Room was not choose')
        return false;
    }
    if (startday === "") {
        showErrorToast('Start day is required')
        return false;
    }
    if (leaveday !== '') {
        let ld = new Date(leaveday)
        let st = new Date(startday)
        if (ld < st) {
            showErrorToast('Leave day is not valid')
            return false;
        }
    }
    return true;
}

function resestDataAddModal() {
    document.getElementById('name').value = ''
    document.getElementById('identity').value = ''
    document.getElementById('phone').value = ''
    document.getElementById('dayofbirtd').value = ''
    document.getElementById('sex').value = ''
    document.getElementById('job').value = ''
    document.getElementById('email').value = ''
    document.getElementById('note').value = ''
    document.getElementById('room').value = ''
    document.getElementById('startday').value = ''
    document.getElementById('front-identity').value = ''
    document.getElementById('back-identity').value = ''
}

function addCustomer(name, identity, phone, dateofbirth, sex, job, email, note, roomId, roomNumber, startday, frontIdentity, backIdentity) {
    $.ajax({
        url: '/customer/add',
        method: 'POST',
        data: { name: name, identity: identity, phone: phone, dateofbirth: dateofbirth, sex: sex, job: job, email: email, note: note, roomid: roomId, roomnumber: roomNumber, startday: startday, frontIdentity: frontIdentity, backIdentity: backIdentity },
        success: function (data) {
            if (data.status) {
                showSuccessToast(data.message)
                addDataToView(data.data);
                hiddenModalAddCustomer()
                resestDataAddModal()
            } else {
                showErrorToast(data.message)
            }
        }
    })
}

function addDataToView(data) {
    let main = document.querySelector('#customers')
    let tr = document.createElement('tr')
    tr.innerHTML = `
            <td>
                <div class="operations">
                    <div class="view view-customer" data-id="${data._id}">
                        <i class="far fa-eye"></i>
                    </div>
                    <div class="edit edit-customer" data-id="${data._id}">
                        <i class="fas fa-pen"></i>
                    </div>
                </div>
            </td>
            <td>${data.name}</td>
            <td>${data.sex}</td>
            <td>${data.identity}</td>
            <td>${data.roomnumber}</td>
            <td>${data.phone}</td>
            <td>${data.startday}</td>
            <td>${data.leaveday}</td>
            <td>${data.note}</td>
            <td class="live">Live</td>
    `
    main.appendChild(tr)
    loadEventView()
    loadEditEvent()
}

function hiddenModalAddCustomer() {
    document.getElementById('modal__add-customer').checked = false;
}

function loadEventView() {
    let listView = document.querySelectorAll('.view-customer')
    listView.forEach(item => {
        item.onclick = (e) => {
            itemClicked = item
            let id = item.getAttribute('data-id')
            getDataOfCustomer(id, 'view')
            modalViewCustomer(true);
        }
    })
}

function modalViewCustomer(status) {
    let modal = document.querySelector('.modal__view-customer');
    let layer = document.querySelector('.hidden-modal-view');
    if (status) {
        modal.style.display = "block";
        layer.style.display = "block"
    } else {
        modal.style.display = "none";
        layer.style.display = "none"
    }
}

if (document.querySelector('.hidden-modal-view')) {
    let layer = document.querySelector('.hidden-modal-view')
    layer.onclick = (e) => {
        modalViewCustomer(false)
    }
}

if (document.querySelector('.close-view-modal')) {
    let btnClose = document.querySelector('.close-view-modal')
    btnClose.onclick = (e) => {
        modalViewCustomer(false);
    }
}

function getDataOfCustomer(id, modal) {
    $.ajax({
        url: '/customer/getCustomer',
        type: 'POST',
        data: { id },
        success: function (data) {
            if (modal === 'view') {
                renderDataToViewModal(data.data)
            } else if (modal === 'edit') {
                renderDataToEditModal(data.data)
            }
        }
    })
}

function renderDataToViewModal(data) {
    document.getElementById('name-view').value = data.name
    document.getElementById('identity-view').value = data.identity
    document.getElementById('phone-view').value = data.phone
    document.getElementById('dateofbirtd-view').value = data.dateofbirth
    document.getElementById('sex-view').value = data.sex
    document.getElementById('job-view').value = data.job
    document.getElementById('email-view').value = data.email
    document.getElementById('note-view').value = data.note
    document.getElementById('room-view').value = data.roomnumber
    document.getElementById('startday-view').value = data.startday
}

function renderDataToEditModal(data) {
    document.getElementById('name-edit').value = data.name
    document.getElementById('id-edit').value = data._id
    document.getElementById('identity-edit').value = data.identity
    document.getElementById('phone-edit').value = data.phone
    document.getElementById('dateofbirtd-edit').value = data.dateofbirth
    document.getElementById('job-edit').value = data.job
    document.getElementById('email-edit').value = data.email
    document.getElementById('note-edit').value = data.note
    document.getElementById('startday-edit').value = data.startday
    let sex = document.querySelector('.first-item-sex')
    sex.innerText = data.sex
    sex.value = data.sex
    let room = document.querySelector('.first-item-room')
    room.innerText = data.roomnumber
    room.value = data.roomid + '+' + data.roomnumber
}

function loadEditEvent() {
    let listEdit = document.querySelectorAll('.edit-customer')
    listEdit.forEach(item => {
        item.onclick = (e) => {
            itemClicked = item;
            let id = item.getAttribute('data-id')
            getDataOfCustomer(id, 'edit')
            modalEditCustomer(true)
        }
    })
}

function modalEditCustomer(status) {
    let modal = document.querySelector('.modal__edit-customer')
    let layer = document.querySelector('.hidden-modal-edit')
    if (status) {
        modal.style.display = "block"
        layer.style.display = "block"
    } else {
        modal.style.display = "none"
        layer.style.display = "none"
    }
}

if (document.querySelector('.hidden-modal-edit')) {
    let layer = document.querySelector('.hidden-modal-edit')
    layer.onclick = (e) => {
        modalEditCustomer(false)
    }
}

if (document.querySelector('.close-edit-modal')) {
    let btnClose = document.querySelector('.close-edit-modal')
    btnClose.onclick = (e) => {
        modalEditCustomer(false)
    }
}

if (document.querySelector('.btn-save')) {
    let btnSave = document.querySelector('.btn-save')
    btnSave.onclick = (e) => {
        e.preventDefault();
        let name = document.getElementById('name-edit').value
        let id = document.getElementById('id-edit').value
        let identity = document.getElementById('identity-edit').value
        let phone = document.getElementById('phone-edit').value
        let dateofbirth = document.getElementById('dateofbirtd-edit').value
        let sex = document.getElementById('sex-edit').value
        let job = document.getElementById('job-edit').value
        let email = document.getElementById('email-edit').value
        let note = document.getElementById('note-edit').value
        let room = document.getElementById('room-edit').value
        let roomData = room.split('+')
        let roomId = roomData[0]
        let roomNumber = roomData[1]
        let startday = document.getElementById('startday-edit').value
        let leaveday = document.getElementById('leaveday-edit').value
        let frontIdentity = document.getElementById('front-identity-edit').value
        let backIdentity = document.getElementById('back-identity-edit').value
        if (validateInfor(name, identity, phone, dateofbirth, sex, job, email, note, room, startday, leaveday, frontIdentity, backIdentity)) {
            updateCustomer(id, name, identity, phone, dateofbirth, sex, job, email, note, roomId, roomNumber, startday, leaveday, frontIdentity, backIdentity)
        }
    }
}

function updateCustomer(id, name, identity, phone, dateofbirth, sex, job, email, note, roomId, roomNumber, startday, leaveday, frontIdentity, backIdentity) {
    $.ajax({
        url: '/customer/update',
        method: 'PUT',
        data: { id, name, identity, phone, dateofbirth, sex, job, email, note, roomid: roomId, roomnumber: roomNumber, startday, leaveday, frontIdentity, backIdentity },
        success: function (data) {
            console.log(data)
            if (data.status) {
                editDataView(id, name, identity, phone, dateofbirth, sex, note, roomId, roomNumber, startday, leaveday)
                showSuccessToast(data.message)
                modalEditCustomer(false);
            } else {
                showErrorToast(data.message)
            }
        }
    })
}

function editDataView(id, name, identity, phone, dateofbirth, sex, note, roomId, roomNumber, startday, leaveday) {
    let tr = itemClicked.parentNode.parentNode.parentNode
    tr.innerHTML = `<td>
                        <div class="operations">
                            <div class="view view-customer" data-id="${id}">
                                <i class="far fa-eye"></i>
                            </div>
                            <div class="edit edit-customer" data-id="${id}">
                                <i class="fas fa-pen"></i>
                            </div>
                        </div>
                    </td>
                    <td>${name}</td>
                    <td>${sex}</td>
                    <td>${identity}</td>
                    <td>${roomNumber}</td>
                    <td>${phone}</td>
                    <td>${startday}</td>
                    <td>${leaveday}</td>
                    <td>${note}</td>`

    let td = document.createElement('td')
    let today = new Date();
    let l = new Date(leaveday)
    let s = new Date(startday)
    let isHere = true;
    if (l < today || s > today) {
        isHere = false;
    }
    if (isHere) {
        td.innerText = "Live"
        td.className = "live"
    } else {
        td.innerText = "Not in there now"
        td.className = "not-live"
    }
    tr.appendChild(td)
    loadEditEvent()
    loadEventView()
}