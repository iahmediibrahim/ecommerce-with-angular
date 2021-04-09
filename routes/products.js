const express = require('express');
const router = express.Router();
const { database } = require('../config/helpers');

/* GET all products. */
router.get('/', (req, res) => {
    // set the current page number
    let page = req.query.page !== undefined && req.query.page !== 0 ? req.query.page : 1;
    // set the limit of items per page
    const limit = req.query.limit !== undefined && req.query.limit !== 0 ? req.query.limit : 10;
    let startValue;
    let endValue;
    if (page > 0) {
        startValue = page * limit - limit; // 0, 10, 20, 30
        endValue = page * limit;
    } else {
        startValue = 0;
        endValue = 10;
    }
    database
        .table('products as p')
        .join([ { table: 'categories as c', on: 'c.id = p.cat_id' } ])
        .withFields([ 'c.title as category', 'p.title as name', 'p.price', 'p.quantity', 'p.image', 'p.id' ])
        .slice(startValue, endValue)
        .sort({ id: 0.1 })
        .getAll()
        .then((products) => {
            if (products.length > 0) {
                res.status(200).json({
                    count: products.length,
                    products,
                });
            } else {
                res.json({ message: 'No products found!' });
            }
        })
        .catch((err) => console.log(err));
});

/* GET single product. */

router.get('/:productId', (req, res) => {
    let productId = req.params.productId;
    console.log(productId);
    database
        .table('products as p')
        .join([ { table: 'categories as c', on: 'c.id = p.cat_id' } ])
        .withFields([
            'c.title as category',
            'p.title as name',
            'p.price',
            'p.quantity',
            'p.image',
            'p.images',
            'p.id',
        ])
        .filter({ 'p.id': productId })
        .get()
        .then((product) => {
            if (product) {
                res.status(200).json(product);
            } else {
                res.json({ message: `No product found with product ID: ${productId}` });
            }
        })
        .catch((err) => console.log(err));
});

/* GET All PRODUCTS from one particular category */

router.get('/category/:categoryName', (req, res) => {
    let categoryName = req.params.categoryName;
    // set the current page number
    let page = req.query.page !== undefined && req.query.page !== 0 ? req.query.page : 1;
    // set the limit of items per page
    const limit = req.query.limit !== undefined && req.query.limit !== 0 ? req.query.limit : 10;
    let startValue;
    let endValue;
    if (page > 0) {
        startValue = page * limit - limit; // 0, 10, 20, 30
        endValue = page * limit;
    } else {
        startValue = 0;
        endValue = 10;
    }
    database
        .table('products as p')
        .join([ { table: 'categories as c', on: `c.id = p.cat_id WHERE c.title LIKE '%${categoryName}%'` } ])
        .withFields([ 'c.title as category', 'p.title as name', 'p.price', 'p.quantity', 'p.image', 'p.id' ])
        .slice(startValue, endValue)
        .sort({ id: 0.1 })
        .getAll()
        .then((products) => {
            if (products.length > 0) {
                res.status(200).json({
                    count: products.length,
                    products,
                });
            } else {
                res.json({ message: `No products found from ${categoryName} category.` });
            }
        })
        .catch((err) => console.log(err));
});
module.exports = router;
