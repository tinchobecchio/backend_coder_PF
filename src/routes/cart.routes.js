import { Router } from "express";
import { 
    getCarts, 
    createCart, 
    getCartProducts, 
    addCartProduct, 
    deleteCartProduct, 
    updateArrayProducts, 
    updateCartProductQuantity, 
    resetCart,
    purchase
} from '../controllers/cart.controller.js'
import {customJWTPolicy} from '../middlewares/auth.js'


const cartRouter = new Router()

cartRouter.get('/', customJWTPolicy(["ADMIN"]), getCarts)
cartRouter.post('/',customJWTPolicy(["USER","PREMIUM"]), createCart)
cartRouter.get('/:cid',customJWTPolicy(["USER","PREMIUM","ADMIN"]), getCartProducts)
cartRouter.put('/:cid', customJWTPolicy(["USER","PREMIUM"]), updateArrayProducts)
cartRouter.delete('/:cid', customJWTPolicy(["USER","PREMIUM"]), resetCart)
cartRouter.post('/:cid/products/:pid', customJWTPolicy(["USER","PREMIUM"]), addCartProduct)
cartRouter.put('/:cid/products/:pid', customJWTPolicy(["USER","PREMIUM"]), updateCartProductQuantity)
cartRouter.delete('/:cid/products/:pid', customJWTPolicy(["USER","PREMIUM"]), deleteCartProduct)
cartRouter.get('/:cid/purchase', customJWTPolicy(["USER","PREMIUM"]), purchase)


export default cartRouter