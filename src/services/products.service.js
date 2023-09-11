import {productsManager} from '../persistencia/DAOs/MongoDAOs/productsMongo.js';

// Devuelve los productos con paginate
export const getAllProducts = async (status, category, limit, page, sort) => {
    try {
        let sorter = {}
        sort ? sorter = {price: sort} : sorter = {price: 0}

        let query = {}
        category ? query.category = category : null
        status ? query.status = status : null

        const productos = await productsManager.findAllPaginate(query, limit, page, sorter)
        return productos

    } catch (error) {
      return error
    }
}
// Devuelve todos los prods sin paginate
export const getAllProds = async () => {
    try {
        const productos = await productsManager.findAll()
        return productos
    } catch (error) {
      return error
    }
}

// Devuelve el producto que coincide con el id
export const getProdById = async (pid) => {
    try {
        let producto = await productsManager.findOneByid(pid)
        return producto

    } catch (error) {
        return error
    }
}
// Devuelve el producto que coincide con criterio pasado
export const getProd = async (obj) => {
    try {
        let producto = await productsManager.findOne(obj)
        return producto

    } catch (error) {
        return error
    }
}
// Agrega un producto
export const addNewProduct = async (obj) => {
    try {
        const prod = productsManager.createOne(obj)
        return prod
        
    } catch (error) {
        res.send(error);
    }
}
// Actualiza un producto
export const updateProd = async (id, obj) => {
    try {
        const prod = await productsManager.updateOne(id,obj)
        return prod

    } catch (error) {
        return error
    }
}
// Elimina un producto
export const deleteProd = async (pid) => {
    try {
        const prod = await productsManager.deleteOne(pid)
        return prod
        
    } catch (error) {
        return error
    }
}