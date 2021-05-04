const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const swaggerUI = require('swagger-ui-express');
// const swaggerJSDoc = require('swagger-jsdoc');
const options = {
    swaggerOptions: {
        url: 'http://petstore.swagger.io/v2/swagger.json',
    },
};

const swaggerOptions = {
    swaggerDefinition: {
        info: {
            title: 'Shop API',
            description: 'Backend Api',
            contact: {
                name: 'Ahmed Ibrahim',
            },
            servers: 'http://localhost:3636',
        },
    },
    apis: [ 'app.js', '.routes/*.js' ],
};

// const swaggerDocs = swaggerJSDoc(swaggerOptions);

// import routes
const productsRouter = require('./routes/products');
const ordersRouter = require('./routes/orders');
const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const app = express();
app.use('/api/docs', swaggerUI.serve, swaggerUI.setup(null, options));

app.use(
    cors({
        origin: '*',
        methods: [ 'GET', 'POST', 'PATCH', 'DELETE', 'PUT' ],
        allowedHeaders: 'Content-Type, Authorization, origin, X-Requested-With, Accept',
    }),
);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
/**
 * @swagger
 * /api/products:
 *   get:
 *    description: Get All Products
 *
 */
// use routers
app.use('/api/products', productsRouter);
app.use('/api/orders', ordersRouter);
app.use('/api/auth', authRouter);
app.use('/api/users', usersRouter);

module.exports = app;
