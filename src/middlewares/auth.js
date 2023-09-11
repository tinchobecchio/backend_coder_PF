import config from "../config/config.js";
import CustomError from "../services/errors/CustomError.js";
import EErrors from "../services/errors/enums.js";
import jwt from "jsonwebtoken";

export const customJWTPolicy = (roles) =>{
    return (req,res,next) =>{
        try {
            if(roles[0].toUpperCase()==="PUBLIC") return next(); // Si es ruta publica que pase directamente

            // extraer user de cookies y meterlo en el req.user
            const token = req.cookies[config.jwt_cookie]
            if(!token) {
                // // Manejo de errores personalizado
                // CustomError.createError({
                //     name:"Authentication error",
                //     cause: "User is not authenticated",
                //     message:"You need to be logged in first.",
                //     code:EErrors.AUTHENTICATION_ERROR
                // })
                return res.redirect('/')
            }
            jwt.verify(token, config.jwt_secret, (err,data) => {
                if(err){
                    // Manejo de errores personalizado
                    CustomError.createError({
                        name:"Authentication error",
                        cause: "Invalid access token",
                        message:"The access token has expired or is not valid.",
                        code:EErrors.AUTHENTICATION_ERROR
                    })
                }  
                req.user = data
            })
            
            // Aplicar politicas de autorizacion            
            // debe estar logueado
            if(!req.user){
                // Manejo de errores personalizado
                CustomError.createError({
                    name:"Authentication error",
                    cause: "User is not authenticated",
                    message:"You need to be logged in first.",
                    code:EErrors.AUTHENTICATION_ERROR
                })
            } 
            
            // debe estar autorizado (su rol tiene que estar en el array de roles que se le pasa a la funcion)
            if(!roles.includes(req.user.role.toUpperCase())){
                // Manejo de errores personalizado
                CustomError.createError({
                    name:"Authorization error",
                    cause: "User tried to perform an action but doesn't have the required role",
                    message:"You're not authorized to perform this action.",
                    code:EErrors.AUTHORIZATION_ERROR
                })
            }
            next();
        } catch (error) {
            next(error);
        }
    }
}