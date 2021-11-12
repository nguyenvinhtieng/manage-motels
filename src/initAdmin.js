
const bcrypt = require("bcrypt");
const Account = require('./app/models/Account.js')
async function initAccount() {
    let acc = await Account.findOne({ role: 'admin' })
    if (!acc) {
        let data = { username: 'admin', password: '123123123', role: 'admin' }
        let account = new Account(data)
        const salt = await bcrypt.genSalt(10);
        account.password = await bcrypt.hash(account.password, salt);
        account.save()
    }
}
module.exports = { initAccount };