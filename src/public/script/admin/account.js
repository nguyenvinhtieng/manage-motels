document.querySelectorAll('.header__items ul li')[3].classList.add('active-item')

getDataAccounts();
getDataRoom();
let itemClicked

function showErrorToast(message) {
    toast({
        title: 'Error',
        message: message,
        type: 'error',
        duration: 3000,
    })
}
function showSuccessToast(message) {
    toast({
        title: 'Success',
        message: message,
        type: 'success',
        duration: 3000,
    })
}

function getDataAccounts() {
    $.ajax({
        url: '/account/getData',
        type: 'GET',
        success: function (data) {
            renderDataAccount(data)
        }
    })
}

function renderDataAccount(data) {
    let main = document.querySelector('#accounts');
    main.innerHTML = ''
    data.forEach(item => {
        let tr = document.createElement('tr')
        if (item.role === 'guest') {
            tr.innerHTML = `
                        <td>
                        <div class="operations">
                            <div class="edit edit-account" data-name="${item.username}">
                                <i class="fas fa-pen"></i>
                            </div>
                            <div class="delete delete-account"  data-name="${item.username}">
                                <i class="fas fa-trash-alt"></i>
                            </div>
                        </div>
                    </td>
                    <td>${item.username}</td>
                    <td>${item.roomnumber}</td>
                    <td> <a href="mailto:${item.email} ">${item.email} </a> </td>
                    <td>Yes</td>
            `
        } else {

        }


        main.appendChild(tr);
    })

    loadEventEdit();
    loadEventDelete();
}


function getDataRoom() {
    $.ajax({
        url: '/room/getData',
        type: 'GET',
        success: function (data) {
            renderDataRoom(data);
        }
    })
}

function renderDataRoom(data) {
    let list = document.getElementById('list-room')
    let listEdit = document.getElementById('room-edit');
    data.forEach(function (item) {
        let option = document.createElement('option')
        option.value = item._id + '+' + item.number;
        option.innerText = item.number;
        list.appendChild(option);
    })

    data.forEach(function (item) {
        let option = document.createElement('option')
        option.value = item._id + '+' + item.number;
        option.innerText = item.number;
        listEdit.appendChild(option);
    })

}

function validateAccount(username, room, email) {
    if (username === '') {
        showErrorToast("Username can not be empty")
        return false;
    }
    if (room === '') {
        showErrorToast("Room was not choose")
        return false;
    }
    if (email === '') {
        showErrorToast("Email can not be empty")
        return false;
    }
    return true;
}

if (document.getElementById('btn-create-account')) {
    let btnCreate = document.getElementById('btn-create-account')
    btnCreate.onclick = function (e) {
        e.preventDefault()
        let username = document.getElementById('username').value
        let room = document.getElementById('list-room').value
        let email = document.getElementById('email').value
        let roomData = room.split('+')
        let roomId = roomData[0];
        let roomNumber = roomData[1];
        if (validateAccount(username, room, email)) {
            createAccount(username, roomId, email, roomNumber);
        }
    }
}

function createAccount(username, room, email, roomnumber) {
    $.ajax({
        url: '/account/create',
        type: 'POST',
        data: {
            username: username,
            roomid: room,
            roomnumber: roomnumber,
            email: email
        },
        success: function (data) {
            console.log(data);
            if (data.status) {
                showSuccessToast(data.message)
                renderDataAccountView(username, roomnumber, email)
                //sendMailPassword();
            } else {
                showErrorToast(data.message)
            }
            hiddenCreateAccountModal()
            resestDataModalCreate();
        }
    })
}

function resestDataModalCreate() {
    document.getElementById('username').value = ''
    document.getElementById('list-room').value = ''
    document.getElementById('email').value = ''
}

function hiddenCreateAccountModal() {
    document.querySelector('#modal__add-account').checked = false;
}

function renderDataAccountView(username, roomnumber, email) {
    let tr = document.createElement('tr')
    tr.innerHTML = `
                    <td>
                    <div class="operations">
                        <div class="edit edit-account" data-name="${username}">
                            <i class="fas fa-pen"></i>
                        </div>
                        <div class="delete delete-account"  data-name="${username}">
                            <i class="fas fa-trash-alt"></i>
                        </div>
                    </div>
                </td>
                <td>${username}</td>
                <td>${roomnumber}</td>
                <td>${email}</td>
                <td>Yes</td>
    `

    let main = document.querySelector('#accounts');
    main.appendChild(tr)
    loadEventEdit()
    loadEventDelete();
}

function loadEventEdit() {
    let listEdit = document.querySelectorAll('.edit-account')
    listEdit.forEach(item => {
        item.onclick = (e) => {
            itemClicked = item
            editAccountModal(true);
            let username = item.getAttribute('data-name')
            loadDataForEditModal(username);
        }
    })
}

function loadDataForEditModal(username) {
    $.ajax({
        url: '/account/getaccount',
        type: 'POST',
        data: { username: username },
        success: function (data) {
            if (!data?.status) {
                showErrorToast(data?.message)
            } else {
                renderDataToEditModal(data.data)
            }
        }
    })
}

function renderDataToEditModal(data) {
    let usernameBox = document.getElementById('username-edit')
    let firstitem = document.getElementById('first-item')
    let emailBox = document.getElementById('email-edit')
    usernameBox.value = data.username
    emailBox.value = data.email
    firstitem.value = data.roomid + '+' + data.roomnumber
    firstitem.innerText = data.roomnumber
}

function editAccountModal(status) {
    let modal = document.querySelector('.modal__edit-account')
    let layer = document.querySelector('.layer-hidden-modal')
    if (status) {
        modal.style.display = 'block'
        layer.style.display = 'block'
    }
    else {
        modal.style.display = 'none'
        layer.style.display = 'none'
    }
}

if (document.querySelector('.layer-hidden-modal')) {
    let layer = document.querySelector('.layer-hidden-modal')
    layer.onclick = () => {
        editAccountModal(false);
        modalDelete(false)
    }
}

if (document.querySelector('.close-edit-modal')) {
    let btnClose = document.querySelector('.close-edit-modal')
    btnClose.onclick = () => { editAccountModal(false) }
}

if (document.querySelector('#btn-update')) {
    let btnUpdate = document.querySelector('#btn-update')
    btnUpdate.onclick = (e) => {
        e.preventDefault();
        let username = document.getElementById('username-edit').value
        let room = document.getElementById('room-edit').value
        let email = document.getElementById('email-edit').value
        let roomData = room.split('+')
        let roomId = roomData[0];
        let roomNumber = roomData[1];
        if (validateAccount(username, room, email)) {
            updateAccount(username, roomId, roomNumber, email)
        }
    }
}

function updateAccount(username, roomId, roomNumber, email) {
    $.ajax({
        url: '/account/update',
        type: 'PUT',
        data: { username, roomid: roomId, roomnumber: roomNumber, email },
        success: function (data) {
            if (data.status) {
                showSuccessToast(data.message)
                editAccountModal(false)
                setDataAccount(username, roomNumber, email)
            }
            else {
                showErrorToast(data.message)
            }
        }
    })
}

function setDataAccount(username, roomnumber, email) {
    let tr = itemClicked.parentNode.parentNode.parentNode
    tr.innerHTML = ''
    console.log(tr);
    tr.innerHTML = `<td>
                        <div class="operations">
                            <div class="edit edit-account" data-name="${username}">
                                <i class="fas fa-pen"></i>
                            </div>
                            <div class="delete delete-account"  data-name="${username}">
                                <i class="fas fa-trash-alt"></i>
                            </div>
                        </div>
                    </td>
                    <td>${username}</td>
                    <td>${roomnumber}</td>
                    <td>${email}</td>
                    <td>Yes</td>
            `
    loadEventEdit()
    loadEventDelete();
}

function loadEventDelete() {
    let listDelete = document.querySelectorAll('.delete-account')
    listDelete.forEach(item => {
        item.onclick = () => {
            itemClicked = item;
            let username = item.getAttribute('data-name')
            renderDataToDeleteModal(username);
            modalDelete(true)
        }
    })
}

function modalDelete(status) {
    let modal = document.querySelector('.modal__confirm-delete')
    let layer = document.querySelector('.layer-hidden-modal')
    if (status) {
        modal.style.display = 'block'
        layer.style.display = 'block'
    } else {
        modal.style.display = 'none'
        layer.style.display = 'none'
    }
}

if (document.querySelector('.close-delete-modal')) {
    let btnClose = document.querySelector('.close-delete-modal')
    btnClose.onclick = () => { modalDelete(false) }
}

if (document.querySelector('.btn-cancel')) {
    let btnCancel = document.querySelector('.btn-cancel')
    btnCancel.onclick = () => { modalDelete(false) }
}

if (document.querySelector('.btn-delete')) {
    let btnDelete = document.querySelector('.btn-delete')
    btnDelete.onclick = (e) => {
        e.preventDefault();
        let username = document.querySelector('#username-delete').value
        deleteAccount(username)
    }
}

function deleteAccount(username) {
    $.ajax({
        url: '/account/delete',
        type: 'DELETE',
        data: { username: username },
        success: function (data) {
            console.log(data)
            if (data.status) {
                showSuccessToast(data.message)
                deleteAccountView();
            } else {
                showErrorToast(data.message)
            }
            modalDelete(false)
        }
    })
}

function renderDataToDeleteModal(username) {
    let inputUsername = document.querySelector('#username-delete')
    inputUsername.value = username
}

function deleteAccountView() {
    let tr = itemClicked.parentNode.parentNode.parentNode
    let parent = document.querySelector('#accounts')
    parent.removeChild(tr)
}