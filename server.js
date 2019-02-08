const app = require('./app');
const db = require('./db');


db.connect(function (err) {
    if (err) {
        console.log(`Connection error: ${err.message}`);
    } else {
        console.log(`MySQL connection open on ${db.get().config.host}:${db.get().config.port} to database: ${db.get().config.database}`);
    }
});

const server = app.listen(3000, () => {
    console.log(`Express is running on the port ${server.address().port}`)
});