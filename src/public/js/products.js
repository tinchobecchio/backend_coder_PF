const deleteProd = (pid, title) => {
    const URL = `/api/products/${pid}`
    
    Swal.fire({
        icon: 'warning',
        title: 'Do you want to delete this product?',
        text: title,
        confirmButtonText: 'Delete it!',
        showCancelButton: true,
        }).then((result) => {
        if (result.isConfirmed) {
            fetch(URL, { method: 'DELETE' })
                .then(response => response.json())
                .then(data => {
                    if(data.status === "success"){
                        Swal.fire({
                            icon: "success",
                            title: 'Success!',
                            text: data.message,
                            confirmButtonText: 'OK!',
                            allowOutsideClick: false
                          })
                          .then((result) => {
                            if (result.isConfirmed) {
                                location.reload()
                            }
                          })
                    } else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Ooops...',
                            text: 'Something went wrong',
                            confirmButtonText: 'OK',
                            allowOutsideClick: false
                        })
                    }
                })
        }
    })
}

const addToCart = (cid, pid) => {
    // para que el usuario ingrese una cantidad
    Swal.fire({
        title: 'Enter a quantity',
        input: 'number',
        inputValue: 1,
        inputAttributes: {
            min: 1,
            step: 1,
        },
        showCancelButton: true,
        confirmButtonText: 'Add to cart!',
        allowOutsideClick: false,
        inputValidator: (value) => {
            if (!value) {
              return 'You need to write something!'
            }
            if (parseInt(value) < 0) {
              return 'Please enter a positive number'
            }
        }
    })

    .then((result) => {
        if (result.isConfirmed) {
            const URL = `/api/carts/${cid}/products/${pid}`
            const newQuantity = {
                quantity: parseInt(result.value)
            }
            
            fetch(URL, {
                method: 'POST',
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
                            showDenyButton: true,
                            denyButtonColor: '#3085d6',
                            text: data.message,
                            confirmButtonText: 'Continue',
                            denyButtonText: 'Go to Cart',
                            allowOutsideClick: false
                          }).then((result) => {
                            if (result.isConfirmed) {
                                location.reload()
                            } else if (result.isDenied) {
                                location.href="/cart"
                            }
                          })
                    }
                    // mostrar error si paso algo
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
                .catch((err) => {
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