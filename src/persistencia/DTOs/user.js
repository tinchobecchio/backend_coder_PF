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

export const getUserDTO2 = (user) => {
    // console.log(user);
    const {first_name, last_name, email, role, _id, last_connection } = user
    let newUser = {
        first_name,
        last_name,
        email,
        role,
        _id,
        last_connection
    }
    return newUser
}