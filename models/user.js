const db = require('../db');

exports.create = function (name, email, username, password, done) {
    let values = [name, email, username, password];

    db.get().query('INSERT INTO users (name, email, username, password) VALUES (?,?,?,?)', values, function (err, result) {
        if (err) return done(err);
        done(null, result.insertId);
    })
};

exports.getAll = function (done) {
    db.get().query('SELECT * FROM users', function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    })
};

exports.findById = function (id, done) {
    db.get().query('SELECT * FROM users WHERE user_id=?', id, function (err, user) {
        if (err) return done(err);
        done(null, user['0']);
    });
};

exports.findByUsername = function (username, done) {
    db.get().query('SELECT * FROM users WHERE username=?', username, function (err, user) {
        if (err) return done(err);
        done(null, user['0']);
    });
};