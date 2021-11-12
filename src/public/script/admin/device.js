document.querySelectorAll('.header__items ul li')[2].classList.add('active-item')

loadEventEdit()
loadEventDelete()
let itemClicked;
// Create device
if(document.getElementById('btn-add-device')){
    let btnAdd = document.getElementById('btn-add-device');
    btnAdd.onclick = function(e){
        e.preventDefault();
        let name = $('#name').val();
        let price = $('#price').val();
        let indemnify = $('#indemnify').val();
        let description = $('#description').val();
        if(validateDevice(name, price, indemnify, description)){
            $.ajax({
                url: '/device/add',
                type: 'POST',
                data: {
                    name, price, indemnify, description
                },
                success: function(data){
                    toast({
                        title: 'Succcessfull',
                        message: 'Create device successfully',
                        type: 'success',
                        duration: 3000
                    })
                    addDataDevice(data.data)
                    hiddenModal();
                }
            })
    }
}

function validateDevice(name, price, indemnify, description) {
    if(name === ''){
        toast({
            title: 'Warrning',
            message: 'Name of device is required',
            type: 'error',
            duration: 3000,

        })
        return false;
    }
    if(price == '' || price < 0){
        toast({
            title: 'Warrning',
            message: 'Price is not valid',
            type: 'error',
            duration: 3000,
        })
        return false;
    }
    if(indemnify == '' || indemnify < 0){
        toast({
            title: 'Warrning',
            message: 'Indemnify is not valid',
            type: 'error',
            duration: 3000,
        })
        return false;
    }
    if(description === ''){
        toast({
            title: 'Warrning',
            message: 'Description can not be empty',
            type: 'error',
            duration: 3000,
        })
        return false;
    }
    return true
}}

function addDataDevice(data){
    let tbodyData = document.getElementById('devices');
    let tr = document.createElement('tr');
    tr.innerHTML = `
                    <td>
                    <div class="operations">
                        <div data-id="${data._id}" class="edit edit-device">
                            <i class="fas fa-pen"></i>
                        </div>
                        <div data-id="${data._id}" data-name="${data.name}" class="delete delete-device">
                            <i class="fas fa-trash-alt"></i>
                        </div>
                    </div>
                </td>
                <td>${data.name}</td>
                <td>${data.price}$</td>
                <td>${data.indemnify}$</td>
                <td>${data.description}</td>
            `
        tbodyData.appendChild(tr)
    resestDataAddModal()
    loadEventEdit()
    loadEventDelete()
}

function resestDataAddModal() {
    document.getElementById('name').value = '';
    document.getElementById('price').value = '';
    document.getElementById('indemnify').value = '';
    document.getElementById('description').value = '';
}

function hiddenModal(){
    let checkBoxModal = document.getElementById('modal__add-device');
    checkBoxModal.checked = false;
}

/**             Edit
********************
*/

function loadEventEdit(){
    if(document.querySelector('.edit-device')){
        let itemsEdit = document.querySelectorAll('.edit-device')
        itemsEdit.forEach(function(item){
            item.onclick = function(e){
                itemClicked = item;
                modalEdit(true)
                let id = item.getAttribute('data-id');
                $.ajax({
                    url: '/device/getData',
                    type: 'POST',
                    data: {
                        id
                    },
                    success: function(data){
                        if(data){
                            renderDataToModalEdit(data)
                        } else {
                            toast({
                                title: 'Error',
                                message: 'Has Error, please do not edit this page',
                                type: 'error',
                                duration: 3000
                            })
                        }
                    }
                })
            }
        })
    }
}

function modalEdit(status){
    let modalEdit = document.querySelector('.modal__edit-device')
    let hiddenModal = document.querySelector('#hidden-modal');
    if(status){
        modalEdit.style.display = 'block'
        hiddenModal.style.display = "block"
    } else {        
        modalEdit.style.display = 'none'
        hiddenModal.style.display = "none"
    }
}

if(document.querySelector('.close-edit-modal')){
    let closeModal = document.querySelector('.close-edit-modal')
    closeModal.onclick = function(){
        modalEdit(false);
    }
}

if(document.querySelector('#hidden-modal')){
    let hiddenModal = document.querySelector('#hidden-modal');
    hiddenModal.onclick = function(){
        modalEdit(false);
        modalDelete(false);
    }
}

function renderDataToModalEdit(data){
    document.getElementById('id-edit').value = data._id;
    document.getElementById('name-edit').value = data.name;
    document.getElementById('price-edit').value = data.price;
    document.getElementById('indemnify-edit').value = data.indemnify;
    document.getElementById('description-edit').value = data.description;

    loadEventSave()
}

function loadEventSave(){
    let btnSave = document.getElementById('btn-save')
    btnSave.onclick = function(e){
        e.preventDefault();
        let id = document.getElementById('id-edit').value;
        let name = document.getElementById('name-edit').value;
        let price = document.getElementById('price-edit').value;
        let indemnify = document.getElementById('indemnify-edit').value;
        let description = document.getElementById('description-edit').value;
        if(validateDevice(name, price, indemnify, description)){
            updateDevice(id, name, price, indemnify, description);
            modalEdit(false);
        }
    }
}

function updateDevice(id, name, price, indemnify, description){
    $.ajax({
        url: '/device/update',
        type: 'PUT',
        data: {
            id, name, price, indemnify, description
        },
        success: function(data){
            if(data.status){
                toast({
                    title: 'Successfull',
                    message: 'Device updated',
                    type: 'success',
                    duration: 3000
                })
                updateFillDevice(id, name, price, indemnify, description);
            } else{
                toast({
                    title: 'Error',
                    message: 'Please do not edit this page',
                    type: 'error',
                    duration: 3000
                })
            }
        }
    })
}

function updateFillDevice(id, name, price, indemnify, description){
    let trElement = itemClicked.parentNode.parentNode.parentNode;
    trElement.innerHTML = `
                        <td>
                        <div class="operations">
                            <div data-id="${id}" class="edit edit-device">
                                <i class="fas fa-pen"></i>
                            </div>
                            <div data-id="${id}" data-name="${name}" class="delete delete-device">
                                <i class="fas fa-trash-alt"></i>
                            </div>
                        </div>
                    </td>
                    <td>${name}</td>
                    <td>${price}$</td>
                    <td>${indemnify}$</td>
                    <td>${description}</td>
    `
    loadEventEdit();
    loadEventDelete();
}

/**                      Delete
********************************
*/ 

function loadEventDelete(){
    let itemsDelete = document.querySelectorAll('.delete-device');
    itemsDelete.forEach(item =>{
        item.onclick = (e)=>{
            itemClicked = item
            let id = item.getAttribute('data-id')
            let name = item.getAttribute('data-name')
            setDataModalDelete(id, name)
            modalDelete(true);
        }
    })
}

if(document.querySelector('.close-delete-modal')){
    let btnClose = document.querySelector('.close-delete-modal')
    btnClose.onclick = (e)=>{
        modalDelete(false)
    }
}

if(document.querySelector('.cancel-delete-modal')){
    let btnCancelDeleteModal = document.querySelector('.cancel-delete-modal');
    btnCancelDeleteModal.onclick = (e)=>{
        modalDelete(false)
    }
}
function setDataModalDelete(id, name){
    let message = document.querySelector('.delete-device-message')
    let idInput = document.getElementById('id-delete-device');
    idInput.value = id;
    message.innerText = 'Are you sure want to delete this device ('+name+')!'
}
function modalDelete(status){
    let modalDelete = document.querySelector('.modal__confirm-delete')
    let hiddenModal = document.querySelector('#hidden-modal');
    if(status){
        modalDelete.style.display = 'block'
        hiddenModal.style.display = "block"
    } else {        
        modalDelete.style.display = 'none'
        hiddenModal.style.display = "none"
    }
}

if(document.getElementById('btn-delete')){
    let btnDelete = document.getElementById('btn-delete');
    btnDelete.onclick = (e)=>{
        let id = document.getElementById('id-delete-device').value;
        $.ajax({
            url: '/device/delete',
            type: 'DELETE',
            data: {
                id
            },
            success: function(data){
                if(data.status){
                    toast({
                        title: 'Delete Device',
                        message: data.message,
                        type: 'success',
                        duration: 3000
                    })
                    deleteViewItem();
                } else {
                    toast({
                        title: 'Error',
                        message: data.message,
                        type: 'error',
                        duration: 3000
                    })
                }
            }
        })
        modalDelete(false);
    }
}

function deleteViewItem(){
    let parent = document.getElementById('devices')
    let itemLi = itemClicked.parentNode.parentNode.parentNode
    parent.removeChild(itemLi)
}