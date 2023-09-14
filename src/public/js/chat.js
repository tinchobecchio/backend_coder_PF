const socket = io()

let chatBox = document.getElementById('chatBox')
let listaOnline = document.getElementById('enLinea')
let user
fetch('/api/sessions/current')
    .then(res => res.json())
    .then(data => {
        user = `${data.user.first_name} ${data.user.last_name}`
        socket.emit('authOk', {user: user})
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