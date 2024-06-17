const { logger } = require('../../utils/logger');
const {
    createTableUsers: createTableUsersQuery,
    createTableLetters: createTableLettersQuery,
    createTableDailyToken: createTableDailyTokenQuery,
    createTableInvoice: createTableInvoiceQuery,
    createTableInvoiceToken: createTableInvoiceTokenQuery,
    addForeignKeyLetters: addForeignKeyLettersQuery,
    addForeignKeyUsers: addForeignKeyUsersQuery,
    addForeignKeyInvoice: addForeignKeyInvoiceQuery,
    addForeignKeyDailyToken: addForeignKeyDailyTokenQuery
} = require('../queries');

const db = require('../../config/db.config');

// Helper function to create tables and log results
const createTable = (query, tableName) => {
    db.query(query, (err, _) => {
        if (err) {
            logger.error(`Failed to create table ${tableName}: ${err.message}`);
            return;
        }
        logger.info(`Table ${tableName} created!`);
    });
};

// Helper function to add foreign keys and log results
const addForeignKey = (query, foreignKeyName) => {
    db.query(query, (err, _) => {
        if (err) {
            logger.error(`Failed to add foreign key ${foreignKeyName}: ${err.message}`);
            return;
        }
        logger.info(`Foreign key ${foreignKeyName} added!`);
    });
};

(() => {
    createTable(createTableUsersQuery, 'USERS');
    createTable(createTableLettersQuery, 'LETTERS');
    createTable(createTableDailyTokenQuery, 'DAILY_TOKEN');
    createTable(createTableInvoiceQuery, 'INVOICE');
    createTable(createTableInvoiceTokenQuery, 'INVOICE_TOKEN');

    // Delay adding foreign keys to ensure tables are created first
    setTimeout(() => {
        addForeignKey(addForeignKeyLettersQuery, 'LETTERS');
        addForeignKey(addForeignKeyUsersQuery, 'USERS');
        addForeignKey(addForeignKeyInvoiceQuery, 'INVOICE');
        addForeignKey(addForeignKeyDailyTokenQuery, 'DAILY_TOKEN');

        // Exit the process after all queries are executed
        setTimeout(() => process.exit(0), 1000);
    }, 1000);
})();
