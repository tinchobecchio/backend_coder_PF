import {expect} from 'chai'
import { requester, dropUsers, dropCarts } from '../setup.test.js'
import {usersManager} from '../../src/persistencia/DAOs/MongoDAOs/usersMongo.js'


describe("Test Routes Carts", ()=>{
    before(async function(){
        await dropUsers()
        await dropCarts()
    })

    // registrar usuario y loguear para poder trabajar con las rutas que requieren autorizacion
    let cookie
    let cid
    let pid
    const mockuser = {
        first_name: 'Mickey',
        last_name: 'Mouse',
        gender: "male", 
        age: 32,
        role: "premium",
        email: 'mickey@mouse.com',
        password: '1234'
    }
    let mockproduct = {
        title: "Coca Cola",
        description:"Gaseosa Coca Cola bien fría",
        code:"COKE",
        price:800,
        category:"bebidas",
        stock:200,
        thumbnails: ["https://static.wixstatic.com/media/d2b1c5_d858b74ff2534bdc98694e72c576fbe0~mv2_d_1600_1600_s_2.jpg/v1/fill/w_480,h_480,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/d2b1c5_d858b74ff2534bdc98694e72c576fbe0~mv2_d_1600_1600_s_2.jpg"]
    }

    it("Register user before tests that require authorization", async()=>{
        const register = await requester.post('/api/sessions/signup').send(mockuser)
    })
    it("Login user before tests that require authorization", async()=>{
        const mockuserlogin = {
            email: mockuser.email,
            password: mockuser.password
        }
        const login = await requester.post('/api/sessions/login').send(mockuserlogin)
        const cookieHeader = login.headers['set-cookie'][0]
        cookie = {
            name: cookieHeader.split('=')[0],
            value: cookieHeader.split('=')[1]
        }
        // guardar el cid del carrito que se creó
        const user = await usersManager.findByEmail(mockuser.email) 
        cid = user.cart
    })

    // y creamos un producto de prueba para utilizar en los tests
    it("[POST] /api/products Create a new Product", async()=>{
        const response = await requester.post('/api/products').send(mockproduct)
        .set('Cookie',[`${cookie.name}=${cookie.value}`])

        pid = response.body.payload._id // guardo el pid del producto para usarlo en los siguientes tests
    })


    // Tests de Carts
    it("[GET] /api/carts/:cid get cart by ID", async()=>{

        const response = await requester.get(`/api/carts/${cid}`)
        .set('Cookie',[`${cookie.name}=${cookie.value}`])

        // chequear que de buena respuesta
        expect(response.statusCode).to.be.eql(200)
        expect(response.body.status).to.be.eql('success')
        expect(response.body.message).to.be.eql(`Cart ${cid} founded`)
        expect(response.body.cart).to.be.ok
        expect(Array.isArray(response.body.cart)).to.be.eql(true)
        
    })
    
    it("[POST] /api/carts/:cid/products/:pid Add a product to the cart by ID", async()=>{

        let body = {quantity: 2}
        const response = await requester.post(`/api/carts/${cid}/products/${pid}`).send(body)
        .set('Cookie',[`${cookie.name}=${cookie.value}`])

        // no debe dejar agregar un producto propio al carrito
        expect(response.statusCode).to.be.eql(403)

    })


    it("[DELETE] /api/carts/:cid Empty a cart by ID", async()=>{
        
        const response = await requester.delete(`/api/carts/${cid}`)
        .set('Cookie',[`${cookie.name}=${cookie.value}`])
        
        // chequear que de buena respuesta
        expect(response.statusCode).to.be.eql(200)
        expect(response.body.status).to.be.eql('success')
        
        // que el carrito no contenga productos
        expect(response.body.cart).to.be.ok
        expect(response.body.cart.products).deep.eql([])
    })

    after(async function(){
        await dropUsers()
        await dropCarts()
    })
    
})