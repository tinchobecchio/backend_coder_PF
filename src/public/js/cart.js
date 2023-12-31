const deleteFromCart = (cid,pid) => {
    const URL = `/api/carts/${cid}/products/${pid}`
    fetch(URL, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {

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
            // si hubo error
            if(data.status === 'error'){
                Swal.fire({
                    icon: 'error',
                    title: 'Ooops...',
                    text: data.message,
                    confirmButtonText: 'OK!',
                    allowOutsideClick: false
                })
            }
        })
}

const resetCart = (cid) => {
    const URL = `/api/carts/${cid}`
    fetch(URL, { method: 'DELETE' })
        .then(response => response.json())
        .then(data => {
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
            // si hubo error
            if(data.status === 'error'){
                Swal.fire({
                    icon: 'error',
                    title: 'Ooops...',
                    text: data.message,
                    confirmButtonText: 'OK!',
                    allowOutsideClick: false
                })
            }
        })
}

const purchaseCart = (cid) => {
    const URL = `/api/carts/${cid}/purchase`
    fetch(URL)
    .then(response => response.json())
    .then(data => {
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
        // si hubo error
        if(data.status === 'error'){
            Swal.fire({
                icon: 'error',
                title: 'Ooops...',
                text: data.message,
                confirmButtonText: 'OK!',
                allowOutsideClick: false
            })
        }
    })
}

const editQuantity = (cid, pid, cant) => {
    // para que el usuario ingrese una nueva cantidad
    Swal.fire({
        title: 'Enter a quantity',
        input: 'number',
        inputValue: cant,
        inputAttributes: {
            min: 1,
            step: 1,
        },
        showCancelButton: true,
        confirmButtonText: 'Change it!',
        allowOutsideClick: false,
        inputValidator: (value) => {
            if (!value) {
              return 'You need to write something!'
            }
            if (value == cant) {
              return 'New quantity must be different from the current one!'
            }
        }
    }).then((result) => {
        // si ha ingresado una cantidad nueva entonces actualizarla
        if (result.isConfirmed) {
            const URL = `/api/carts/${cid}/products/${pid}`

            const newQuantity = {
                quantity: parseInt(result.value)
            }
            
            fetch(URL, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newQuantity) 
            })
                .then(response => response.json())
                .then(data => {
                    // al resultado mostrarlo en otro alert y hacer un location.reload()
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
                    // si no se pudo actualizar la cantidad mostrar error
                    if(data.status === 'error'){
                        Swal.fire({
                            icon: 'error',
                            title: 'Ooops...',
                            text: data.message,
                            confirmButtonText: 'OK!',
                            allowOutsideClick: false
                        })
                    }
                })
                .catch(err => {
                    Swal.fire({
                        icon: 'error',
                        title: 'Ooops...',
                        text: 'Something went wrong',
                        confirmButtonText: 'OK',
                        allowOutsideClick: false
                    })
                })
        } 
    })
}