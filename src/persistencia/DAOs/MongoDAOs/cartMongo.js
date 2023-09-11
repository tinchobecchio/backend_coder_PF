import cartModel from '../../models/Cart.js'

export default class CartManager {
  async findAll() {
    try {
      const carts = await cartModel.find()
      return carts
    } catch (error) {
      return error
    }
  }

  async findOneByid(id) {
    try {
      const cart = await cartModel.findById(id)
      return cart
    } catch (error) {
      return error
    }
  }

  async createOne() {
    try {
      const cart = await cartModel.create({})
      return cart
    } catch (error) {
      return error
    }
  }

  async updateOne(id, obj) {
    try {
      const updateCart = await cartModel.updateOne({ _id: id }, { $set: obj })
      return updateCart
    } catch (error) {
      return error
    }
  }

  async deleteOne(id) {
    try {
      const deleteCart = await cartModel.deleteOne({ _id: id })
      return deleteCart
    } catch (error) {
      return error
    }
  }
}

export const cartManager = new CartManager()