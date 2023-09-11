const socket = io()

let user
let chatBox = document.getElementById('chatBox')
let listaOnline = document.getElementById('enLinea')

Swal.fire({
    title:'Nuevo Usuario',
    input: "text",
    text: 'Ingresa un nombre para identificarte en el chat',
    inputValidator: (value) => {
        return !value && '¡Necesitas un nombre de usuario para continuar!'
    },
    allowOutsideClick: false
}).then(result => {
    user = result.value // seteo user con el nombre que ingresa en la alerta
    socket.emit('authOk', {user: user}) // le avisa al servidor que se autenticó correctamente
})

chatBox.addEventListener('keyup', e => { // capturo el evento de soltar tecla
    if(e.key === 'Enter') { // si la tecla es enter
        if(chatBox.value.trim().length > 0) { // y el mensaje no esta vacio
            socket.emit('message', { // hago que el socket emita un mensaje
                user: user,
                message: chatBox.value
            })
            chatBox.value = '' // reinicio el chatbox
        }
    }
}) 

// Socket Listeners 
socket.on('messageLogs', data => { // Escucha el evento messageLogs
    let log = document.getElementById('messageLogs') // selecciono el elemento donde se muestran los msjs
    let messages = '' // creo variable para mensajes
    data.forEach(message => { // recorre el array de messages que pasan por el socket y lo guarda en messages
        messages += `<strong>${message.user}:</strong> ${message.message}</br>`
    })
    log.innerHTML = messages // muestra messages en el elemento seleccionado 
})

socket.on('newConnection', message => {
    
    Swal.fire({
        text: message,
        toast: true,
        position: 'bottom-right' 
    })
})

socket.on('onlineConnections', arrayClients => {
    let conectados = ''
    arrayClients.forEach(client => {
        conectados += `<li class="list-group-item">${client.user}</li>`
    })
    listaOnline.innerHTML = conectados
})