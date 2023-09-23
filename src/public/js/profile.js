const formDoc = document.getElementById("documentation-form")
const imgDoc = document.getElementById("img-form")


imgDoc.onsubmit = async(e) => {
    e.preventDefault()
    
    let formData = new FormData(imgDoc)
    const URL = `/api/users/${imgDoc.name}/documents`

    fetch(URL, {
        method: 'POST',
        body: formData
    })
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
        })

}

if(formDoc){ // esto es porque en el perfil del admin no esta definido formDoc ya que no se renderiza la documentacion
    formDoc.onsubmit = async(e) => {
        e.preventDefault()

        let formData = new FormData(formDoc)
        const URL = `/api/users/${formDoc.name}/documents`

        fetch(URL, {
            method: 'POST',
            body: formData
        })
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
            })
    }
}