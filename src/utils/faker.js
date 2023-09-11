import {fakerES as faker} from '@faker-js/faker'

export const generateProduct = () => {
    return {
        _id: faker.database.mongodbObjectId(),
        title: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        code: faker.commerce.product(),
        price: faker.number.int(10000),
        category: faker.commerce.department(),
        stock: faker.number.int(1000),
        thumbnails: [faker.image.url()]
    }
}