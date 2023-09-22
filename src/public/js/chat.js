// const socket = io()

// let chatBox = document.getElementById('chatBox')
// let listaOnline = document.getElementById('enLinea')
// let user
// fetch('/api/sessions/current')
//     .then(res => res.json())
//     .then(data => {
//         user = `${data.user.first_name} ${data.user.last_name}`
//         socket.emit('authOk', {user: user})
//     })

// chatBox.addEventListener('keyup', e => { // capturo el evento de soltar tecla
//     if(e.key === 'Enter') { // si la tecla es enter
//         if(chatBox.value.trim().length > 0) { // y el mensaje no esta vacio
//             socket.emit('message', { // hago que el socket emita un mensaje
//                 user: user,
//                 message: chatBox.value
//             })
//             chatBox.value = '' // reinicio el chatbox
//         }
//     }
// }) 

// // Socket Listeners 
// socket.on('messageLogs', data => { // Escucha el evento messageLogs
//     let log = document.getElementById('messageLogs') // selecciono el elemento donde se muestran los msjs
//     let messages = '' // creo variable para mensajes
//     data.forEach(message => { // recorre el array de messages que pasan por el socket y lo guarda en messages
//         messages += `<strong>${message.user}:</strong> ${message.message}</br>`
//     })
//     log.innerHTML = messages // muestra messages en el elemento seleccionado 
// })

// socket.on('newConnection', message => {
    
//     Swal.fire({
//         text: message,
//         toast: true,
//         position: 'bottom-right' 
//     })
// })

// socket.on('onlineConnections', arrayClients => {
//     let conectados = ''
//     arrayClients.forEach(client => {
//         conectados += `<li class="list-group-item">${client.user}</li>`
//     })
//     listaOnline.innerHTML = conectados
// })

// nuevo ---------------------------
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

const log = document.getElementById('messageLogs') // selecciono el elemento donde se muestran los msjs
// Socket Listeners 
socket.on('messageLogs', data => { // Escucha el evento messageLogs
    data.forEach(message => { // por cada mensaje 
        // creo los textos
        let usr = `${message.user}: `
        let msg = `${message.message}`

        // creo los elementos
        const li = document.createElement('li');
        const strong = document.createElement('strong');
        const span = document.createElement('span');

        // les agrego las clases de bootstrap
        strong.classList.add('fs-6', 'fw-semibold', 'fst-italic');
        span.classList.add('fs-6', 'fw-normal', 'text-break');

        // guardo los textos en los elementos en formato de texto para evitar problemas
        strong.textContent = usr;
        span.textContent = msg;

        // combino los elementos dentro de un li
        li.append(strong, span)
        
        // agrego el li a la ul de mensajes en la vista
        log.appendChild(li);

        // baja el scroll al final de la lista
        log.scrollTop = log.scrollHeight;
    })
})
socket.on('newMessage', data => { // Escucha el evento newMessage
    // creo los textos
    let usr = `${data.user}: `
    let msg = `${data.message}`

    // creo los elementos
    const li = document.createElement('li');
    const strong = document.createElement('strong');
    const span = document.createElement('span');

    // les agrego las clases de bootstrap
    strong.classList.add('fs-6', 'fw-semibold', 'fst-italic');
    span.classList.add('fs-6', 'fw-normal', 'text-break');

    // guardo los textos en los elementos en formato de texto para evitar problemas
    strong.textContent = usr;
    span.textContent = msg;

    // combino los elementos dentro de un li
    li.append(strong, span)
    
    // agrego el li a la ul de mensajes en la vista
    log.appendChild(li);

    // baja al final de la lista
    log.scrollTop = log.scrollHeight;
})

// notificacion toast cuando se conecta un usuario
socket.on('newConnection', message => {
    Swal.fire({
        text: message,
        toast: true,
        position: 'bottom-right',
        showConfirmButton: false,
        timer: 3000,
        timerProgressBar: true,
        didOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
    })
})

socket.on('onlineConnections', arrayClients => {
    let conectados = ''
    arrayClients.forEach(client => {
        conectados += `<li class="list-group-item">${client.user}</li>`
    })
    listaOnline.innerHTML = conectados
})