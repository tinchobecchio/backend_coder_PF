# Proyecto Final: Backend de una Aplicación Ecommerce

Este proyecto fue desarrollado para la entrega final del [Curso de Programación Backend](https://www.coderhouse.com/online/programacion-backend) impartido por CoderHouse en el año 2023.

El servidor está hecho utilizando **Node.js** junto con **Express.js** y las vistas fueron hechas con el motor de plantillas de **Handlebars**. Para la base de datos se utilizó **MongoDB** y los paquetes de **Mongoose** y **mongoose-paginate-v2**

El sistema de autenticación y autorización está realizado con **Passport.js** y  las sesiones trabajadas con **JWT** y cookies firmadas. Toda la información sensible y contraseñas están hasheadas con la librería **Bcrypt** previamente a ser almacenadas en la base de datos.

El proyecto está basado en una *arquitectura por capas*, orientado a *MVC* y sigue las mejores prácticas para lograr una estructura robusta y completa.

Además, cuenta con un logger personalizado hecho con **Winston**, mensajería trabajada con **NodeMailer**, subida de archivos con **Multer** y un chat instantáneo hecho con **Websockets**.

Finalmente, la documentación está realizada con **Swagger** y para los tests se utilizaron las librerías **Mocha**, **Chai** y **Supertest**.

## Funcionalidades Principales

El proyecto incluye las siguientes funcionalidades principales:

- Registro y autenticación de usuarios.
- Gestión de productos (crear, actualizar, eliminar, listar).
- Realización de pedidos y seguimiento de compra por mail.
- Autenticación de usuarios utilizando JWT.
- Sistema de roles con permisos diferentes para cada tipo de usuario: "user", "premium" y "admin".
- Validación de entrada y manejo de errores.
- Conexión a una base de datos MongoDB para el almacenamiento de datos.

## Instalación local

1. Descargar o clonar el repositorio y correr en una terminal el comando `npm install`

2. Luego, crear el archivo *.env* en la raíz del proyecto y configurar con las variables de entorno que se encuentran en el archivo `ejemplo.env`

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

El Deploy se realizó con [Render](http://render.com) en esta dirección:

<https://ecommerce-backend-becchio.onrender.com/>

**Aclaración:** Si es la primera vez que entras a la página es posible que tarde más tiempo en cargar debido a que Render pone en suspenso los proyectos de tier gratuitos que no hayan tenido actividad durante los últimos 15 minutos y los vuelve a levantar cuando detecta una nueva petición.
