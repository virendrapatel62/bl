require('../database/db');
const { constructionMaterial } = require('../models/materialModels/construction-material')
const request = require('supertest')

let server;
let product;

async function init() {
    product = await constructionMaterial.findOne().select();
}
init();



// get All Matrials
describe('GET /', () => {

    beforeEach(async () => { server = require('../index'); })
    afterEach(() => { server.close(); })

    it('should return an array ..', async () => {
        const res = await request(server).get('/api/material/construction-material');
        expect(res.status).toBe(200)
        expect(res).toBeDefined()
        expect(res.text).not.toBeFalsy()
        expect(Array.isArray(JSON.parse(res.text))).not.toBeFalsy()
    })
})



// getting Consturction Material by Id 
describe('GET /id/:id', () => {

    beforeEach(async () => { server = require('../index'); })
    afterEach(() => { server.close(); })


    it('should return An object', async () => {
        const url = `/api/material/construction-material/id/${product._id}`
        const res = await request(server).get(url);
        expect(res.status).toBe(200)
        expect(res).toBeDefined()
    })

    it('Should containt given Id ', async () => {
        const url = `/api/material/construction-material/id/${product._id}`
        const res = await request(server).get(url);
        expect(JSON.parse(res.text)['_id']).toBe(product._id.toString())

    })
})

// getting Consturction Material by Name 
describe('GET /name/:name', () => {

    beforeEach(async () => { server = require('../index'); })
    afterEach(() => { server.close(); })



    it('should return An object', async () => {
        const url = `/api/material/construction-material/name/${product.productName}`
        const res = await request(server).get(url);
        expect(res.status).toBe(200)
        expect(res).toBeDefined()
        expect(Array.isArray(JSON.parse(res.text))).not.toBeFalsy()
    })

    it('Should containt given Full Name', async () => {
        const url = `/api/material/construction-material/name/${product.productName}`
        const res = await request(server).get(url);
        const arr = JSON.parse(res.text)
        for (var i in arr) {
            const obj = arr[i]
            const name = obj['productName'];
            expect(name).toBe(product.productName)
        }
    })


    it('Given Abstract Name should Containt in Product Name', async () => {
        var namePart = product.productName.slice(product.productName.length - 4, product.productName.length);
        console.log(namePart);

        const url = `/api/material/construction-material/name/${namePart}`
        const res = await request(server).get(url);
        const arr = JSON.parse(res.text)
        for (var i in arr) {
            const obj = arr[i]
            const name = obj['productName'];
            expect(name).toMatch(new RegExp(namePart))
        }
    })
})
