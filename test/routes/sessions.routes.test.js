import {expect} from 'chai'
import {usersManager} from '../../src/persistencia/DAOs/MongoDAOs/usersMongo.js'
import { dropUsers, dropCarts, requester } from '../setup.test.js'

describe("Test Routes Sessions", ()=>{
    before(async function(){
        await dropUsers()
        await dropCarts()
    })
    let cookie
    const mockuser = {
        first_name: 'Rocky',
        last_name: 'Balboa',
        gender: "male", 
        age: 18,
        role: "premium",
        email: 'rocky@balboa.com',
        password: '1234'
    }

    it("[POST] /api/sessions/signup register successfully", async()=>{
        // envia el mockuser en la peticion
        const response = await requester.post('/api/sessions/signup').send(mockuser)
        
        // que redireccione
        expect(response.statusCode).to.be.equal(302) 

        // que se haya creado el usuario en la BDD y coincidan los datos (menos la contraseña que va a estar hasheada)
        const user = await usersManager.findByEmail(mockuser.email) 
        expect(user).to.be.ok 
        expect(user.first_name).to.be.equal(mockuser.first_name)
        expect(user.last_name).to.be.equal(mockuser.last_name)
        expect(user.gender).to.be.equal(mockuser.gender)
        expect(user.age).to.be.equal(mockuser.age)
        expect(user.role).to.be.equal(mockuser.role)
        expect(user.email).to.be.equal(mockuser.email)
        expect(user.password).to.not.be.equal(mockuser.password)
        
        // ademas que se le haya creado un carrito y asignado el id del mismo en la propiedad cart
        expect(user.cart).to.be.ok
    })

    it("[POST] /api/sessions/login login successfully", async()=>{

        const mockuserlogin = {
            email: mockuser.email,
            password: mockuser.password
        }
        const response = await requester.post('/api/sessions/login').send(mockuserlogin)
        const cookieHeader = response.headers['set-cookie'][0]

        expect(cookieHeader).to.be.ok // que setee la cookie al iniciar sesión

        cookie = {
            name: cookieHeader.split('=')[0],
            value: cookieHeader.split('=')[1]
        }
        // que la cookie este con el nombre apropiado y el valor exista
        expect(cookie.value).to.be.ok
        expect(cookie.name).to.be.eql('jwt')

        // que redirija luego de setear la cookie
        expect(response.statusCode).to.be.equal(302)
    })

    it("[GET] /api/sessions/current current session", async()=>{

        const response = await requester.get('/api/sessions/current')
        .set('Cookie',[`${cookie.name}=${cookie.value}`])

        // que el user en la sesion actual coincida con el mockuser
        expect(response.body.user.first_name).to.be.equal(mockuser.first_name)
        expect(response.body.user.last_name).to.be.equal(mockuser.last_name)
        expect(response.body.user.gender).to.be.equal(mockuser.gender)
        expect(response.body.user.age).to.be.equal(mockuser.age)
        expect(response.body.user.role).to.be.equal(mockuser.role)
        expect(response.body.user.email).to.be.equal(mockuser.email)
    })

    after(async function(){
        await dropUsers()
        await dropCarts()
    })
})