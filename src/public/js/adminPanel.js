const changeRole = (id) => {
    const URL = `/api/users/premium/${id}`

    fetch(URL, {method: 'PUT'})
        .then(response => response.json())
        .then(data => {
            // Si se pudo cambiar el rol exitosamente
            if(data.status === 'success'){
                Swal.fire({
                    icon: "success",
                    title: 'Success!',
                    text: data.message,
                    confirmButtonText: 'OK!',
                    allowOutsideClick: false
                  }).then((result) => {
                    if (result.isConfirmed) {
                        location.reload()
                    } 
                  })
            }
            // si no se pudo cambiar el rol porque al usuario le falta subir documentacion
            if(data.status === 'error'){
                Swal.fire({
                    icon: 'error',
                    title: 'Ooops...',
                    text: data.message,
                    confirmButtonText: 'OK!',
                    allowOutsideClick: false
                })
            }
        }
    )
}

const deleteUser = (id) => {
    const URL = `/api/users/${id}`
    fetch(URL, {method: 'DELETE'})
        .then(response => response.json())
        .then(data => {
            // Si se pudo eliminar el usuario
            if(data.status === 'success'){
                Swal.fire({
                    icon: "success",
                    title: 'Success!',
                    text: data.message,
                    confirmButtonText: 'OK!',
                    allowOutsideClick: false
                  }).then((result) => {
                    if (result.isConfirmed) {
                        location.reload()
                    } 
                  })
            }
            // si no se pudo eliminar el usuario
            if(data.status === 'error'){
                Swal.fire({
                    icon: 'error',
                    title: 'Ooops...',
                    text: data.message,
                    confirmButtonText: 'OK!',
                    allowOutsideClick: false
                })
            }
        }
    )
}
const deleteInactiveUsers = () => {
    const URL = `/api/users/`
    fetch(URL, {method: 'DELETE'})
        .then(response => response.json())
        .then(data => {
            // Si se pudo eliminar los usuarios inactivos
            if(data.status === 'success'){
                Swal.fire({
                    icon: "success",
                    title: 'Success!',
                    text: data.message,
                    confirmButtonText: 'OK!',
                    allowOutsideClick: false
                  }).then((result) => {
                    if (result.isConfirmed) {
                        location.reload()
                    } 
                  })
            }
            // si no se pudo eliminar el usuario
            if(data.status === 'error'){
                Swal.fire({
                    icon: 'error',
                    title: 'Ooops...',
                    text: data.message,
                    confirmButtonText: 'OK!',
                    allowOutsideClick: false
                })
            }
        }
    )
}
