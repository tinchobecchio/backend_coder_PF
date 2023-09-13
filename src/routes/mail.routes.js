import { Router } from "express";
import { resetPass, ticket } from "../controllers/mail.controller.js";

const router = new Router()

router.post('/ticket', ticket)
router.post('/resetpass', resetPass)

export default router