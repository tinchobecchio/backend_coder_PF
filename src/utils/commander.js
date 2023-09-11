import {program} from 'commander'

// defino la opcion que quiero pasar por parametro en consola
program.option('-m, --mode <mode>', 'Define el modo de ejecucion', 'dev')
.option('-f, --file <file>', 'The file to read') // esto funciona con Mocha
.option('-t, --timeout <timeout>', 'The timeout') // esto funciona con Mocha
.parse() 

// En el package.json estan definidos los scripts para entrar a desarrollo, produccion y testing
// 'npm run dev' y 'npm run prod' 'npm run testing' respectivamente
// Ej: "testing": "nodemon src/index.js -m testing"

export const options = program.opts()