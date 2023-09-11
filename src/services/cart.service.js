import {cartManager} from "../persistencia/DAOs/MongoDAOs/cartMongo.js";

export const findAllCarts = async() => {
    try {
        const carts = await cartManager.findAll();
        return carts
    } catch (error) {
        return error
    }
}

export const createNewCart = async() => {
    try {
        const cart = await cartManager.createOne();
        return cart
    } catch (error) {
        return error
    }
}

// Devuelve los productos de un carrito segun id
export const getProducts = async (id) => {
    try {
        // Busca el carrito con el id
        const cart = await cartManager.findOneByid(id)
        let populatedCart = await cart.populate('products.id_prod') // populate para mostrar los productos completos
        return populatedCart.products
    
    } catch (error) {
        return error
    }
}

// Agrega un producto a un carrito. Por body se le pasa quantity
export const addProduct = async (cid,pid,quantity) => { 
    try {
            let carrito = await cartManager.findOneByid(cid)
            const existingProd = carrito.products.find(e => e.id_prod == pid)
            // si el producto existe en el carrito le agrega la cantidad
            if(existingProd) {
                quantity = parseInt(quantity) + parseInt(existingProd.cant)
                await updateProductQuantity(cid, pid, quantity)

                carrito = await cartManager.findOneByid(cid)
                return carrito
            }
            // agrega el producto si no existe
            const nuevoProducto = {
                id_prod: pid,
                cant: parseInt(quantity)
            }

            carrito.products.push(nuevoProducto)
            carrito.save()

            return carrito

    } catch (error) {
        console.log(error);
        return error;
    }
}

// Elimina un producto del carrito seleccionado
export const deleteProduct = async (cid, pid) => {
    try {
        const cart = await cartManager.findOneByid({_id: cid})

        let aux = cart.products.filter(prod => prod.id_prod._id != pid)
        cart.products = aux
        
        await cart.save()
        return cart

    } catch (error) {
        return error
    }
}

// Actualiza los productos de un carrito con un array de ids de productos dado (se lo paso por req.body)
export const updateArrayProds = async (cid, array) => {
    try {
        array.forEach(prod => addProduct(cid, prod.idProd, prod.quantity))
        return 
    } catch (error) {
        return error
    }
}

// Actualiza la cantidad de ejemplares del producto por cualquier cantidad pasada desde req.body
export const updateProductQuantity = async (cid, pid, quantity) => {
    try {
        const carrito = await cartManager.findOneByid(cid)

        let producto = carrito.products.find(e => e.id_prod == pid)
        
        producto.cant = quantity
        await carrito.save()

        return carrito

    } catch (error) {
        return error;
    }
}

// Elimina todos los productos del carrito
export const resetCartProds = async (cid) => {
    try {
            const carrito = await cartManager.findOneByid(cid)
            carrito.products = [] // reinicio el carrito
            await carrito.save()

            return carrito

        } catch (error) {
            return error;
        }
    }