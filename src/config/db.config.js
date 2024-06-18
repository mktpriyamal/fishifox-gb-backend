const mysql = require('mysql');
const { logger } = require('../utils/logger');
const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = require('../utils/secrets');

const connection = mysql.createConnection({
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME
});

connection.connect((err) => {
    if (err) {
        logger.error(err.message);
    } else {
        logger.info('Database connected');
    }
});

// Promisified query method
connection.queryPromise = (sql, args) => {
    return new Promise((resolve, reject) => {
        connection.query(sql, args, (err, results) => {
            if (err) {
                logger.error(err.message);
                return reject(err);
            }
            resolve(results);
        });
    });
};

// Promisified beginTransaction method
connection.beginTransactionPromise = () => {
    return new Promise((resolve, reject) => {
        connection.beginTransaction((err) => {
            if (err) {
                logger.error(err.message);
                return reject(err);
            }
            resolve();
        });
    });
};

// Promisified commit method
connection.commitPromise = () => {
    return new Promise((resolve, reject) => {
        connection.commit((err) => {
            if (err) {
                logger.error(err.message);
                return reject(err);
            }
            resolve();
        });
    });
};

// Promisified rollback method
connection.rollbackPromise = () => {
    return new Promise((resolve) => {
        connection.rollback(() => {
            resolve();
        });
    });
};

module.exports = connection;
