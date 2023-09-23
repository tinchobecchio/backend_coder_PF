import { transporter } from '../utils/nodemailer.js'
import { __dirname } from "../utils/path.js";

export const ticket = async(req,res) => {
    const {code, amount, purchaser, purchase_datetime} = req.body.ticket
    
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

        return res.status(200).json({status: "success", message: 'Mail sent successfully'})

    } catch (error) {
        return res.status(200).json({status: "error", message: 'There was a problem sending the email'})
    }
}

export const resetPass = async(req,res) => {
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
}