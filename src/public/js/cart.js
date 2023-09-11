const deleteFromCart = (cid,pid) => {
    const URL = `http://localhost:4000/api/carts/${cid}/products/${pid}`
    // console.log(URL);
    fetch(URL, {
        method: 'DELETE'
    }).then(response => response.json())
    .then(setTimeout(() => location.reload(), 1000))
}


const resetCart = (cid) => {
    const URL = `http://localhost:4000/api/carts/${cid}`
    // console.log(URL);
    fetch(URL, {
        method: 'DELETE'
    }).then(response => response.json())
    .then(setTimeout(() => location.reload(), 1500))
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