import userModel from '../../models/Users.js'

class UsersManager {

    async findAll() {
        try {
          const users = await userModel.find({}).lean()
          return users
        } catch (error) {
          return error
        }
      }

    async findById(id) {
        try {
            const user = await userModel.findById(id)
            return user
        } catch (error) {
            return error
        }
    }
    async findByEmail(email) {
        try {
            const user = await userModel.findOne({ email: email })
            return user
        } catch (error) {
            return error
        }
    }

    async createUser(obj) {
        try {
            const user = await userModel.create(obj)
            return user
        } catch (error) {
            return error
        }
    }

    async updateOneByEmail(email, obj) {
        try {
          const updatedUser = await userModel.findOneAndUpdate({email: email},obj )
          return updatedUser
        } catch (error) {
          return error
        }
    }
    
    async updateOneById(id, obj) {
        try {
          const updatedUser = await userModel.findOneAndUpdate({_id: id},obj )
          return updatedUser
        } catch (error) {
          return error
        }
    }

    async deleteByEmail(email) {
        try {
            const user = await userModel.deleteOne({ email: email })
            return user
        } catch (error) {
            return error
        }
    }

    async deleteById(id) {
        try {
            const user = await userModel.deleteOne({ _id: id })
            return user
        } catch (error) {
            return error
        }
    }

    async uploadFile(id, file) {
        try {
            // chequear si ya existe el archivo en la bdd
            const user = await userModel.findById(id)
            const exist = user.documents.find(doc => doc.name.split(".")[0] === file.name.split(".")[0])

            // si ya existe elimina al que habia y agrego el nuevo (esto es por si sube un archivo con otra extension)
            if(!!exist){
                user.documents.id(exist._id).deleteOne()
                user.documents.push(file)
                await user.save()
            } else { // si no existe solo lo agrega
                user.documents.push(file)
                await user.save()
            }

            return user
        } catch (error) {
            return error
        }
    }
}

export const usersManager = new UsersManager()