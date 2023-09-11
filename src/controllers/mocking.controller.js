import { generateProduct } from "../utils/faker.js"

export const mockingProds = async(req,res) => {
    let prods = []
    for(let i=0;i<100;i++){
        prods.push(generateProduct())
    }
    res.send({status:"success",payload:prods})
}