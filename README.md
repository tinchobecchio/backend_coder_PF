# Proyecto Final: Backend de una Aplicación Ecommerce

Este proyecto fue desarrollado para la entrega final del [Curso de Programación Backend](https://www.coderhouse.com/online/programacion-backend) impartido por CoderHouse en el año 2023.

El servidor está hecho utilizando **Node.js** junto con **Express.js** y las vistas fueron hechas con el motor de plantillas de **Handlebars**. Para la base de datos se utilizó **MongoDB** y los paquetes de **Mongoose** y **mongoose-paginate-v2**

El sistema de autenticación y autorización está realizado con **Passport.js** y  las sesiones trabajadas con **JWT** y cookies firmadas. Toda la información sensible y contraseñas están hasheadas con la librería **Bcrypt** previamente a ser almacenadas en la base de datos.

El proyecto está basado en una *arquitectura por capas*, orientado a *MVC* y sigue las mejores prácticas para lograr una estructura robusta y completa.

Además, cuenta con un logger personalizado hecho con **Winston**, mensajería trabajada con **NodeMailer**, subida de archivos con **Multer** y un chat instantáneo hecho con **Websockets**.

Finalmente, la documentación está realizada con **Swagger** y para los tests se utilizaron las librerías **Mocha**, **Chai** y **Supertest**.

## Instalación local

1. Descargar o clonar el repositorio y correr en una terminal el comando `npm install`

2. Luego crear el archivo *.env* en la raíz del proyecto y configurar las siguientes variables de entorno:

 >MONGO_URL= URL de tu base de datos en mongo
 MONGO_URL_TESTING= URL de la base de datos de testing en mongo
 PORT= puerto que quieras usar
 ADMIN_EMAIL= mail del admin del sitio
 ADMIN_PASSWORD= contraseña
 SIGNED_COOKIE= secreto para firmar cookies
 SESSION_SECRET= secreto para las sesiones
 SALT= salt para hashear datos
 GITHUB_CLIENT_ID  = id client en tu app de acceso con github
 GITHUB_CLIENT_SECRET= clave secreta de la app de github
 GMAIL_USER= mail para usar nodemailer
 GMAIL_PASSWORD= contraseña para applicaciones de gmail
 JWT_SECRET= secreto jason web token
 JWT_COOKIE= secreto para la cookie que guarda el JWT

3. Finalmente, podrás acceder al entorno de desarrollo corriendo el comando `npm run dev`

## Testing

Para acceder al entorno de testing y correr los tests escritos deberás seguir los siguientes pasos:

1. Por un lado, iniciar el servidor en una terminal corriendo el commando `npm run testing` *(esto hará que se conecte a la base de datos específica para testing configurada en la variable de entorno "MONGO_URL_TESTING")*.

2. Luego, en otra consola ejecutar el script `npm test` para correr los tests correspondientes.

## Documentación

La documentación de la API está hecha sobre los recursos de las rutas Cart y Products con la librería **Swagger**.

La misma se puede encontrar agregandole "/apidocs" a la URL base donde se encuentre el proyecto.  

Por ejemplo, suponiendo que estes corriendo el proyecto de forma local sobre el puerto 4000, la URL donde se encuentra la documentación sería <http://localhost:4000/apidocs/> .

## Deploy

El proyecto se encuentra actualmente deployado con [render](http://render.com) en esta dirección:

<https://ecommerce-backend-becchio.onrender.com/>

Si es la primera vez que entras a la página es posible que tarde un poco mas de tiempo en cargar debido a que render suele poner en suspenso a los proyectos y vuelve a hacer el deploy cuando detecta actividad.
