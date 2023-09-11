import mongoose from "mongoose";
import userModel from "../src/persistencia/models/Users.js";
import cartModel from "../src/persistencia/models/Cart.js";
import productModel from "../src/persistencia/models/Products.js";
import config from "../src/config/config.js";

import supertest from 'supertest'
export const requester = supertest(`http://localhost:${config.port}`)

before(async ()=>{
    await mongoose.connect(config.mongo_url_testing)
}) 

after(async ()=>{
    await productModel.deleteMany()
})

export const dropProducts = async()=>{
    // await productModel.collection.drop()
    await productModel.deleteMany()
}
export const dropUsers = async()=>{
    // await userModel.collection.drop()
    await userModel.deleteMany()
}
export const dropCarts = async()=>{
    // await cartModel.collection.drop()
    await cartModel.deleteMany()
}