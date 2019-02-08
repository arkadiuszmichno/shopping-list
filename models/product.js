const db = require('../db');

exports.create = function (name, amount, listId, done) {
    let values = [name, amount, listId, false];
    db.get().query('INSERT INTO products (name, amount, list_id, deleted) VALUES (?, ?, ?, ?)', values, function (err, result) {
        if (err) return done(err);
        done(null, result.insertId);
    })
};

exports.getAll = function (listId, done) {
    db.get().query('SELECT * FROM products WHERE list_id=? and deleted=false', listId, function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    })
};

exports.getProduct = function (productId, done) {
    db.get().query('SELECT * FROM products WHERE product_id=? and deleted=false', productId, function (err, product) {
        if (err) return done(err);
        done(null, product['0']);
    })
};

exports.updateProduct = function (productId, name, description, amount, done) {
    let values = [name, description, amount, productId];
    db.get().query('UPDATE products SET name=?, description=?, amount=? WHERE product_id=? and deleted=false', values, function (err, product) {
        if (err) return done(err);
        done(null, product['0']);
    })
};

exports.updateBought = function (productId, done) {
    db.get().query('UPDATE products SET bought = NOT bought WHERE product_id=?', productId, function (err, product) {
        if (err) return done(err);
        done(null, product['0'])
    })
};

exports.deleteProduct = function (productId, done) {
    db.get().query('UPDATE products SET deleted=true WHERE product_id=?', productId, function (err) {
        if (err) return done(err);
        done(null);
    })
};

