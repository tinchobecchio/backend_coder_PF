import jwt from 'jsonwebtoken'
import { getAllProds, getAllProducts, getProdById } from '../services/products.service.js'
import { getProducts } from '../services/cart.service.js'
import { findByEmail, getAllUsers, getDocs } from '../services/users.service.js'

// Login '/'
export const login = (req,res,next) => {
    // Si ya esta logueado lo manda a la vista de productos
    if(req.user) {
       return res.redirect('/products')
    }  
    // Si no esta logueado muestra el formulario de login
    return res.render('login', { 
        title: 'Login'
    })
}
 
// Registro
export const signUp = (req,res,next) => {
    // Si ya esta logueado lo manda a la vista de productos
    if(req.user) {
        return res.redirect('/products')
    }  
    // Si no esta logueado muestra el formulario de signup
    return res.render('signup', {
        title: 'Sign up'
    })
}

// Perfil
export const profile = async(req,res,next) => {
    try {
        const user = req.user
        const userDB = await findByEmail(user.email) // Lo vuelvo a buscar asi me trae mas info, el otro pasó x el DTO
        const uid = userDB._id
        const docs = userDB.documents

        let imgProfile = 'https://lombreach.es/wp-content/uploads/usuario-sin-foto.png' // imagen generica de usuario sin foto

        const profileDoc = docs.find((doc) => doc.name.split('-')[1].split('.')[0] === "profile") 
        // esto es porque viene asi '64fcbe17fde1942be2a485ae-profile.jpg'
        
        if(profileDoc){
            imgProfile = profileDoc.reference
        }
        let isAdmin = user.role === "admin"
        return res.render('profile', {
            title: 'Perfil',
            first_name: user.first_name,
            last_name: user.last_name,
            gender: user.gender,
            age: user.age,
            role: user.role,
            imgProfile: imgProfile,
            uid: uid,
            isAdmin: isAdmin
        })
    } catch (error) {
        console.log(error);
    }
}

// Vista de productos
export const products = async (req,res,next) => {
    try {
        const user = req.user
        const cid = `${user.cart}`

        // ---- con paginate----
        let { status, category, limit, page, sort } = req.query
        const paginate = await getAllProducts(status, category, limit, page, sort) 
        const products = paginate.docs
        // console.log(paginate)

        if(products){
            products.forEach(prod => {
                prod.cid = cid

                if(prod.owner === user.email){
                    prod.isOwner = true
                } else {
                    prod.isOwner = false
                }
            })
        } 
        let isAdmin = user.role === "admin"

        // variables para la paginacion en handlebars
        let totalPages = paginate.totalPages
        let currentPage = parseInt(page, 10) || 1
        let pages = [];
        for (let i = 1; i <= totalPages; i++) {
        pages.push({
            pageNumber: i,
            isCurrent: i === currentPage
        });
        }
        let currentPageGreaterThanOne = currentPage > 1;
        let currentPageLessThanTotal = currentPage < totalPages;
        let currentPageMinusOne = currentPage - 1;
        let currentPagePlusOne = currentPage + 1;
        let queryObject = { ...req.query };
        delete queryObject.page;
        let query = Object.keys(queryObject).map(key => `${key}=${queryObject[key]}`).join('&');
        let prev = `?${query}&page=${currentPageMinusOne}`
        let next = `?${query}&page=${currentPagePlusOne}`

        return res.render('products', {
            title: 'Productos',
            first_name: user.first_name,
            last_name: user.last_name,
            products: products,
            role: user.role,
            isAdmin: isAdmin,
            cid: cid,
            currentPage,
            totalPages,
            currentPageGreaterThanOne,
            currentPageLessThanTotal,
            pages,
            currentPageMinusOne,
            currentPagePlusOne,
            prev,
            next
        })
    } catch (error) {
        console.log(error)
    }
}

export const errorLogin = async (req,res,next) => {
    res.render('errorLogin', {
        title: 'Error Login',})
}

export const errorSignUp = async (req, res, next) => {
    res.render("errorSignup", {
        title: "Error Signup"
    })
}


// Vista de cart
export const cart = async (req,res,next) => {
    try {
        const user = req.user
        const cid = `${user.cart}`

        let products = await getProducts(cid)
        let prods = products.toObject()
        
        let total = 0
        if(prods[0]){
            prods.forEach(prod => {
                prod.cid = cid 
                prod.sum = prod.id_prod.price * prod.cant // para facilitar la suma total
                total += prod.sum
            })
        } 
        
        return res.render('cart', {
            title: 'Cart',
            products: prods,
            cid: cid,
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
            total: total
        })

    } catch (error) {
        next(error)
    }
}

// Resetear contraseña
export const resetPass = (req,res) => {
    res.render('resetPass', {title: 'Reset Password'})
}
// mail enviado
export const resetPassMailSent = (req,res) => {
    res.render('resetPassMail',{title: 'Reset Password', success: true})
}
// hubo error
export const resetPassError = (req,res) => {
    res.render('resetPassMail',{title: 'Reset Password'})
}

// Nueva contraseña
export const newPass = (req,res) => {
    // - chequea que el jwt sea valido (que no haya expirado)
    const token = req.params.token
    let success = true
    jwt.verify(token, 'password', (err,data) => {
        // - si expiró renderiza el error y un boton que lo mande a la de resetpass (seteando el success en false)
        if(err) {
            req.logger.error({message:'Invalid token'})
            success = false
            return
        } else {
            // guardo el token en una cookie que expire igual que el token (no se si es necesario que expiren igual)
            const tokenExpires = new Date(data.exp * 1000)  // paso a fecha la expiracion del token
            const dif = tokenExpires - Date.now();  // Calculo la diferencia en tiempo
            const cookieExp = new Date(Date.now() + dif)    // Establece la expiración de la cookie
            res.cookie('reset', token, { expires: cookieExp, httpOnly: true });  // Creo la cookie con la expiracion deseada
        }
    })
    
    // - si es valido le renderiza un campo para introducir nueva contra  y otro para repetirla
    return res.render('newPass',{title: 'Reset Password', success: success})
}

export const adminPanel = async(req,res,next) => {
    try {
        const user = req.user
        const users = await getAllUsers()

        let isAdmin = user.role === "admin"
        return res.render('adminPanel', {
            title: 'Admin Panel',
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
            users: users,
            isAdmin: isAdmin
        })

    } catch (error) {
        console.log(error);
    } 
}

// Editar producto (para admin y premium)
export const editProd = async (req,res,next) => {
    try {
        const user = req.user
        const { pid } = req.params

        const product = await getProdById(pid)
        
        let prod = {
            _id: product._id,
            title: product.title,
            description: product.description,
            code: product.code,
            price: product.price,
            stock: product.stock,
            thumbnails: product.thumbnails,
            category: product.category,
            owner: product.owner
        }

        return res.render('editProd', {
            title: 'Edit Product',
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
            prod: prod
        })

    } catch (error) {
        next(error)
    }
}

// Editar producto (para admin y premium)
export const premium = async (req,res,next) => {
    try {
        const user = req.user
        const productsDB = await getAllProds()
        let products
        let isAdmin = false

        if (user.role === "premium") {
            const filtered = productsDB.filter(prod => prod.owner === user.email) // para mostrarle solo los suyos
            const formated = filtered.map(prod => ({
                _id: prod._id,
                title: prod.title,
                code: prod.code,
                description: prod.description,
                thumbnails: prod.thumbnails
            }))
            products = formated
        }

        if(user.role === "admin") { 
            isAdmin = true
            products = productsDB.map(prod => ({
                _id: prod._id,
                title: prod.title,
                code: prod.code,
                description: prod.description,
                thumbnails: prod.thumbnails
            }))
        }

        return res.render('premium', {
            title: 'Premium',
            first_name: user.first_name,
            last_name: user.last_name,
            role: user.role,
            products: products,
            isAdmin: isAdmin
        })

    } catch (error) {
        next(error)
    }
}