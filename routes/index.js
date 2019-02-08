const express = require('express');
const path = require('path');
const auth = require('http-auth');

const {body, validationResult} = require('express-validator/check');
const user = require('../models/user');

const router = express.Router();
const lists = require('./lists');
const products = require('./products');
const users = require('./users');

router.use('/lists', lists);
router.use('/lists/:listId/products', products);
router.use('/users', users);

const basic = auth.basic({
    file: path.join(__dirname, '../users.htpasswd'),
});

router.get('/', (req, res) => {
    res.render('form');
});

router.post('/',
    [
        body('name')
            .isLength({min: 1})
            .withMessage('Please enter a name'),
        body('email')
            .isLength({min: 1})
            .withMessage('Please enter an email'),
    ],
    (req, res) => {
        const errors = validationResult(req);

        if (errors.isEmpty()) {
            user.create(req.body.name, req.body.email, function (err) {
                if (err) {
                    console.log("Error while sending to db occurred");
                } else {
                    console.log("Successfully saved to db");
                }
            });
            res.send('Thank you fro your registration!');
        } else {
            res.render('form', {
                errors: errors.array(),
                data: req.body,
            });
        }
    });

router.get('/users', auth.connect(basic), (req, res) => {
    user.getAll(function (err, rows) {
        if (err) {
            res.send("Something went wrong.")
        } else {
            res.render('index', {rows});
        }
    })
});

module.exports = router;