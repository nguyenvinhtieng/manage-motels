module.exports = {
  status: (id, status) => {
    if (status.trim() === 'paid') {
      return `<span class="around around-blue">Paid</span>`
    } else if (status.trim() === 'unpaid') {
      return `<span class="around around-red">Unpaid</span>
                <form class="form-ope" method="post" action="/admin/update-receipt">
                  <input type="text" name="id" value="${id}" hidden/>
                  <select name="status">
                    <option value="unpaid" >Chose</option>
                    <option value="paid" >Paid</option>
                    <option value="cancel" >Cancel</option>
                  </select>
                  <button type="submit">Save</button>
                </form>        
        `
    } else if (status.trim() === 'cancel') {
      return `<span class="around around-red">Cancel</span>`
    }
  },
  statuscustomer: (status, room, month, year) => {
    if (status.trim() === 'paid') {
      return `<span class="around around-blue">Paid</span>`
    } else if (status.trim() === 'unpaid') {
      return `<span class="around around-red">Unpaid</span>
        <div class="fz-12">
        Billing Information <br>
        Account number: 123456789 <br>
        Account name: Admin <br>
        Content: payment for room in ${month} / ${year} . Room  ${room}
        </div>
        
        `
    } else if (status.trim() === 'cancel') {
      return `<span class="around around-red">Cancel</span>`
    }
  },
  statusrequestcus: (status) => {
    if (status.trim() === 'wait') {
      return `<div class="around around-green">
                  ${status}...
                </div>`
    } else if (status.trim() === 'finish') {
      return `<div class="around around-blue">
                  ${status}
                </div>`
    } else if (status.trim() === 'reject') {
      return `<div class="around around-red">
                  ${status}...
                </div>`
    }
  },
  statusrequestad: (status, id) => {
    if (status.trim() === 'wait') {
      return `<div class="around around-green">
                  ${status}...
                </div>
                <form method="post" action="/admin/update-repair">
                <input type="text" value="${id}" name="id" hidden />
                  <select name="status" >
                    <option value="wait"> ---- </option>
                    <option value="finish">finish</option>
                    <option value="reject">reject</option>
                  </select>
                  <button>Save</button>
                </form>
                `
    } else if (status.trim() === 'finish') {
      return `<div class="around around-blue">
                  ${status}
                </div>`
    } else if (status.trim() === 'reject') {
      return `<div class="around around-red">
                  ${status}...
                </div>`
    }
  },
  handleMyJobStaff: function (status, idJob) {
    if (status == "finish") {
      return `<td>
                finished
            </td>`
    }
    return `<td data-id="${idJob}"> 
                <div for="modal-pick-task" class="operations">
                    <a href="/staff/finish-task/${idJob}" class="edit edit-device pick-task">
                        <i data-id="${idJob}" class="fas fa-check-circle"></i>
                    </a>
                </div>
            </td>`
  },
  renderStatusJob: function (status, idJob) {
    if (status == "finished") {
      return `Finished`
    } else {
      return `<button type="button" class="btn btn-primary btn-sm btn-finish-job" data-id="${idJob}"
      data-toggle="modal" data-target="#modal-finish-job">Finish</button>`
    }
  },
  handleRepair: function (status, id, type) {
    if (status == "wait") {
      return `<button type="button" class="btn btn-success btn-accept btn-sm" data-id="${id}"  data-toggle="modal" data-target="#modal-accept">Accept</button>
      <button type="button" class="btn btn-danger btn-reject btn-sm" data-toggle="modal" data-target="#modal-reject-request" data-id="${id}">Reject</button>`
    } else if (status == "reject") {
      return ``
    } else if (status == "accept" && type == "room") {
      return `<button type="button" class="btn btn-primary btn-finish-r btn-sm" data-id="${id}"  data-toggle="modal" data-target="#modal-finish-room">Finish</button>`
    } else if (status == "accept" && type == "device") {
      return `<button type="button" class="btn btn-primary btn-finish-d btn-sm" data-id="${id}"  data-toggle="modal" data-target="#modal-finish-device">Finish</button>`
    } else {
      return ``
    }
  }
}