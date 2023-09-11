import EErrors from "../../services/errors/enums.js";

export default (error,req,res,next) => {
    switch (error.code) {
        case EErrors.ROUTING_ERROR:
            // req.logger.http('Routing Error')
            res.status(404).send({ status: "Error", error:error.name, message: error.message, cause: error.cause});
            break;
        case EErrors.INVALID_TYPES_ERROR:
            req.logger.error('Invalid types')
            res.status(400).send({ status: "Error", error:error.name, message: error.message, cause: error.cause});
            break;
        case EErrors.DATABASE_ERROR:
            req.logger.error('Database Error')
            res.status(500).send({ status: "Error", error:error.name, message: error.message, cause: error.cause});
            break;
        case EErrors.AUTHENTICATION_ERROR:
            req.logger.error('Authentication Error')
            res.status(401).send({ status: "Error", error:error.name, message: error.message, cause: error.cause});
            break;
        case EErrors.AUTHORIZATION_ERROR:
            req.logger.error('Authorization Error')
            res.status(403).send({ status: "Error", error:error.name, message: error.message, cause: error.cause});
            break;
        default:
            req.logger.error('Unhandled Error')
            res.status(500).send({ status: "Error", error: "Unhandled error" });
            break;
    }
}