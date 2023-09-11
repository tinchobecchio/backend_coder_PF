import { findById, updateRole, uploadDoc } from "../services/users.service.js";

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
            return res.status(200).json({status: "success", message: 'Role changed to premium'})
        }

        if(user.role === "premium") {
            await updateRole(uid,'user')
            return res.status(200).json({status: "success", message: 'Role changed to user'})
        }
        
        // si no era ni user ni premium error
        return res.status(400).json({status: "error", message: 'Cannot change the role'})
    } catch (error) {
        console.log(error);
    }
}

export const uploadFiles = async(req,res,next)=>{
    try {
        if(!req.files){
            return res.status(400).send({status:"error", error:"Error trying to upload files"})
        }

        const {uid} = req.params
        const user = await findById(uid)

        if(!user._id){
            return res.status(400).send({status:"error", error:"Not a valid user"})
        }

        // CARGAR IMAGENES DE PRODUCTOS (al ser imagenes de productos puede subir varias a la vez)
        if(req.files.products !== undefined){
            let productsPics = req.files.products.map((doc) => ({
                name: doc.filename,
                reference: doc.path.split("public")[1]
            }))
            user.documents = [...user.documents, ...productsPics]
            await user.save()
        }

        // Para el resto que son unicos (una sola imagen de perfil, un solo dni, etc)
        const OPTIONS = [req.files.profiles, req.files["documents-id"], req.files["documents-address"], req.files["documents-account"]]
        
        OPTIONS.forEach(async(file) => {
            if(file !== undefined){
                let newFile = {
                    name: file[0].filename,
                    reference: file[0].path.split("public")[1]
                }
                await uploadDoc(uid,newFile)
            }
        })
    
        res.send({status:"success", message: "Files uploaded successfully"})

    } catch (error) {
        console.log(error);
    }
}