const expect = require('chai').expect
const request = require('supertest');
const app = require('../src/index')
const conn = require('../src/config/db/mongoDB/index')
before((done) => { conn.connect().then(() => done()).catch((error) => done(error)) })
after((done) => { conn.close().then((done) => done()).catch((error) => done(error)) })
describe('Test createRoom', () => {
    // TẠO ROOM KÈM THEO COOKIE CỦA ADMIN
    it("Create a new room", async (done) => {
        request(app)
            .post('/room/create')
            .set('Cookie', 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MThkMDg3MGNiOWY1MzZjYjZjZTRlMWMiLCJpYXQiOjE2MzgyMzQ2NzZ9.aSOn95caBwfZBBKsHmL0JWQKn963reFNvlv_DSZnd40')
            .send({ number: "R005", maximum: 4, area: 100, price: 200, description: "No" })
            .then((res) => {
                const body = res.body
                expect(body.success).to.be.true;
                expect(body.message).to.be.equal("Create room successfully!");
                done();
            })
            .catch((error) => { done(error) })
    })
    // TẠO ROOM KHÔNG KÈM THEO COOKIE CỦA ADMIN
    it("Create a new room", async (done) => {
        request(app)
            .post('/room/create')
            .send({ number: "R006", maximum: 4, area: 100, price: 200, description: "No" })
            .then((res) => {
                const body = res.body
                expect(body.success).to.be.false;
                expect(body.message).to.be.equal("You are not allowed to create a new room");
                done();
            })
            .catch((error) => { done(error) })
    })
})

describe('Test Get data room', () => {

    // LẤY THÔNG TIN CỦA TẤT CẢ CÁC PHÒNG
    it("get data rooms", async (done) => {
        request(app)
            .get('/room/getData')
            .set('Cookie', 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MThkMDg3MGNiOWY1MzZjYjZjZTRlMWMiLCJpYXQiOjE2MzgyMzQ2NzZ9.aSOn95caBwfZBBKsHmL0JWQKn963reFNvlv_DSZnd40')
            .then((res) => {
                const body = res.body
                expect(body.success).to.be.true;
                expect(body.message).to.be.equal("Get data rooms successfully!");
                expect(body.data).to.be.an('array');
                done();
            })
            .catch((error) => { done(error) })
    })

    // LẤY THÔNG TIN CỦA 1 PHÒNG (PHÒNG CÓ TỒN TẠI)
    it("get data room", async (done) => {
        request(app)
            .get('/room/getDataRoom')
            .set('Cookie', 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MThkMDg3MGNiOWY1MzZjYjZjZTRlMWMiLCJpYXQiOjE2MzgyMzQ2NzZ9.aSOn95caBwfZBBKsHmL0JWQKn963reFNvlv_DSZnd40')
            .send({ number: "R001" })
            .then((res) => {
                const body = res.body
                expect(body.success).to.be.true;
                expect(body.message).to.be.equal("Get data room successfully!");
                expect(body.data).to.be.an('object');
                done();
            })
            .catch((error) => { done(error) })
    })

    // LẤY THÔNG TIN CỦA 1 PHÒNG (PHÒNG KHÔNG TỒN TẠI)
    it("get data rooms (not exists)", async (done) => {
        request(app)
            .get('/room/getDataRoom')
            .set('Cookie', 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MThkMDg3MGNiOWY1MzZjYjZjZTRlMWMiLCJpYXQiOjE2MzgyMzQ2NzZ9.aSOn95caBwfZBBKsHmL0JWQKn963reFNvlv_DSZnd40')
            .send({ number: "R021" })
            .then((res) => {
                const body = res.body
                expect(body.success).to.be.false;
                expect(body.message).to.be.equal("Room not found!");
                done();
            })
            .catch((error) => { done(error) })
    })
})

describe('Test Device In Room', () => {

    // LẤY THÔNG TIN CÁC THIẾT BỊ CÓ TRONG PHÒNG
    it("Get data devices in room", async (done) => {
        request(app)
            .get('/room/deviceInRoom')
            .set('Cookie', 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MThkMDg3MGNiOWY1MzZjYjZjZTRlMWMiLCJpYXQiOjE2MzgyMzQ2NzZ9.aSOn95caBwfZBBKsHmL0JWQKn963reFNvlv_DSZnd40')
            .send({ number: 'R001' })
            .then((res) => {
                const body = res.body
                expect(body.success).to.be.true;
                expect(body.message).to.be.equal("Get devices in room successfully!");
                expect(body.data).to.be.an('array');
                done();
            })
            .catch((error) => { done(error) })
    })
})

describe('Test create job', () => {

    // TẠO 1 JOB MỚI
    it("Create a new job", async (done) => {
        request(app)
            .post('/jobs')
            .set('Cookie', 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MThkMDg3MGNiOWY1MzZjYjZjZTRlMWMiLCJpYXQiOjE2MzgyMzQ2NzZ9.aSOn95caBwfZBBKsHmL0JWQKn963reFNvlv_DSZnd40')
            .send({ description: "Quet Nha", startday: "2021-11-11", endday: "2022-12-11", price: 23, room: "R001" })
            .then((res) => {
                const body = res.body
                expect(body.success).to.be.true;
                expect(body.message).to.be.equal("Create job successfully!");
                expect(body.data).to.be.an('object');
                done();
            })
            .catch((error) => { done(error) })
    })
})

describe('Test create receipt', () => {

    // TẠO 1 RECEIPT
    it("Create a new receipt", async (done) => {
        request(app)
            .post('/receipt')
            .set('Cookie', 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MThkMDg3MGNiOWY1MzZjYjZjZTRlMWMiLCJpYXQiOjE2MzgyMzQ2NzZ9.aSOn95caBwfZBBKsHmL0JWQKn963reFNvlv_DSZnd40')
            .send({ roomnumber: 'R001', electric: 100, water: 100, month: 11, year: 2021 })
            .then((res) => {
                const body = res.body
                expect(body.success).to.be.true;
                expect(body.message).to.be.equal("Create receipt successfully!");
                expect(body.data).to.be.an('object');
                done();
            })
            .catch((error) => { done(error) })
    })
})

describe('Test create notify', () => {

    // TẠO 1 THÔNG BÁO MỚI
    it("Create a new notify", async (done) => {
        request(app)
            .post('/notify')
            .set('Cookie', 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MThkMDg3MGNiOWY1MzZjYjZjZTRlMWMiLCJpYXQiOjE2MzgyMzQ2NzZ9.aSOn95caBwfZBBKsHmL0JWQKn963reFNvlv_DSZnd40')
            .send({ title: "Test Title", text: "Test content" })
            .then((res) => {
                const body = res.body
                expect(body.success).to.be.true;
                expect(body.message).to.be.equal("Create notification successfully!");
                expect(body.data).to.be.an('object');
                done();
            })
            .catch((error) => { done(error) })
    })
})

describe('Test create notify', () => {

    // THÊM YÊU CẦU SỬA CHỮA VẬT CHẤT
    it("Create a new request repair", async (done) => {
        request(app)
            .post('/repair')
            .set('Cookie', 'token=lesdkjhasHKyAmnsDlj3nkJlnasW.dsajnnYonasKKnklasdnKAsuguBDaUhwjadsuajBAdjbASlmklasdksdnlsdbhhssd.faskdjh_ihHJASnDKLAkna90')
            .send({ room: "R001", content: "Sua Chua" })
            .then((res) => {
                const body = res.body
                expect(body.success).to.be.true;
                expect(body.message).to.be.equal("Create a request successfully!");
                expect(body.data).to.be.an('object');
                done();
            })
            .catch((error) => { done(error) })
    })
})

describe('Add customer data', () => {

    // THÊM THÔNG TIN KHÁCH HÀNG
    it("Add data customer", async (done) => {
        request(app)
            .post('/customer')
            .set('Cookie', 'token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2MThkMDg3MGNiOWY1MzZjYjZjZTRlMWMiLCJpYXQiOjE2MzgyMzQ2NzZ9.aSOn95caBwfZBBKsHmL0JWQKn963reFNvlv_DSZnd40')
            .send({ name: "NguyenVanA", identity: "59033452352", dateofbirth: "2001-11-11", roomid: "618a0cff96735ff02f1b22e3", roomnumber: "R001", phone: "0353520145", email: "cnpm@gmail.com", startday: "2021-05-05", job: "Teacher", sex: "female", note: "No" })
            .then((res) => {
                const body = res.body
                expect(body.success).to.be.true;
                expect(body.message).to.be.equal("Add customer successfully!");
                expect(body.data).to.be.an('object');
                done();
            })
            .catch((error) => { done(error) })
    })
})