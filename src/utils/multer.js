import multer from 'multer'
import { __dirname } from './path.js'

const storage = multer.diskStorage({
    destination: function(req,file,cb){
        let typeFile = file.fieldname // propiedad name del input donde se sube el archivo
        
        if(typeFile !== "products" && typeFile !== "profiles"){ // si es documents
            typeFile = typeFile.split("-")[0] // esto es porque los docs vienen con el name 'documents-id' por ej
        }
        
        cb(null,`${__dirname}/public/uploads/${typeFile}`)
    },

    filename: function(req,file,cb){
        let {uid} = req.params
        let name = `${uid}-${file.originalname}` // le agrego el uid para reconocerlo
        let typeFile = file.fieldname // propiedad name del input que dice el tipo de archivo
        
        // si es una imagen de perfil
        if(typeFile === "profiles"){
            const extension = file.originalname.split(".")[1]
            name = `${uid}-profile.${extension}`
        }

        // si es un doc
        if(typeFile !== "products" && typeFile !== "profiles"){ 
            const nombreDoc = typeFile.split("-")[1]
            const extension = file.originalname.split(".")[1]

            name = `${uid}-${nombreDoc}.${extension}`
        }

        cb(null,name)
    }
})

export const uploader = multer({storage})

