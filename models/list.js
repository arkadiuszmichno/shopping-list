const db = require('../db');

exports.create = function (name, userId, done) {
    let values = [name, userId, false];
    db.get().query('INSERT INTO lists (name, user_id, deleted) VALUES (?, ?, ?)', values, function (err, result) {
        if (err) return done(err);
        done(null, result.insertId);
    })
};

exports.getAll = function (userId, done) {
    db.get().query('SELECT * FROM lists WHERE deleted=false and user_id=?', userId, function (err, rows) {
        if (err) return done(err);
        done(null, rows);
    })
};

exports.getList = function (listId, userId, done) {
    db.get().query('SELECT * FROM lists WHERE list_id=? and deleted=false and user_id=?', listId, userId, function (err, list) {
        if (err) return done(err);
        done(null, list['0']);
    })
};

exports.updateList = function (listId, name, done) {
    db.get().query('UPDATE lists SET name=? WHERE list_id=? and deleted=false', name, listId, function (err, list) {
        if (err) return done(err);
        done(null, list['0']);
    })
};

exports.deleteList = function (listId, done) {
    db.get().query('UPDATE lists SET deleted=true WHERE list_id=?', listId, function (err) {
        if (err) return done(err);
        done(null);
    })
};

