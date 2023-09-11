import {ticketManager} from "../persistencia/DAOs/MongoDAOs/ticketMongo.js";
import { getProducts, resetCartProds, updateArrayProds } from './cart.service.js';
import { updateProd } from './products.service.js'
import { v4 as uuidv4 } from 'uuid';


export const createTicket = async(cid, email) => {
    try {
        //buscar carrito segun cid
        const cart = await getProducts(cid)
        
        const actualizar = []
        const noDisponibles = []
        let amount = 0

        //por cada producto del carrito fijarse si tiene stock disponible
        cart.forEach((prod) => {

            let cant = prod.cant
            let {stock, price} = prod.id_prod

            // si no tiene stock suficiente guardarlo en un array de productos no disponibles
            if(cant > stock){
                noDisponibles.push(prod)
            }

            //si tiene stock suficiente restar el necesario del stock del producto y agregar el monto total 
            if(cant <= stock){
                // Restar el stock
                stock -= cant
                actualizar.push([prod.id_prod._id, {'stock':stock}, cant]) // array de productos a los que hay que actualizarles el stock

                // Actualizar el monto total
                amount += cant * price
            }
        })

        let respuesta ={}

        // generar un ticket con los productos que pasaron la validacion
        if(actualizar.length > 0){
            // actualizar el stock de los productos que se van a comprar
            actualizar.forEach(async(prod) => {
                await updateProd(prod[0],prod[1])
            })

            // Crear el ticket
            let code = uuidv4()
            let purchaser = email

            const nuevoTicket = await ticketManager.createOne({code,amount,purchaser})

            // guardar info en la respuesta
            respuesta.ticket = nuevoTicket
            respuesta.products = actualizar.map(prod => {
                return {
                    "id_prod": prod[0], 
                    "cant": prod[2]
                }
            })
        }
        
        // devolver al carrito los productos que no se pudieron comprar
        if(noDisponibles.length > 0){
            await updateArrayProds(cid,noDisponibles)
            respuesta.not_purchased = noDisponibles.map(prod => prod.id_prod._id) // adjuntarlos en la respuesta
        } else {
            await resetCartProds(cid) // vaciar carrito en caso de que se compraron todos los productos
        }
        
        return respuesta
    } catch (error) {
        return error
    }
}