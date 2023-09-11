import bcrypt from 'bcrypt';
import config from '../config/config.js';

// Hashea la contraseña
export const createHash = (password) => bcrypt.hashSync(password, bcrypt.genSaltSync(parseInt(config.salt)));

// Verifica la contraseña
export const validatePassword = (passwordSend, passwordDB) => bcrypt.compareSync(passwordSend,passwordDB)