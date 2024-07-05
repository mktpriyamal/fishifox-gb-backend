const mysql = require('mysql');
const { logger } = require('../utils/logger');
const { DB_HOST, DB_USER, DB_PASS, DB_NAME } = require('../utils/secrets');

const pool = mysql.createPool({
    connectionLimit: 10,  // Adjust based on your needs
    host: DB_HOST,
    user: DB_USER,
    password: DB_PASS,
    database: DB_NAME
});

// Promisified query method
pool.queryPromise = (sql, args) => {
    return new Promise((resolve, reject) => {
        pool.query(sql, args, (err, results) => {
            if (err) {
                logger.error(err.message);
                return reject(err);
            }
            resolve(results);
        });
    });
};

// Promisified getConnection method to handle transactions
pool.getConnectionPromise = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                logger.error(err.message);
                return reject(err);
            }
            resolve(connection);
        });
    });
};

// Promisified beginTransaction method
pool.beginTransactionPromise = (connection) => {
    return new Promise((resolve, reject) => {
        connection.beginTransaction((err) => {
            if (err) {
                logger.error(err.message);
                connection.release();  // Release the connection back to the pool
                return reject(err);
            }
            resolve();
        });
    });
};

// Promisified commit method
pool.commitPromise = (connection) => {
    return new Promise((resolve, reject) => {
        connection.commit((err) => {
            if (err) {
                logger.error(err.message);
                pool.rollbackPromise(connection)  // Rollback if commit fails
                    .then(() => connection.release());
                return reject(err);
            }
            connection.release();
            resolve();
        });
    });
};

// Promisified rollback method
pool.rollbackPromise = (connection) => {
    return new Promise((resolve) => {
        connection.rollback(() => {
            connection.release();  // Release the connection back to the pool
            resolve();
        });
    });
};

module.exports = pool;
