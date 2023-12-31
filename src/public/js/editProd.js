const form = document.getElementById('editProductForm')
const pid = form.name

form.onsubmit = async (e) => {

    e.preventDefault()

    const URL = `/api/products/${pid}`

    //tomar la data
    let formData = new FormData(form)

    // darle formato
    let obj = {}

    for (var entry of formData) {
        obj[entry[0]] = entry[1]
    }
    obj.price = parseInt(obj.price)
    obj.stock = parseInt(obj.stock)

    // enviar la peticion
    fetch(URL, {
        method: 'PUT',
        body: JSON.stringify(obj),
        headers: {
            'Content-Type': 'application/json'
        },
    })
        .then(response => response.json())
        .then(data => {
            // respuesta exitosa
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
            // error
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
                        console.log(data);
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
                                    location.href="/premium"
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