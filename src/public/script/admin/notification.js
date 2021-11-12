document.querySelectorAll('.header__items ul li')[5].classList.add('active-item')
let itemClicked
getDataNotification();
function getDataNotification(){
    $.ajax({
        url: '/notification/getData',
        type: 'GET',
        success: function(data){
            if(data.status){
                renderData(data.data)
            }
        }
    })
}

function renderData(data){
    let ul = document.getElementById('list-item')
    ul.innerHTML = ``
    data.forEach(function(item){
        let li = document.createElement('li')
        li.className = 'item-notification'
        li.innerHTML = `
                <div class="delete-noti" data-id=${item._id}>
                    <i class="fas fa-trash"></i>
                </div>
                <div class="content">
                    <div class="text">
                        ${item.title}
                        <span class="time">
                            ( ${handleDate(item.createdAt)} )
                        </span>
                    </div>
                    <a href="/notification/view/${item._id}">Details...</a>
                </div>
            `
        ul.appendChild(li)
    })
    loadEventDelete()
}

function handleDate(date){
    return date.slice(0, 10)
}

if(document.querySelector('.btn-create')){
    let btnCreate = document.querySelector('.btn-create')
    btnCreate.onclick = (e)=>{
        e.preventDefault();
        let title = document.querySelector('#title').value
        let text = document.querySelector('#text').value
        if(validdate(title, text)){
            createNotification(title, text)
        }
    }
}
function createNotification(title, text){
    $.ajax({
        url: '/notification/create',
        type: 'POST',
        data: {title, text},
        success: function(data){
            if(data.status){
                hideModal()
                resetData()
                showSuccessToast(data.message)
                addNotificationToView(data.data)
            } else{
                showErrorToast('Has error creating notification')
            }
        }
    })
}

function addNotificationToView(data){
    let ul = document.getElementById('list-item')
    let li = document.createElement('li')
    li.className = 'item-notification'
    li.innerHTML = `
            <div class="delete-noti" data-id=${data._id}>
                <i class="fas fa-trash"></i>
            </div>
            <div class="content">
                <div class="text">
                    ${data.title}
                    <span class="time">
                        ( ${data.createdAt} )
                    </span>
                </div>
                <a href="/notification/view/${data._id}">Details...</a>
            </div>
        `
    if(document.querySelectorAll('.item-notification')){
        let item0 = document.querySelectorAll('.item-notification')[0]
        ul.insertBefore(li, item0)
    } else{
        appendChild(ul, li)
    }
    loadEventDelete()
}


function resetData(){
    document.querySelector('#title').value = ''
    document.querySelector('#text').value = ''
}
function hideModal(){
    document.querySelector('#modal-create-notification').checked = false
}

function validdate(title, text) {
    if(title === ''){
        showErrorToast('Title can not be empty')
        return false
    }
    if(text === ''){
        showErrorToast('Content can not be empty')
        return false;
    }
    return true
}

function loadEventDelete(){
    let listDelete = document.querySelectorAll('.delete-noti')
    listDelete.forEach(item=>{
        item.onclick = (e)=>{
            itemClicked = item
            let id = item.getAttribute('data-id')
            setDataToModalDelete(id)
            modalDeleteNotification(true)
        }
    })
}

function setDataToModalDelete(id){
    document.querySelector('#id-delete-notification').value = id
}

if(document.querySelector('.close-delete-modal')){
    let btnClose = document.querySelector('.close-delete-modal')
    btnClose.onclick = (e)=>{
        modalDeleteNotification(false)
    }
}
if(document.querySelector('.cancel-delete-modal')){
    let btnCancel = document.querySelector('.cancel-delete-modal')
    btnCancel.onclick = (e)=>{
        modalDeleteNotification(false)
    }
}
function modalDeleteNotification(status){
    let modal = document.querySelector('.modal__confirm-delete')
    let layer = document.querySelector('.layer-close')
    if (status){
        modal.style.display = 'block'
        layer.style.display = 'block'
    } else {
        modal.style.display = 'none'
        layer.style.display = 'none'
    }
}

if(document.querySelector('.layer-close')){
    let layer = document.querySelector('.layer-close')
    layer.onclick = (e)=>{
        modalDeleteNotification(false)
    }
}

if(document.querySelector('#btn-delete')){
    let btnDelete = document.querySelector('#btn-delete')
    btnDelete.onclick = (e)=>{
        let id = document.querySelector('#id-delete-notification').value
        DeleteNotification(id)
    }
}

function DeleteNotification(id){
    $.ajax({
        url: '/notification/delete',
        type: 'DELETE',
        data: {_id: id},
        success: function(data){
            if(data.status){
                modalDeleteNotification(false)
                showSuccessToast(data.message)
                deleteFromView()
            } else {
                showErrorToast(data.message)
            }
        }
    })
}

function deleteFromView(){
    let li = itemClicked.parentNode
    let parent = document.querySelector('#list-item')
    parent.removeChild(li)
}