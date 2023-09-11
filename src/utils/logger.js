import winston from 'winston'
import { options } from './commander.js'

const optionsLogger = {
    levels: {
        fatal: 0,
        error: 1,
        warning: 2,
        info: 3,
        http: 4,
        debug: 5
    },
    colors: {
        fatal: 'red',
        error: 'magenta',
        warning: 'yellow',
        info: 'cyan',
        http: 'gray',
        debug: 'green'
    }
}

const devLogger = winston.createLogger({
    levels: optionsLogger.levels,
    transports: [
        new winston.transports.Console({
            level: 'debug',
            format: winston.format.combine(
                winston.format.colorize({colors:optionsLogger.colors}),
                winston.format.simple()
            )
        })
    ]
})

const prodLogger = winston.createLogger({
    levels: optionsLogger.levels,
    transports: [
        new winston.transports.Console({
            level: 'info',
            format: winston.format.combine(
                winston.format.colorize({colors:optionsLogger.colors}),
                winston.format.simple()
            )
        }),
        new winston.transports.File({
            filename: './errors.log',
            level: 'error',
            format: winston.format.simple()
        })
    ]
})

// middleware que agrega el logger dependiendo el parametro que se le pase por consola
export const addLogger = (req,res,next) => {
    req.logger = (options.mode === 'dev') ? devLogger : prodLogger
    next()
}

export const logger = (options.mode === 'dev') ? devLogger : prodLogger // Para usarlo en los lugares que no tienen el req