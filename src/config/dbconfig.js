import mongoose from 'mongoose';
import config from './config.js';

// Conexion a la base de datos
mongoose.connect(config.mongo_url)
.then(() => console.log('DB is connected'))
.catch((err) => console.log('Error en mongodb atlas:',err))