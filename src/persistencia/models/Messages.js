import { Schema, model } from "mongoose";

const messageSchema = new Schema({
    user: String,
    message: String
})

export default model("messages", messageSchema)