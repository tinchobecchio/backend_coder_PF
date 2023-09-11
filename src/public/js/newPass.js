const validatePassword = async() => {
    const pass1 = document.getElementById("password1").value
    const pass2 = document.getElementById("password2").value

    if(pass1 !== pass2) {
        alert('Passwords must be the same') // Alerta si no escribe bien las contraseñas
    } else {
        const URL = 'http://localhost:4000/api/sessions/newpass'
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
                alert(res.message)
                if(res.success) return window.location.replace("/")
            })
    }
}