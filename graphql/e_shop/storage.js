const faker = require('faker');

const categories = [];
const sellers = [];
const customers = [];
const products = [];
const orders = [];

const generate = () => {
    categories.push(...Array.from({length: 10}, (v, k) => ({
        id: k,
        name: `${faker.commerce.productMaterial()} ${faker.random.word()}`,
    })));

    sellers.push(...Array.from({length: 20}, (v, k) => ({
        id: k,
        name: faker.company.companyName(),
    })));

    customers.push(...Array.from({length: 20}, (v, k) => ({
        id: k,
        name: faker.name.findName(),
        dateOfBirth: faker.date.past(50).toISOString(),
    })));

    products.push(...Array.from({length: 200}, (v, k) => ({
        id: k,
        name: faker.commerce.product(),
        description: faker.commerce.productName(),
        category: categories[faker.random.number({'min': 0, 'max': categories.length - 1})],
        seller: sellers[faker.random.number({'min': 0, 'max': sellers.length - 1})]
    })));

    console.log("Data was generated");
}

generate();

module.exports = {customers, categories, products, sellers, orders}