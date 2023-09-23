import "./config/dbconfig.js";
import * as path from "path";
import { hbs } from "./utils/hbs.js"; // hice uno personalizado con helpers en utils
import { Server } from "socket.io";
import { __dirname, __filename } from "./utils/path.js";
import config from "./config/config.js";
import express from "express";
import passport from "passport";
import cookieParser from "cookie-parser"; // Cookies
import initializePassport from "./config/passport.js";

import productRouter from "./routes/product.routes.js";
import cartRouter from "./routes/cart.routes.js";
import chatRouter from "./routes/chat.routes.js";
import sessionsRouter from "./routes/sessions.routes.js";
import viewsRouter from "./routes/views.routes.js";
import mailRouter from "./routes/mail.routes.js";
import usersRouter from "./routes/users.routes.js";
import MessageManager from "./controllers/MessageManager.js";

import errorHandler from "./middlewares/errors/index.js";
import CustomError from "./services/errors/CustomError.js";
import EErrors from "./services/errors/enums.js";
import { addLogger } from "./utils/logger.js";

import swaggerJsdoc from 'swagger-jsdoc'
import swaggerUiExpress from 'swagger-ui-express'

// Configuraciones
const app = express();
const PORT = config.port || 8080;

// Server HTTP
const httpServer = app.listen(PORT, () =>
  console.log(`Listening on port ${PORT}`)
);

// Swagger
const swaggerOptions = {
  definition: {
      openapi: '3.1.0',
      info: {
          title:'Documentación',
          description:'Informacion de los endpoints para los productos y para el carrito de compras.',
          version:'1.0.0',
          contact: {
              name:'Martin Becchio',
              url:'https://www.linkedin.com/in/becchiomartin/'
          }
      }
  },
  apis: [`${process.cwd()}/src/docs/**/*.yaml`]
}
const spec = swaggerJsdoc(swaggerOptions)

//Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, "./public"))); // static files
app.use(cookieParser(config.signed_cookie)); // Cookies firmadas
app.use('/apidocs', swaggerUiExpress.serve, swaggerUiExpress.setup(spec)) // Swagger

// Config passport
initializePassport();
app.use(passport.initialize());

// Configuraciones HBS
app.engine("handlebars", hbs.engine); // personalizado con helpers de handlebars
app.set("view engine", "handlebars");
app.set("views", path.resolve(__dirname, "./views"));

// Logger
app.use(addLogger)

// RUTAS
app.use("/api/products", productRouter);
app.use("/api/carts", cartRouter);
app.use("/chat", chatRouter);
app.use("/api/sessions", sessionsRouter);
app.use("/", viewsRouter);
app.use("/api/mail", mailRouter);
app.use("/api/users", usersRouter);

// Ruta para probar el logger
app.get('/loggerTest', (req,res) => {
  req.logger.fatal('este es fatal')
  req.logger.error('este es error')
  req.logger.warning('este es warning')
  req.logger.info('este es info')
  req.logger.http('este es http')
  req.logger.debug('este es debug')
  res.send({message: 'Probando el Logger'})
})

// Error para rutas no definidas
app.get('/*', (req,res,next) => {
  const error = CustomError.createError({
    name: "Invalid Route",
    cause: "The route is not a valid route",
    message: "The route is not defined",
    code: EErrors.ROUTING_ERROR
  })
  next(error)
});

// Manejo de errores
app.use(errorHandler);

// Socket.io 
const io = new Server(httpServer, { cors: { origin: "*" } });
const msg = new MessageManager();

let clients = [];
io.on("connection", (socket) => {
  console.log("Nuevo cliente conectado");

  socket.on("authOk", async (data) => { // cuando el usuario se autentica correctamente
    
    let messages = await msg.getMessages(); // trae los mensajes de la base de datos
    io.emit("messageLogs", messages); // le manda los mensajes del chat

    let text = `${data.user} se ha conectado`;
    socket.broadcast.emit("newConnection", text); // avisa al resto que se conecto

    if(clients.find(user => user.user === data.user)){ // si existe lo saca de la lista
      let filtered = clients.filter(user => user.user !== data.user)
      clients = filtered
    }
    clients.unshift(data); // lo agrega al principio de la lista

    if (clients.length > 9) {
      let listado = clients.slice(0, 9);
      io.emit("onlineConnections", listado);
    } else {
      io.emit("onlineConnections", clients);
    }
  });

  // cuando escucha un nuevo mensaje
  socket.on("message", async (data) => {
    try {
      let newMsg = await msg.createMsg(data.user, data.message); // lo crea y guarda en la base de datos
      io.emit("newMessage", newMsg); // emite un evemto newMessage con el mensaje creado
    } catch (error) {
      console.log(error);
    }
  });
});
