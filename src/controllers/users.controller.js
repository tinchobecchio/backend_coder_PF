import { findById, getAllUsers, updateRole, uploadDoc, deleteInactiveUsers, deleteById } from "../services/users.service.js";

export const changeRole = async(req,res,next)=>{
    try {
        const {uid} = req.params
        // busca el usuario segun el uid
        const user = await findById(uid)

        // error si no existe
        if(!user) {
            return res.status(400).json({status:"error", message: 'Wrong User Id'})
        }

        // chequear el rol, si es user pasarlo a premium y viceversa
        if(user.role === "user"){

            // validar que haya cargado los documentos: Identificación, Comprobante de domicilio, Comprobante de estado de cuenta
            const id = user.documents.find(doc => doc.name.split(".")[0] === `${uid}-id`)
            const address = user.documents.find(doc => doc.name.split(".")[0] === `${uid}-address`)
            const account = user.documents.find(doc => doc.name.split(".")[0] === `${uid}-account`)

            if(!id || !address|| !account){

                let statusDocs = {}
                id ? statusDocs.id = 'ok' : statusDocs.id = 'not uploaded yet'
                address ? statusDocs.address = 'ok' : statusDocs.address = 'not uploaded yet'
                account ? statusDocs.account = 'ok' : statusDocs.account = 'not uploaded yet'

                return res.status(400).json({status: "error", message: 'User must upload all the documentation first', statusDocs})
            }

            await updateRole(uid,'premium')
            return res.status(200).json({status: "success", message: 'Role changed to premium. If the user is online he must logout first to see the changes.'})
        }

        if(user.role === "premium") {
            await updateRole(uid,'user')
            return res.status(200).json({status: "success", message: 'Role changed to user. If the user is online he must logout first to see the changes.'})
        }
        
        // si no era ni user ni premium error
        return res.status(400).json({status: "error", message: 'Cannot change the role'})
    } catch (error) {
        console.log(error);
    }
}

export const uploadFiles = async(req,res,next)=>{
    try {
        const {uid} = req.params
        const user = await findById(uid)
        const options = Object.keys(req.files) // tipos de archivos a subir
        
        // error si no hay archivos para subir
        if(!options[0]){
            return res.status(400).send({status:"error", error:"Error trying to upload files", message: "Please select files to upload"})
        }

        // error si el id de usuario es invalido
        if(!user._id){
            return res.status(400).send({status:"error", error:"Not a valid user"})
        }

        let newDocs = []
        
        // recorrer los arrays de cada opcion y pushear cada file en newDocs
        options.forEach(opt => {
            req.files[opt].forEach(file => newDocs.push(file))
        })

        // pasarle cada file al servicio que se encarga de subir los archivos
        newDocs.forEach(async(file) => await uploadDoc(uid,file))

        res.send({status:"success", message: "Files uploaded successfully"})

    } catch (error) {
        console.log(error);
    }
}

export const getUsers = async(req,res,next)=>{
    try {
        const users = await getAllUsers()
        return res.status(200).json({status: "success", users})
    } catch (error) {
        console.log(error);
    }
}

export const deleteUsers = async(req,res,next)=>{
    try {
        const users = await deleteInactiveUsers()
        return res.status(200).json({status: "success", message:"Inactive users deleted", activeUsers: users})
    } catch (error) {
        return res.status(400).json({status: "error", message:"Error trying to delete the user"})
    }
}

export const deleteUser = async(req,res,next)=>{
    try {
        const {uid} = req.params
        const user = await deleteById(uid)
        return res.status(200).json({status: "success", message:"User deleted successfully"})
    } catch (error) {
        return res.status(400).json({status: "error", message:"Error trying to delete the user"})
    }
}