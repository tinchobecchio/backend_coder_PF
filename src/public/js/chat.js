const socket = io()

let chatForm = document.getElementById('chatForm')
let listaOnline = document.getElementById('enLinea')
let user
fetch('/api/sessions/current')
    .then(res => res.json())
    .then(data => {
        user = `${data.user.first_name} ${data.user.last_name}`
        socket.emit('authOk', {user: user})
    })

chatForm.onsubmit = async (e) => {

    e.preventDefault()

    //tomar la data
    let formData = new FormData(chatForm)

    // darle formato
    let obj = {}
    for (var entry of formData) {
        obj[entry[0]] = entry[1]
    }
    obj.user = user

    if(obj.message.trim().length > 0) { // si el mensaje no esta vacio
        socket.emit('message', obj) // envia el msj
        chatForm.reset()
    }
}

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