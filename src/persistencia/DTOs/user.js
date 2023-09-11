

export const getUserDTO = (user) => {
    const {first_name, last_name, email, gender, age, role, cart } = user
    let newUser = {
        first_name,
        last_name,
        email,
        gender,
        age,
        role,
        cart
    }
    return newUser
}