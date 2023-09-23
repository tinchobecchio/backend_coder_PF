import { Router } from "express";
import { login, signUp, profile, products, errorLogin, errorSignUp, cart, resetPass, resetPassMailSent, resetPassError, newPass, adminPanel, editProd, premium } from "../controllers/views.controller.js";
import { customJWTPolicy } from "../middlewares/auth.js";

import { mockingProds } from "../controllers/mocking.controller.js";

const viewsRouter = new Router()

viewsRouter.get('/', customJWTPolicy(["PUBLIC"]), login)
viewsRouter.get('/signup', customJWTPolicy(["PUBLIC"]), signUp)
viewsRouter.get('/errorLogin', customJWTPolicy(["PUBLIC"]), errorLogin)
viewsRouter.get("/errorSignup", customJWTPolicy(["PUBLIC"]),errorSignUp)
viewsRouter.get('/profile', customJWTPolicy(["USER","PREMIUM","ADMIN"]), profile)
viewsRouter.get('/products', customJWTPolicy(["USER","PREMIUM","ADMIN"]), products)
viewsRouter.get('/cart', customJWTPolicy(["USER","PREMIUM"]), cart)

//Desafio de mocking con faker
viewsRouter.get('/mockingproducts', mockingProds)

// Reset pass
viewsRouter.get('/resetpass', customJWTPolicy(["PUBLIC"]), resetPass)
viewsRouter.get('/resetpass/mailsent', customJWTPolicy(["PUBLIC"]), resetPassMailSent)
viewsRouter.get('/resetpass/mailerror', customJWTPolicy(["PUBLIC"]), resetPassError)
viewsRouter.get('/resetpass/newpass/:token', customJWTPolicy(["PUBLIC"]), newPass)

// Vistas Extras
viewsRouter.get('/adminPanel', customJWTPolicy(["ADMIN"]), adminPanel) // vista para el admin
viewsRouter.get('/edit-product/:pid', customJWTPolicy(["ADMIN", "PREMIUM"]), editProd) // vista para editar productos
viewsRouter.get('/premium', customJWTPolicy(["ADMIN", "PREMIUM"]), premium) // vista premium

export default viewsRouter;