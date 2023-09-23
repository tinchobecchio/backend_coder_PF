const validatePassword = async() => {
    const pass1 = document.getElementById("password1").value
    const pass2 = document.getElementById("password2").value

    if(pass1 !== pass2) {
        // Alerta si no escribe bien las contraseñas
        Swal.fire({
            icon: 'error',
            title: 'Ooops...',
            text: 'Passwords must be the same',
            confirmButtonText: 'OK',
            allowOutsideClick: false
        })
    } else {
        const URL = `/api/sessions/newpass`
        const obj = {newPassword: pass1}
        await fetch(URL, {
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: 'POST',
            body: JSON.stringify(obj)
        })
            .then(res => res.json())
            .then(res => {
                if(res.success){
                    Swal.fire({
                        icon: "success",
                        title: 'Success!',
                        text: res.message,
                        confirmButtonText: 'OK!',
                        allowOutsideClick: false
                    })
                    .then((result) => {
                        if (result.isConfirmed) {
                            location.href="/"
                        }
                    })
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Ooops...',
                        text: res.message,
                        confirmButtonText: 'OK',
                        allowOutsideClick: false
                    })
                }
            })
    }
}