import {usersManager} from '../persistencia/DAOs/MongoDAOs/usersMongo.js'
import { createHash } from '../utils/bcrypt.js'
import {createNewCart} from './cart.service.js'
import config from '../config/config.js'
import { getUserDTO2 } from '../persistencia/DTOs/user.js'
import { cartManager } from '../persistencia/DAOs/MongoDAOs/cartMongo.js'
import { transporter } from '../utils/nodemailer.js'

export const findById = async(id) =>{
    try {
        const user = await usersManager.findById(id)
        return user
    } catch (error) {
        return error
    }
}
export const findByEmail = async(email) => {
    try {
        const user = await usersManager.findByEmail(email)
        return user
    } catch (error) {
        return error
    }
}

export const createUser = async(obj) => {
    try {
        let newUser = {...obj}
        
        // Hashear password
        if(!obj.method) { // esto es para que si se registra con github con contraseña ' ' que no me deje loguear normalmente
            const passwordHash = createHash(obj.password)
            newUser.password = passwordHash
        }

        // Rol de administrador
        if(obj.email === config.admin_email) {
            newUser.role = 'admin'
        }
            
        // Crea un carrito para el usuario cuando se registra y le asocia el id
        const cart = await createNewCart()
        newUser.cart = cart._id
            
        const user = await usersManager.createUser(newUser)
        return user
    } catch (error) {
        return error
    }
}

export const updatePass = async(email,password) => {
    // encriptar la pass 
    const passwordHash = createHash(password)

    // actualizar el user
    try {
        const user = await usersManager.updateOneByEmail(email,{password: passwordHash})
        return user
    } catch (error) {
        return error
    }
}

export const updateRole = async(id,role) => {
    try {
        const user = await usersManager.updateOneById(id,{role: role})
        return user
    } catch (error) {
        return error
    }
}

export const lastConnectionUpdate = async(email) => {
    try {
        const user = await usersManager.updateOneByEmail(email,{last_connection: Date.now()})
        return user.last_connection
    } catch (error) {
        return error
    }
}

export const uploadDoc = async(uid, document) => {
    try {
        // darle formato al archivo
        let newFile = {
            name: document.filename,
            reference: document.path.split("public")[1]
        }

        // llamar al metodo para subir el archivo
        const response = await usersManager.uploadFile(uid,newFile)
        return response
        
    } catch (error) {
        return error
    }
}

export const getDocs = async(email) => {
    try {
        const user = await usersManager.findByEmail(email)
        const userDocs = user.documents

        return userDocs
    } catch (error) {
        return error
    }
}

export const getAllUsers = async() => {
    try {
        const users = await usersManager.findAll()
        const DTOUsers = users.map(user => getUserDTO2(user))
        const usersWithoutAdmin = DTOUsers.filter(user => user.role !== "admin")
        return usersWithoutAdmin
    } catch (error) {
        return error
    }
}

export const deleteInactiveUsers = async() => {
    try {
        //buscar los usuarios
        const users = await usersManager.findAll()

        // recorrer y chequear que se hayan conectado en los ultimos 2 dias
        users.forEach(async(user) => {

            const lastCon = user.last_connection // ultima conexion
            const diff = Date.now() - lastCon // diferencia en milisegundos con la hora actual
            
            // si pasaron 48hs
            if(diff > 48 * 60 * 60 * 1000){ 
                // borrar usuario inactivo
                const deletedUser = await usersManager.deleteByEmail(user.email)
                
                // borrar su carrito
                const deletedCart = await cartManager.deleteOne(user.cart)

                // enviarle un mail
                await transporter.sendMail({
                    to:user.email,
                    subject:'Account deleted',
                    html:`
                    <div>
                        <h1>Your account has been deleted due to inactivity.</h1>
                    </div>`
                })
            }
        })
        // devolver los usuarios que quedan
        const activeUsers = await usersManager.findAll()
        return activeUsers
    } catch (error) {
        return error
    }
}

export const deleteById = async(id) =>{
    try {
        const user = await usersManager.deleteById(id)
        return user
    } catch (error) {
        return error
    }
}