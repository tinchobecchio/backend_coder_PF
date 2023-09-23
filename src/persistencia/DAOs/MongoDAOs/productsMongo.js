import productsModel from '../../models/Products.js'

class ProductsManager {
  async findAll() {
    try {
      const prods = await productsModel.find().lean()
      return prods
    } catch (error) {
      return error
    }
  }

  async findAllPaginate(query, limit, page, sorter) {
    try { // si no se le pasa limit lo puse por defecto en 8 porque queda bien en la vista products
        const prods = await productsModel.paginate(query,{limit: limit ?? 8, page: page ?? 1, sort: sorter, lean: true})
      return prods
    } catch (error) {
      return error
    }
  }

  async findOne(obj) {
    try {
      const prod = await productsModel.findOne(obj)
      return prod
    } catch (error) {
      return error
    }
  }

  async findOneByid(id) {
    try {
      const prod = await productsModel.findById(id)
      return prod
    } catch (error) {
      return error
    }
  }

  async createOne(obj) {
    try {
      const prod = await productsModel.create(obj)
      return prod
    } catch (error) {
      return error
    }
  }

  async updateOne(id, obj) {
    try {
      const updateprod = await productsModel.findOneAndUpdate({_id: id},obj )
      return updateprod
    } catch (error) {
      return error
    }
  }

  async deleteOne(id) {
    try {
      const deleteprod = await productsModel.deleteOne({ _id: id })
      return deleteprod
    } catch (error) {
      return error
    }
  }
}

export const productsManager = new ProductsManager()