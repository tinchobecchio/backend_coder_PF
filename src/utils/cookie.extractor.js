import config from "../config/config.js";

export const cookieExtractor = req => {
    let token = null;
    if(req && req.cookies) {
        token = req.cookies[config.jwt_cookie]
    }
    return token;
}