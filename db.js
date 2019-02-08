const mysql = require('mysql');
const config = require('./config/database');

let pool = null;

exports.connect = function (done) {
    pool = mysql.createConnection({
        host: config.host,
        user: config.user,
        password: config.secret,
        database: config.database
    });
    done()
};

exports.get = function () {
    return pool
};