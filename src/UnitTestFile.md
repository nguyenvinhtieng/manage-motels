const expect = require('chai').expect
const request = require('supertest');
const app = require('../index')
const conn = require('../config/db/mongoDB/index')

describe('POST /note', () => {
before((done) => {
conn.connect()
.then(() => done())
.catch((error) => done(error))
})
after((done) => {
conn.close()
.then((done) => done())
.catch((error) => done(error))
})
it("Create a new room", (done) => {
request(app).post('/room/create')
.send({
number: "R005",
maximum: 4,
area: 100,
price: 200,
description: "No"
})
.then((res) => {
const body = res.body
expect(body).to.contain.property('\_id')
done();
})
.catch((error) => {
done(error)
})
})
})
