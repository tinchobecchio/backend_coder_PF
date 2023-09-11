import {expect} from 'chai'
import { requester, dropUsers, dropProducts } from '../setup.test.js'


describe("Test Routes Products", ()=>{
    before(async function(){
        await dropUsers()
        await dropProducts()
    })

    // registrar usuario y loguear para poder trabajar con las rutas que requieren autorizacion
    let cookie
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
    })

    // producto de prueba
    let mockproduct = {
        title: "Coca Cola",
        description:"Gaseosa Coca Cola bien fría",
        code:"COKE",
        price:800,
        category:"bebidas",
        stock:200,
        thumbnails: ["https://static.wixstatic.com/media/d2b1c5_d858b74ff2534bdc98694e72c576fbe0~mv2_d_1600_1600_s_2.jpg/v1/fill/w_480,h_480,al_c,q_80,usm_0.66_1.00_0.01,enc_auto/d2b1c5_d858b74ff2534bdc98694e72c576fbe0~mv2_d_1600_1600_s_2.jpg"]
    }
    
    // ahora las pruebas de productos
    it("[GET] /api/products get all products", async()=>{

        const response = await requester.get('/api/products')
        .set('Cookie',[`${cookie.name}=${cookie.value}`])

        // console.log(response.body)
        // chequear que de buena respuesta
        expect(response.statusCode).to.be.eql(200)
        expect(response.body.status).to.be.eql('success')
        // que el payload exista y tenga un array docs
        expect(response.body.payload).to.be.ok
        expect(Array.isArray(response.body.payload.docs)).to.be.eql(true)
    })

    it("[POST] /api/products Create a new Product", async()=>{

        // envia el mockproduct en la peticion
        const response = await requester.post('/api/products').send(mockproduct)
        .set('Cookie',[`${cookie.name}=${cookie.value}`])
        
        // console.log(response.body)
        // chequear que de buena respuesta
        expect(response.statusCode).to.be.eql(200)
        expect(response.body.status).to.be.eql('success')

        // que el payload exista y tenga el producto creado
        expect(response.body.payload).to.be.ok
        expect(response.body.payload).to.have.property('_id')
        expect(response.body.payload.code).to.be.eql(mockproduct.code)
        
        // que tenga asignado el owner
        expect(response.body.payload.owner).to.be.ok

        pid = response.body.payload._id // guardo el pid del producto para usarlo en los siguientes tests
    })

    it("[GET] /api/products/:pid get product by ID", async()=>{

        const response = await requester.get(`/api/products/${pid}`)
        .set('Cookie',[`${cookie.name}=${cookie.value}`])

        // chequear que de buena respuesta
        expect(response.statusCode).to.be.eql(200)
        expect(response.body.status).to.be.eql('success')

        // que el payload exista y tenga el producto
        expect(response.body.payload).to.be.ok
        expect(response.body.payload).to.have.property('_id')
        expect(response.body.payload.code).to.be.eql(mockproduct.code)

        // que owner tenga el email del mockuser
        expect(response.body.payload.owner).to.be.equal(mockuser.email)
    })
    
    it("[DELETE] /api/products/:pid Delete product by ID", async()=>{

        const response = await requester.delete(`/api/products/${pid}`)
        .set('Cookie',[`${cookie.name}=${cookie.value}`])

        // chequear que de buena respuesta
        expect(response.statusCode).to.be.eql(200)
        expect(response.body.status).to.be.eql('success')
        
        // si lo busco no existe y da error
        const deleted = await requester.get(`/api/products/${pid}`)
        .set('Cookie',[`${cookie.name}=${cookie.value}`])
        
        expect(deleted.statusCode).to.not.be.eql(200)
        expect(deleted.body.status).to.be.eql('Error')
        
    })

    after(async function(){
        await dropUsers()
        await dropProducts()
    })
    
})