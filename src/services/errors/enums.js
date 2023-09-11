const EErrors = {
    ROUTING_ERROR:1, // en el index para todas las rutas no definidas
    INVALID_TYPES_ERROR:2, // cuando se crea un producto
    DATABASE_ERROR:3,
    AUTHENTICATION_ERROR:4, // no creo usarlo porque directamente redirecciono
    AUTHORIZATION_ERROR:5 // lo use en el middleware de auth
}
export default EErrors