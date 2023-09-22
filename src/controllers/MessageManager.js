import Messages from "../persistencia/models/Messages.js";
import { logger } from "../utils/logger.js";

export class MessageManager {

    // Crea un mensaje nuevo
    async createMsg(user, message) {
        try {
            let msg = await Messages.create(
                {
                    user,
                    message
                }
            )
            return msg
        } catch (error) {
            // console.log(error);
            logger.error(error)
        }
    }

    // Trae los mensajes guardados
    async getMessages() {
        try {
            const msgs = await Messages.find({})
            return msgs
            
        } catch (error) {
            logger.error(error)
        }
    }

}

export default MessageManager