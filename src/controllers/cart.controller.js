import { 
    findAllCarts, 
    createNewCart, 
    getProducts, 
    addProduct, 
    deleteProduct, 
    updateArrayProds, 
    updateProductQuantity, 
    resetCartProds } from '../services/cart.service.js';
import { getProdById } from '../services/products.service.js';
import {createTicket} from '../services/ticket.service.js'
import { __dirname } from '../utils/path.js';
import CustomError from '../services/errors/CustomError.js';
import EErrors from '../services/errors/enums.js';

// Devuelve todos los carritos
export const getCarts = async (req,res,next) => {
    try {
        const carts = await findAllCarts()
        res.status(200).json({status: "success", payload: carts})
    } catch (error) {
        req.logger.error('Error trying to get carts')
        // res.send(error)
        next(error)
    }
}

// Crea un carrito nuevo
export const createCart = async (req,res,next) => {
    try {
        await createNewCart()
        res.status(201).json({status: "success", message: 'Cart created succesfully.'})
    } catch (error) {
        req.logger.error('Error trying to create a cart')
        // res.send(error)
        next(error)
    }
}

// Devuelve los productos de un carrito segun id
export const getCartProducts = async (req,res,next) => {
    try {
        const {cid} = req.params
        const products = await getProducts(cid)

        //Devuelve error si no lo encuentra
        if (!Array.isArray(products)) {
            CustomError.createError({
                name:"Error getting cart by ID",
                cause: 'The cart ID is invalid',
                message: `Cart ${cid} not founded`,
                code:EErrors.INVALID_TYPES_ERROR
            })
        }

        return res.status(200).json({status: "success", message: `Cart ${cid} founded`, cart: products})

    } catch (error) {
        next(error)
    }
}

// Agrega un producto a un carrito. Por body se le pasa quantity
export const addCartProduct = async (req,res,next) => { // premium no puede agregar prods suyos
    try {
        const {pid, cid} = req.params
        const quantity = req.body.quantity

        // si es un usuario premium y ES un producto suyo devuelve error
        const product = await getProdById(pid) 
        if(req.user.role !== "admin" && product.owner === req.user.email){
            // CustomError.createError({
            //     name:"Adding a product to cart error",
            //     cause: "The product belong to the user",
            //     message:"You can't buy your own products",
            //     code:EErrors.AUTHORIZATION_ERROR
            // })
            return res.status(200).json({status: "error", message: "You are not allowed to buy your own products!"})
        }

        if(quantity>0){
            
            const carrito = await addProduct(cid,pid,quantity)
            
            if(!carrito) {
                CustomError.createError({
                    name:"Adding a product to cart error",
                    cause: 'The cart ID is invalid',
                    message: `Cart ${cid} not founded`,
                    code:EErrors.INVALID_TYPES_ERROR
                })
            }
            
            return res.status(200).json({status: "success", message: 'Product added to cart', cart: carrito})
        }
        else {
            CustomError.createError({
                name:"Adding a product to cart error",
                cause: 'The quantity is not valid',
                message: `The quantity of the product has to be a positive number.`,
                code:EErrors.INVALID_TYPES_ERROR
            })
        }
        
    } catch (error) {
        next(error)
    }
}

// Elimina un producto del carrito seleccionado
export const deleteCartProduct = async (req,res,next) => {
    try {
        let { cid, pid } = req.params

        //Devuelve error no encuentra un carrito con ese cid
        const products = await getProducts(cid)
        if (!Array.isArray(products)) {
            CustomError.createError({
                name:"Error trying to delete a product from the cart",
                cause: 'The cart ID is invalid',
                message: `Cart with ID ${cid} not founded`,
                code:EErrors.INVALID_TYPES_ERROR
            })
        }

        // elimina el producto del carrito
        const carrito = await deleteProduct(cid, pid)
        return res.status(200).json({status: "success", message: 'The product has been removed from cart', cart: carrito})

    } catch (error) {
        next(error)
    }
}

// Actualiza los productos de un carrito con un array de ids de productos dado (se lo paso por req.body)
export const updateArrayProducts = async (req,res,next) => {
    try {
        const { cid } = req.params
        const { array } = req.body 

        // validar que existe un carrito con ese cid
        const carrito = await getProducts(cid)
        if (!Array.isArray(carrito) ) {
            CustomError.createError({
                name:"Updating cart with an array of products has failed",
                cause: 'The cart ID is invalid',
                message: `The cart with ID ${cid} doesn't exist.`,
                code:EErrors.INVALID_TYPES_ERROR
            })
        }

        // actualizar
        await updateArrayProds(cid, array)

        return res.status(200).json({status: "success",message: 'Cart has been updated successfully'})
        
    } catch (error) {
        next(error)
    }
}

// Actualiza la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body
export const updateCartProductQuantity = async (req,res,next) => {
    try {
        let { cid, pid } = req.params
        let { quantity } = req.body

        if(quantity>0){
            const carrito = await updateProductQuantity(cid,pid,quantity)
            
            if(!carrito) {
                CustomError.createError({
                    name:"Updating quantity of a product in cart error",
                    cause: 'The cart ID is not valid',
                    message: `Cart ${cid} not founded`,
                    code:EErrors.INVALID_TYPES_ERROR
                })
            }
            
            return res.status(200).json({status: "success", message: `Quantity updated to ${quantity}`, cart: carrito})
        }
        else {
            CustomError.createError({
                name:"Updating quantity of a product in cart error",
                cause: 'The quantity is not valid',
                message: `The quantity of the product has to be a positive number.`,
                code:EErrors.INVALID_TYPES_ERROR
            })
        }

    } catch (error) {
        next(error)
    }
}

// Elimina todos los productos del carrito
export const resetCart = async (req,res,next) => {
    try {
        const { cid } = req.params
        
        // validar que sea un cid correcto
        const cart = await getProducts(cid)
        if (!Array.isArray(cart) ) {
            CustomError.createError({
                name:"Trying to remove all products from Cart has failed",
                cause: 'The cart ID is invalid',
                message: `The cart with ID ${cid} doesn't exist.`,
                code:EErrors.INVALID_TYPES_ERROR
            })
        }

        // resetear
        const carrito = await resetCartProds(cid)
        
        return res.status(200).json({status: "success", message: 'All products from cart has been removed successfully', cart: carrito})

    } catch (error) {
        next(error)
    }
}

// Genera un ticket de compra con los items del carrito que estan en stock y luego envia un email
export const purchase = async (req,res,next) => {
    try {
        const { cid } = req.params
        const { email } = req.user
        const newTicket = await createTicket(cid, email)

        if(newTicket.ticket){ // si se pudo comprar algo
            // mandar mail
            const baseUrl = req.protocol + '://' + req.get('host'); // trae https + :// + pepito.com
            const URL = `${baseUrl}/api/mail/ticket`

            fetch(URL, {
                method: 'POST',
                body: JSON.stringify(newTicket),
                headers: {"Content-type": "application/json; charset=UTF-8"}
            })
            .catch(err => console.log(err))
            
            if(newTicket.not_purchased){ // si se pudo comprar algo pero hubo productos que no tenian stock
                return res.status(200).json({status: "success", message: 'Some products do not have enough stock and were returned to the cart. We have sent you an email with your purchase information.', order: newTicket})
            }
            // Si se pudo comprar todo
            return res.status(200).json({status: "success", message: 'We have sent you an email with your purchase information.', order: newTicket})
        
        } else if (!newTicket.ticket && newTicket.not_purchased){ // si no se pudo comprar nada
            return res.status(200).json({status: "error", message: 'The products do not have enough stock'})
        }

    } catch (error) {
        next(error)
    }
}