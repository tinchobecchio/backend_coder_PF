import { Router } from "express";
import { transporter } from '../utils/nodemailer.js'
import { __dirname } from "../utils/path.js";

const router = new Router()

router.post('/ticket', async(req,res) => {
    const {code, amount, purchaser, purchase_datetime} = req.body.ticket
    // console.log(req.body.ticket);
    try {
        await transporter.sendMail({
            to:purchaser,
            subject:'Ticket',
            html:`
            <div>
                <h1>Here is the info of your purchase:</h1>
                <p>Code: ${code}</p>
                <p>Time: ${purchase_datetime}</p>
                <p>Total amount: ${amount}</p>
            </div>`
        })

        res.status(200).json({message: 'Mail sent'})

    } catch (error) {
        res.status(500).json({error})
    }
})

router.post('/resetpass', async(req,res) => {
    const {email, link} = req.body
    
    try {
        await transporter.sendMail({
            to:email,
            subject:'Reset your password',
            html:`
            <div>
                <h1>Click this button to reset your password:</h1>
                <a href="${link}"><button>Click here!</button></a>
            </div>`
        })

        res.status(200).json({message: 'Mail sent'})

    } catch (error) {
        res.status(500).json({error})
    }
})

export default router