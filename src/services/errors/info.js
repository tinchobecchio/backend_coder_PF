// esto es el cause
export const generateProductErrorInfo = (prod) => {
    return `One or more properties were incomplete or not valid.
    List of required properties:
    * title : needs to be a String, received ${typeof prod.title},
    * description : needs to be a String, received ${typeof prod.description},
    * code : needs to be a String, received ${typeof prod.code},
    * price : needs to be a Number, received ${typeof prod.price},
    * category : needs to be a String, received ${typeof prod.category},
    * stock : needs to be a Number, received ${typeof prod.stock},
    * thumbnails : needs to be an Array object, received ${typeof prod.thumbnails}
    `
}
