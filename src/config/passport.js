import passport from 'passport'
import config from './config.js'
import {findByEmail, findById, createUser} from '../services/users.service.js'
import { validatePassword } from '../utils/bcrypt.js'
import { Strategy as LocalStrategy } from 'passport-local'
import { Strategy as JWTStrategy, ExtractJwt } from 'passport-jwt'
import { Strategy as GitHubStrategy} from 'passport-github2'
import { getUserDTO } from '../persistencia/DTOs/user.js'
import { cookieExtractor } from '../utils/cookie.extractor.js'

const initializePassport = () => {

    // Register
    passport.use('register', new LocalStrategy(
        { passReqToCallback: true, usernameField: 'email', session: false},
        async (req, email, password, done) => {
            const {first_name, last_name, gender, age, role} = req.body
            try {
                if(!first_name || !last_name || !age || !email || !password){
                    console.log('Todos los campos son requeridos');
                    return done(null,false)
                }

                const user = await findByEmail(email)
                if(user) {
                    console.log('El usuario ya existe');
                    return done(null, false) // Usuario ya registrado
                }
                
                // Llama al servicio que lo crea
                const newUser = await createUser(req.body)
                
                return done(null, newUser)

            } catch (error) {
                return done(error)
            }
        }
    ))

    passport.serializeUser((user, done) => {
        done(null,user._id)
    })

    passport.deserializeUser(async (id, done) => {
        const user = await findById(id)
        done(null,user)
    })

    // Login
    passport.use('login', new LocalStrategy(
        { usernameField: 'email', session: false }, 
        async (email, password, done) => {
            try {
                const user = await findByEmail(email)

                if(!user) { // No se encuentra el usuario
                    return done(null, false)
                }

                if(!validatePassword(password, user.password)) { 
                    return done(null, false) // Contraseña invalida
                }

                // Devuelvo solo los datos no sensibles
                const loggedUser = getUserDTO(user)

                return done(null, loggedUser)// Usuario Logueado

            } catch (error) {
                return done(error)
            }
        }
    ))

    // JWT
    passport.use('jwt', new JWTStrategy(
        {
            jwtFromRequest: ExtractJwt.fromExtractors([cookieExtractor]),
            secretOrKey: config.jwt_secret
        }, 
        async(jwt_payload,done) => {
            try {
                return done(null,jwt_payload)
            } catch (error) {
                done(error)
            }
        }
    ))

    // Github
    passport.use('github', new GitHubStrategy({
        clientID: config.github_client_id,
        clientSecret: config.github_client_secret,
        callbackURL: "http://localhost:4000/api/sessions/github/callback",
        passReqToCallback:true
      },
      async (req,accessToken, refreshToken, profile, done) => {
        const {name,email} = profile._json
        try {
            const userDB = await findByEmail(email)
            // si existe en la DB lo devuelve
            if(userDB){
                return done(null,userDB)
            }
    
            const user = {
                first_name: name.split(' ')[0],
                last_name: name.split(' ')[1] || '',
                email,
                password: ' ',
                method: 'github'
            }
            const newUserDB = await createUser(user)
            done(null,newUserDB);
    
        } catch (error) {
            done(error)
        }
    }));
}


export default initializePassport