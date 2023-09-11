import { Router } from "express";
import { getProducts, getProductById, addProduct, updateProduct, deleteProduct } from '../controllers/products.controller.js'
import {customJWTPolicy} from '../middlewares/auth.js'

const productRouter = new Router()

productRouter.get('/', customJWTPolicy(["USER","PREMIUM","ADMIN"]), getProducts)
productRouter.post('/', customJWTPolicy(["PREMIUM","ADMIN"]), addProduct) // el premium tambien puede crear
productRouter.get('/:pid', customJWTPolicy(["USER","PREMIUM","ADMIN"]), getProductById)
productRouter.put('/:pid', customJWTPolicy(["PREMIUM","ADMIN"]), updateProduct) // premium solo modifica los de el, admin todos
productRouter.delete('/:pid', customJWTPolicy(["PREMIUM","ADMIN"]), deleteProduct) // premium solo borra los de el, admin todos

export default productRouter