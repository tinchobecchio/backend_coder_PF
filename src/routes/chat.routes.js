import { Router } from "express";
import {customJWTPolicy} from '../middlewares/auth.js'

const chatRouter = Router()

chatRouter.get('/', customJWTPolicy(["USER","PREMIUM"]), (req, res, next) => {

    res.render('chat', {
        title: 'Chat comunitario'
    })
})

export default chatRouter