const addToCart = (cid, pid) => {

    // para que el usuario ingrese una cantidad
    Swal.fire({
        title: 'Enter a quantity',
        input: 'number',
        inputValue: 1,
        inputAttributes: {
            min: 1,
            step: 1
        },
        showCancelButton: true,
        confirmButtonText: 'Add to cart!',
        allowOutsideClick: false,
        inputValidator: (value) => {
            if (!value) {
              return 'You need to write something!'
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
                        //   Swal.fire({
                        //     title: 'Do you want to save the changes?',
                        //     showDenyButton: true,
                        //     showCancelButton: true,
                        //     confirmButtonText: 'Save',
                        //     denyButtonText: `Don't save`,
                        //   }).then((result) => {
                        //     /* Read more about isConfirmed, isDenied below */
                        //     if (result.isConfirmed) {
                        //       Swal.fire('Saved!', '', 'success')
                        //     } else if (result.isDenied) {
                        //       Swal.fire('Changes are not saved', '', 'info')
                        //     }
                        //   })
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