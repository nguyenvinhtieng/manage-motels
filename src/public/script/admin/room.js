// view
document.querySelectorAll('.header__items ul li')[1].classList.add('active-item')

getDataRooms()
getDataDevice();

let itemClicked;
function hiddenCreateRoomModal(){
    document.getElementById('modal__add-room').checked = false;
}

function validateRoomData(name, maximum, area, price, description){
    if(name === ''){
        showErrorToast("Name of room can not be empty")
        return false;
    }
    if(maximum === '' || maximum <= 0){
        showErrorToast("Maximum people is not valid")
        return false;
    }
    if(area === '' || area < 0){
        showErrorToast("Area is not valid")
        return false;
    }
    if(price === '' || price < 0){
        showErrorToast("Price is not valid")
        return false;
    }
    if(description === ''){
        showErrorToast("Description can not be empty")
        return false;
    }
    return true;
}

function showErrorToast(message){
    toast({
        title: 'Error',
        message: message,
        type: 'error',
        duration: 3000,
    })
}
function showSuccessToast(message){
    toast({
        title: 'Success',
        message: message,
        type: 'success',
        duration: 3000,
    })
}
function getDataRooms(){
    $.ajax({
        url: '/room/getData',
        type: 'GET',
        success: function(data){
            renderDataRoom(data)
        }
    })
}

function renderDataRoom(data){
    let listRoom = document.getElementById('rooms')
    listRoom.innerHTML = ''
    data.forEach( item => {
        let tr = document.createElement('tr')
        tr.innerHTML = `
                <td>
                    <div class="operations">
                        <div data-id=${item._id} class="edit edit-room">
                            <i class="fas fa-pen"></i>
                        </div>
                        <div data-id=${item._id} data-name="${item.number}" class="delete delete-room">
                            <i class="fas fa-trash-alt"></i>
                        </div>
                    </div>
                </td>
                <td>${item.number}</td>
                <td>${item.renter}</td>
                <td>${item.maximum}</td>
                <td>${item.numberpeople}</td>
                <td>${item.area} m2</td>
                <td>${item.price} $</td>
                <td>${item.description}</td>
        `   

        let tdStatus = document.createElement('td')
        if(item.numberpeople === 0){
            tdStatus.className = "empty"
            tdStatus.innerText = "Empty"
        } else {
            tdStatus.className = "hired"
            tdStatus.innerText = "Being hired"
        }
        tr.appendChild(tdStatus)
        listRoom.appendChild(tr)
    })
    loadEventEdit()
    loadEventDelete();
}

function resestDataCreateRoomModal(){
    document.getElementById('name').value = ''
    document.getElementById('maximum').value = ''
    document.getElementById('area').value = ''
    document.getElementById('price').value = ''
    document.getElementById('description').value = ''
}

if(document.getElementById('btn-create-room')){
    let btnCreateRoom = document.getElementById('btn-create-room')
    btnCreateRoom.onclick = (e)=>{
        e.preventDefault();
        let name = document.getElementById('name').value
        let maximum = document.getElementById('maximum').value
        let area = document.getElementById('area').value
        let price = document.getElementById('price').value
        let description = document.getElementById('description').value
        if(validateRoomData(name, maximum, area, price, description)){
            createRoom(name, maximum, area, price, description)
            hiddenCreateRoomModal()
            resestDataCreateRoomModal()
        }

    }
}

function addDataRoom(data){
    let listRoom = document.getElementById('rooms')
    let tr = document.createElement('tr')
    tr.innerHTML = `
                <td>
                    <div class="operations">
                        <div data-id=${data._id} class="edit edit-room">
                            <i class="fas fa-pen"></i>
                        </div>
                        <div data-id=${data._id} data-name="${data.number}" class="delete delete-room">
                            <i class="fas fa-trash-alt"></i>
                        </div>
                    </div>
                </td>
                <td>${data.number}</td>
                <td>${data.renter}</td>
                <td>${data.maximum}</td>
                <td>${data.numberpeople}</td>
                <td>${data.area} m2</td>
                <td>${data.price} $</td>
                <td>${data.description}</td>
                <td class="empty">Empty</td>
        `
        listRoom.appendChild(tr)
    loadEventEdit()
    loadEventDelete();
}

function createRoom(name, maximum, area, price, description){
    $.ajax({
        url: '/room/create',
        type: 'POST',
        data: {
            number: name, maximum, area, price, description
        },
        success: function(data){
            if(data.status){
                toast({
                    title: 'Room created',
                    message: data.message,
                    type: 'success',
                    duration: 3000
                })
                addDataRoom(data.data);
            } else{
                showErrorToast(data.message)
            }
        }
    })
}

function editModalStatus(status){
    let modalEditRoom = document.querySelector('.modal__edit-room')
    let hiddenLayer = document.querySelector('#hidden-layer');
    if(status){
        modalEditRoom.style.display = "block"
        hiddenLayer.style.display = "block"
    }
    else{
        modalEditRoom.style.display = "none"
        hiddenLayer.style.display = "none"
    }
}

if(document.getElementById('hidden-layer')){
    let layer = document.getElementById('hidden-layer')
    layer.onclick = (e) =>{
        modalDeleteStatus(false);
        editModalStatus(false);
    }
}

if(document.querySelector('.close-edit-room-modal')){
    let btnClose = document.querySelector('.close-edit-room-modal')
    btnClose.onclick = (e)=>{
        editModalStatus(false);
    }
}

function loadEventEdit(){
    let itemsEdit = document.querySelectorAll('.edit-room')
    itemsEdit.forEach(function(item){
        item.onclick = function(e){
            itemClicked = item;
            let id = item.getAttribute('data-id')
            editModalStatus(true);
            getDataRoom(id)
        }
    })
}

function getDataRoom(id){
    // Get data room
    $.ajax({
        url: '/room/getDataRoom',
        type: 'POST',
        data: {id},
        success: function(data){
            if(data.status){
                setDataToEditModal(data.data)
            } else{
                showErrorToast(data.message)
            }
        }
    })

    // Get data Device In room
    $.ajax({
        url: '/room/deviceInRoom',
        type: 'POST',
        data: {id},
        success: function(data){
            if(data){
                setDataDeviceInRoom(data)
            }
        }
    })
}

function resestDataDeviceInRoom(){
    if(document.querySelectorAll('.item-device')){
        let listDevice = document.querySelectorAll('.item-device')
        listDevice.forEach(item=>{item.checked=false})
    }
}

function setDataDeviceInRoom(data){
    resestDataDeviceInRoom()
    data.forEach(item =>{
        let idRoom = document.getElementById(item.iddevice)
        idRoom.checked = true
    })
}

function setDataToEditModal(data){
    let name = document.getElementById('name-edit')
    let maximum = document.getElementById('maximum-edit')
    let area = document.getElementById('area-edit')
    let price = document.getElementById('price-edit')
    let description = document.getElementById('description-edit')
    let id = document.getElementById('id-edit')

    name.value = data.number
    maximum.value = data.maximum
    area.value = data.area
    price.value = data.price
    description.value = data.description
    id.value = data._id;

}

function getDataDevice(){
    $.ajax({
        url: '/device/getDevices',
        type: 'GET',
        success: function(data){
            if(data){
                renderDataDevice(data)
            }
        }
    })
}

function renderDataDevice(data){
    let main = document.querySelector('.list-device-choose')
    main.innerHTML = '';
    data.forEach(function(item) {
        let div = document.createElement('div')
        div.className = "item"

        div.innerHTML = `
            <input type="checkbox" class="item-device" id="${item._id}" value="${item._id}" >
            <label for="${item._id}">${item.name} (${item.price}$)</label>
        `
        main.appendChild(div)
    })
}

if(document.getElementById('btn-save')){
    let btnSave = document.getElementById('btn-save')
    btnSave.onclick = (e)=>{
        e.preventDefault();
        let name = document.getElementById('name-edit').value
        let maximum = document.getElementById('maximum-edit').value
        let area = document.getElementById('area-edit').value
        let price = document.getElementById('price-edit').value
        let description = document.getElementById('description-edit').value
        let id = document.getElementById('id-edit').value
        if(validateRoomData(name, maximum, area, price, description)){
            updateRoomData(id, name, maximum, area, price, description)
            
        }
        editModalStatus(false);
    }
}

function getDeviceChecked(idroom){
    let listDevice = document.querySelectorAll('.item-device')
    let listIdDevice = [];
    listDevice.forEach(function(item){
        if(item.checked){
            listIdDevice.push(item.value)
        }
    })
    saveDataDevice(idroom, listIdDevice)
}

function saveDataDevice(idroom, listIdDevice){
    $.ajax({
        url: '/room/device',
        type: 'PUT',
        data:{idroom, listIdDevice},
        success: function(data){
            if(data.status){
                showSuccessToast(data.message);
            } else{
                showErrorToast(data.message);
            }
        }
    })
}

function updateRoomData(id, name, maximum, area, price, description){
    $.ajax({
        url: '/room/update',
        type: 'PUT',
        data:{id, number: name, maximum, area, price, description},
        success: function(data){
            if(data.status){
                changeDataRoom(data.data);
                showSuccessToast(data.message);
                getDeviceChecked(id);
            } else{
                showErrorToast(data.message)
            }
        }
    })
}

function changeDataRoom(data){
    console.log(data)
    let tr = itemClicked.parentNode.parentNode.parentNode
    console.log(tr);
    tr.innerHTML = `<td>
                        <div class="operations">
                            <div data-id=${data._id} class="edit edit-room">
                                <i class="fas fa-pen"></i>
                            </div>
                            <div data-id=${data._id} data-name="${data.number}" class="delete delete-room">
                                <i class="fas fa-trash-alt"></i>
                            </div>
                        </div>
                    </td>
                    <td>${data.number}</td>
                    <td>${data.renter}</td>
                    <td>${data.maximum}</td>
                    <td>${data.numberpeople}</td>
                    <td>${data.area} m2</td>
                    <td>${data.price} $</td>
                    <td>${data.description}</td>
                `
    let tdStatus = document.createElement('td')
    if(data.numberpeople === 0){
        tdStatus.className = "empty"
        tdStatus.innerText = "Empty"
    } else {
        tdStatus.className = "hired"
        tdStatus.innerText = "Being hired"
    }
    tr.appendChild(tdStatus)
    
    loadEventEdit();
    loadEventDelete();
}


// DELÊT ROOM
function loadEventDelete(){
    let listDelete = document.querySelectorAll('.delete-room')
    listDelete.forEach(function(item){
        item.onclick = function(){
            itemClicked = item
            modalDeleteStatus(true);
            let idRoom = item.getAttribute('data-id')
            let nameRoom = item.getAttribute('data-name')
            setDataToModalDeleteRoom(idRoom, nameRoom)
        }
    })
}

function setDataToModalDeleteRoom(idRoom, nameRoom) {
    document.getElementById('id-room-delete').value = idRoom
    document.querySelector('.text-delete-modal').innerText = `
        Are you sure want to delete this Room ( ${nameRoom} )!
    `
}

function modalDeleteStatus(status){
    let modalDelete = document.querySelector('.modal__confirm-delete');
    let hiddenLayer = document.querySelector('#hidden-layer');
    if(status){
        modalDelete.style.display = "block"
        hiddenLayer.style.display = "block"
    } else{
        modalDelete.style.display = "none"
        hiddenLayer.style.display = "none"
    }
}

if(document.querySelector('.close-modal-delete')){
    let btnClose = document.querySelector('.close-modal-delete')
    btnClose.onclick = (e) =>{
        modalDeleteStatus(false);
    }
}

if(document.querySelector('.cancel-modal-delete')){
    let btnCancel = document.querySelector('.cancel-modal-delete')
    btnCancel.onclick = (e) =>{
        modalDeleteStatus(false);
    }
}

if(document.querySelector('.btn-delete-room')){
    let btnDelete = document.querySelector('.btn-delete-room')
    btnDelete.onclick = (e) =>{
        e.preventDefault()
        let idRoom = document.getElementById('id-room-delete').value
        modalDeleteStatus(false)
        deleteRoom(idRoom)
    }
}

function deleteRoom(idRoom) {
    $.ajax({
        url: '/room/delete',
        type: 'DELETE',
        data:{idroom: idRoom},
        success: function(data){
            if(data.status){
                showSuccessToast(data.message)
                deleteDataView();
            } else {
                showErrorToast(data.message)
            }
        }
    })
}

function  deleteDataView(){
    let parent = document.getElementById('rooms')
    let itemLi = itemClicked.parentNode.parentNode.parentNode
    parent.removeChild(itemLi)
}