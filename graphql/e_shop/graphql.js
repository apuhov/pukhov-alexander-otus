const { ApolloServer, gql } = require('apollo-server');
const {customers, categories, products, sellers, orders} = require('./storage');

const typeDefs = gql`    
    type Product {
        id: Int!
        name: String!
        description: String
        category: Category!
        seller: Seller!
    }
    type Category {
        id: Int!
        name: String!
    }
    input  OrderItemInput {
        productId: Int!
        quantity: Int!
        price: Float!
    }
    type  OrderItem {
        id: Int!
        product: Product!
        quantity: Int!
        price: Float!
    }
    type Order {
        id: Int!
        customer: Customer!
        items: [OrderItem]
        status: OrderStatus!
    }
    type Customer {
        id: Int!
        name: String!
        dateOfBirth: String
        orders: [Order]
    }
    type Seller {
       id: Int!
       name: String!   
       products: [Product]  
    }
    enum OrderStatus {
      NEW  
      PAID
      READY
      SHIPPED
      CLOSED
    }
    type Query {
        categories: [Category] 
        product(id: Int!): Product       
        seller(id: Int!): Seller
        customer(id: Int!): Customer
        products(sellerId: Int!): [Product],
        orders(customerId: Int!): [Order],
        orderCost(orderId: Int): Float
        searchProducts(text: String!): [Product]
    }
    type Mutation {
        updateCustomer(id: Int!, name: String, dateOfBirth: String): Customer
        updateProduct(id: Int!, name: String, description: String): Product
        changeProductCategory(productId: Int!, categoryId: Int!): Product
        createOrder(customerId: Int!, orderItems: [OrderItemInput]): Order
        changeOrderStatus(orderId: Int!, status: OrderStatus!): Order
    }`;

const getProductById = (id) => products.find(p => p.id === id);

const getSellerById = (id) => sellers.find(s => s.id === id);

const getOrderById = (id) => orders.find(o => o.id === id);

const getProductsBySellerId = (sellerId) => products.filter(p => p.seller.id === sellerId);

const getOrdersByCustomerId = (customerId) => orders.filter(o => o.customer.id === customerId);

const getCustomerById = (id) => customers.find(c => c.id === id);

const searchProductsByText = (text) => {
    let textLowerCase = text.toLowerCase();
    return products.filter(p => p.name.toLowerCase().includes(textLowerCase)
        || p.description.toLowerCase().includes(textLowerCase));
}

const calcOrderCost = (orderId) => getOrderById(orderId).items
    .reduce((a, b) => a + b.price * b.quantity, 0);

const updateProduct = (id, name, description) => {
    let product = getProductById(id);
    if (!product) {
        throw Error(`No product with id ${id}`);
    }
    if (name) product.name = name;
    if (description) product.description = description;
    return product;
}

const changeProductCategory = (productId, categoryId) => {
    let product = getProductById(productId);
    if (!product) {
        throw Error(`No product with id ${productId}`);
    }
    product.category = categories.find(c => c.id === categoryId);
    return product;
}

const updateCustomer = (id, name, dateOfBirth) => {
    let customer = getCustomerById(id);
    if (!customer) {
        throw Error(`No customer with id ${id}`);
    }
    if (name) customer.name = name;
    if (dateOfBirth) customer.dateOfBirth = dateOfBirth;
    return customer;
}

const createOrder = (orderInput) => {
    let items = orderInput.orderItems.map((item, idx) => {
        return {
            id: idx,
            product: getProductById(item.productId),
            quantity: item.quantity,
            price: item.price
        }
    });
    let newOrder = {
        id: orders.length + 1,
        customer: getCustomerById(orderInput.customerId),
        status: "NEW",
        items: items
    }
    orders.push(newOrder);
    return newOrder;
}

const changeOrderStatus = (orderId, status) => {
    let order = getOrderById(orderId);
    order.status = status;
    return order;
}

const resolvers = {
    Query: {
        categories: () => categories,
        product: (_, {id}) => getProductById(id),
        seller: (_, {id}) => getSellerById(id),
        customer: (_, {id}) => getCustomerById(id),
        products: (_, {sellerId}) => getProductsBySellerId(sellerId),
        orders: (_, {customerId}) => getOrdersByCustomerId(customerId),
        orderCost: (_, {orderId}) => calcOrderCost(orderId),
        searchProducts: (_, {text}) => searchProductsByText(text)
    },
    Mutation: {
        updateCustomer: (_, {id, name, dateOfBirth}) => updateCustomer(id, name, dateOfBirth),
        updateProduct: (_, args) => updateProduct(args.id, args.name, args.description),
        changeProductCategory: (_, {productId, categoryId}) => changeProductCategory(productId, categoryId),
        createOrder: (_, orderInput) => createOrder(orderInput),
        changeOrderStatus: (_, {orderId, status}) => changeOrderStatus(orderId, status)
    }
};

const server = new ApolloServer({typeDefs, resolvers});

server.listen({port: 8889}).then(({url}) => {
    console.log(`Server ready at ${url}`);
});