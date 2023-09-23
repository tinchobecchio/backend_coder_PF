import {getUserDTO} from '../persistencia/DTOs/user.js'
import jwt from 'jsonwebtoken'
import config from '../config/config.js'
import { findByEmail, lastConnectionUpdate, updatePass } from '../services/users.service.js'
import { validatePassword } from '../utils/bcrypt.js'


export const logout = async(req,res,next) => {
  try {
    const connection = await lastConnectionUpdate(req.user.email)
    res.clearCookie(config.jwt_cookie)
    res.redirect('/')
  } catch (error) {
    req.logger.error(error)
  }
}

export const current = (req,res) => {
  let user = getUserDTO(req.user)
  return res.status(200).json({message: 'User active', user})
}

export const login = async(req,res,next) => {
  try {
    const user = getUserDTO(req.user)
    // creo el token con la info del usuario logueado
    const token = jwt.sign(user, config.jwt_secret, {expiresIn:"1h"})
  
    // guardo el token en las cookies
    res.cookie(config.jwt_cookie, token, {maxAge: 60*60*1000, httpOnly: true})
  
    // Actualizo la ultima conexión
    const connection = await lastConnectionUpdate(req.user.email)

    // Lo redirijo a productos
    res.redirect('/products')
    
  } catch (error) {
    console.log(error);
  }
}

export const resetPwd = async(req,res,next) => {
  const email = req.body.email
  try {
    // - buscar el usuario en la base de datos (devolver error si no existe)
    const user = await findByEmail(email)
    
    if(!user){
      console.log('no existe el usuario con ese email');
      return res.status(400).json({error:"user not found"}) // puedo redirigir a una vista de error <-----------
    }

    // - crear jwt que dure 1hr con el user dentro
    const payload = {
      email,
      password: user.password
    }
    const token = jwt.sign(payload, 'password', {expiresIn:"1hr"})

    const baseUrl = req.protocol + '://' + req.get('host'); // trae https + :// + pepito.com

    // - crear un link a una vista de nueva contraseña con el jwt en el params
    const link = `${baseUrl}/resetpass/newpass/${token}` 

    // - fetch post a la ruta del nodemailer pasandole el link para que lo agregue al boton del mail
    const URL = `${baseUrl}/api/mail/resetpass`

    fetch(URL, {
      method: 'POST',
      body: JSON.stringify({email,link}),
      headers: {"Content-type": "application/json; charset=UTF-8"}
    })
      .then(response => response.json())
      .then(res => req.logger.info(res))
      .catch(err => req.logger.error('error en enviando mail',err))
      
    // - redireccionar a vista de mail enviado revisar correo y un boton de volver al login
    res.redirect('/resetpass/mailsent')
      
    } catch (error) {
      req.logger.error('hubo un error',error);
      // - vista de hubo un problema
      res.redirect('/resetpass/mailerror')
  }
}

export const newpass = async(req,res) => {
  // extraer contra nueva
  const {newPassword} = req.body
  // extraer user de la cookie
  const cookie = req.cookies['reset']
  let user
  jwt.verify(cookie, 'password', (err,data)=>{
    if(err) return res.send(err) // mejorar esto

    user = data
  })
  // comparar ambas passwords
  // desencriptar contra si esta encriptada
  let samePass
  if(user.password.length > 1) { // si esta encriptada
    samePass = validatePassword(newPassword, user.password )
  } else {
    samePass = false // si es una contra con github lo dejo en false asi puede setearla
  }
  // si son la misma redireccionar a una vista resultado error que le advierta que la contra debe ser distinta a la actual
  if(samePass){
    req.logger.warning('La contraseña nueva no puede ser igual a la actual')
    return res.json({success: false, message: 'The new password must be different than the old one, please try again'})
  } else {

    try {
      // si son diferentes, actualizar en la base de datos al usuario que coincida con el email de la cookie. usar el userservice(hashea la pass)
      await updatePass(user.email,newPassword)

      // eliminar cookie
      res.cookie('reset', '', { expires: new Date(0), httpOnly: true })

      return res.json({success: true, message: 'Congratulations, the password has been updated!'})

    } catch (error) {
      req.logger.error({message: error})
      return res.json({success: false, message: 'The new password must be different than the old one, please try again'})
    }
  }
}