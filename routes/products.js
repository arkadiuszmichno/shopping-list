const express = require('express');

const products = require('../models/product');
const list = require('../models/list');
const router = express.Router({mergeParams: true});


router.post('/',
    ensureAuthenticated,
    (req, res) => {
        req.checkBody('name', 'Nazwa jest wymagana').notEmpty();
        req.checkBody('amount', 'Ilość jest wymagana').notEmpty();

        let errors = req.validationErrors();

        if (errors) {
            errors.forEach(error => {
                req.flash('error', error.msg);
            });
            res.redirect('/lists/' + req.params.listId + '/products')
        } else {
            products.create(req.body.name, req.body.amount, req.params.listId, function (err) {
                if (err) {
                    console.log("Error while sending list to db occurred" + err);
                } else {
                    console.log("Successfully saved list to db");
                    res.redirect('/lists/' + req.params.listId + '/products');
                }
            });
        }
    });
router.get('/', ensureAuthenticated, (req, res) => {
    let listId = req.params.listId;
    let unboughtProducts = [];
    let boughtProducts = [];
    let lists = [];
    let listName = '';
    list.getAll(req.user.user_id, function (err, rows) {
        if (err) {
            console.log("Error while getting lists from db");
        } else {
            lists = rows;
            lists.forEach(function (item) {
                if (item.list_id === parseInt(listId)) {
                    listName = item.name;
                }
            });

            products.getAll(listId, function f(err, rows) {
                if (err) {
                    res.send("Something gone wrong.")
                } else {
                    rows.forEach(function (product) {
                        if (product.bought === 0) {
                            unboughtProducts.push(product);
                        } else {
                            boughtProducts.push(product);
                        }
                    });
                    res.render('list', {lists, listName, listId, unboughtProducts, boughtProducts});
                }
            })
        }
    });
});

router.get('/:productId', ensureAuthenticated, (req, res) => {
    let productId = req.params.productId;
    products.getProduct(productId, function (err, product) {
        if (err) {
            res.send("Something gone wrong.")
        } else {
            res.render('update_product', {productId, product});
        }
    })
});

router.post('/:productId/delete', ensureAuthenticated, (req, res) => {
    let productId = req.params.productId;
    products.deleteProduct(productId, function (err) {
        if (err) {
            console.log('Error occurred while deleting product' + err);
            res.send("Something gone wrong.")
        } else {
            res.redirect('/lists/' + req.params.listId + '/products');
        }
    })
});

router.post('/:productId/update', ensureAuthenticated, (req, res) => {
    let productId = req.params.productId;
    products.updateProduct(productId, req.body.name, req.body.description, req.body.amount, function (err) {
        if (err) {
            console.log('Error occurred while updating product' + err);
            res.send("Something gone wrong.")
        } else {
            res.redirect('/lists/' + req.params.listId + '/products');
        }
    })
});
router.get('/:productId/bought', ensureAuthenticated, (req, res) => {
    let productId = req.params.productId;
    products.updateBought(productId, function (err) {
        if (err) {
            console.log('Error occured while updating bought ' + err);
            res.send("Something gone wrong.")
        } else {
            res.redirect('/lists/' + req.params.listId + '/products');
        }
    })
});

function ensureAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    } else {
        req.flash('danger', 'Musisz być zalogowany by mieć dostęp do tych zasobów');
        res.redirect('/users/login');
    }
}

module.exports = router;