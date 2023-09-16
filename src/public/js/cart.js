const deleteFromCart = (cid,pid) => {
    const URL = `http://localhost:4000/api/carts/${cid}/products/${pid}`
    // console.log(URL);
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
    const URL = `http://localhost:4000/api/carts/${cid}`
    // console.log(URL);
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
    const URL = `http://localhost:4000/api/carts/${cid}/purchase`
    // console.log(URL);
    fetch(URL)
    .then(response => response.json())
    .then(res => {
        // console.log(res.order)

        if(res.order.products?.length > 0){
            alert('Success')
        }
        if(res.order.not_purchased?.length > 0){
            alert('The products without stock remain in the cart')
        }

        location.reload()
    })
}

const editQuantity = (cid, pid, cant) => {
    // para que el usuario ingrese una nueva cantidad
    Swal.fire({
        title: 'Enter a quantity',
        input: 'text',
        inputValue: cant,
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