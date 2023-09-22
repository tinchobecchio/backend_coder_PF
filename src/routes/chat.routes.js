import { Router } from "express";
import {customJWTPolicy} from '../middlewares/auth.js'

const chatRouter = Router()

chatRouter.get('/', customJWTPolicy(["USER","PREMIUM"]), (req, res, next) => {
    try {
        const user = req.user
        let isUser = user.role === "user"
        res.render('chat', {
            title: 'Community Chat',
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
            isUser
        })
    } catch (error) {
        console.log(error);
    }
})

export default chatRouter