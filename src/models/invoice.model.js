const db = require('../config/db.config');
const {
    createInvoice: createNewInvoiceQuery,
    findInvoiceById: findInvoiceByIdQuery,
    updateInvoice: updateInvoiceQuery,
    deleteInvoice: deleteInvoiceQuery,
    createInvoiceToken: createInvoiceTokenQuery,
    removeInvoiceToken: removeInvoiceTokenQuery,
    getAllInvoiceTokens: getAllInvoiceTokensQuery,
    getAllInvoicesQuery: getAllInvoicesQuery,
    findAvailableTokensMinDataByDate: findAvailableTokensMinDataByDateQuery,
    getAllInvoicesByDate: getAllInvoicesByDateQuery,
    getAllInvoiceTokensByDate: getAllInvoiceTokensByDateQuery
} = require('../database/queries');
const { logger } = require('../utils/logger');
const { Mutex } = require('async-mutex');

// Create a mutex instance
const createInvoiceMutex = new Mutex();

class Invoice {
    constructor(id, userId, agent, mobileNumber, name, invoiceTokens = [], createdAt) {
        this.id = id;
        this.userId = userId;
        this.agent = agent;
        this.mobileNumber = mobileNumber;
        this.name = name;
        this.invoiceTokens = invoiceTokens;
        this.createdAt = createdAt;
    }

    static async getAll(cb) {
        try {
            const invoiceResults = await db.queryPromise(getAllInvoicesQuery);
            const invoiceTokenResults = await db.queryPromise(getAllInvoiceTokensQuery);
            const invoices = [];
            invoiceResults.forEach(invoiceData => {
                const invoice = new Invoice(
                    invoiceData['ID'],
                    invoiceData['USER_ID'],
                    invoiceData['FIRST_NAME'],
                    invoiceData['MOBILE_NUMBER'],
                    invoiceData['NAME'],
                    [],
                    invoiceData['CREATED_AT']
                );
                let filteredTokens = invoiceTokenResults.filter(invoiceToken => invoiceToken['INVOICE_ID'] === invoiceData['ID']);
                filteredTokens.forEach(invoiceToken => {
                    invoice.invoiceTokens.push({
                        id: invoiceToken.ID,
                        invoiceId: invoiceToken['INVOICE_ID'],
                        tokenId: invoiceToken['TOKEN_ID'],
                        letter: invoiceToken['LETTER'],
                        quantity: invoiceToken['QUANTITY'],
                        price: invoiceToken['PRICE'],
                    });
                });
                invoices.push(invoice);
            });
            cb(null, invoices);
        } catch (err) {
            logger.error(err.message);
            cb(err, null);
        }
    }

    static async create(newInvoice, cb) {
        const release = await createInvoiceMutex.acquire();
        try {
            const formattedDate = Invoice.getCurrentDateFormatted();
            const connection = await db.getConnectionPromise();
            await db.beginTransactionPromise(connection);
            const availableTokens = await db.queryPromise(findAvailableTokensMinDataByDateQuery, [formattedDate]);
            const allIdsContained = newInvoice.invoiceTokens.every(token =>
                availableTokens.some(result => result['LETTER'] === token.letter && result['AQ'] >= token.quantity)
            );
            if (!allIdsContained) {
                throw new Error('Some Letters are not available!');
            }
            const invoiceResult = await db.queryPromise(createNewInvoiceQuery, [newInvoice.userId, newInvoice.mobileNumber, newInvoice.name]);
            const invoiceId = invoiceResult.insertId;

            for (const invoiceToken of newInvoice.invoiceTokens) {
                await db.queryPromise(createInvoiceTokenQuery, [invoiceId, invoiceToken.tokenId, invoiceToken.quantity]);
            }

            await db.commitPromise(connection);
            cb(null, { id: invoiceId, ...newInvoice });
        } catch (err) {
            await db.rollbackPromise();
            logger.error(err.message);
            cb(err, null);
        } finally {
            release(); // Release the mutex
        }
    }

    static async findById(id, cb) {
        try {
            const res = await db.queryPromise(findInvoiceByIdQuery, id);
            if (res.length) {
                const invoiceData = res[0];
                const invoice = new Invoice(invoiceData.user_id, invoiceData.first_name, invoiceData.mobile_number, invoiceData.name);
                invoice.id = invoiceData.id;
                cb(null, invoice);
                return;
            }
            cb({ kind: "not_found" }, null);
        } catch (err) {
            logger.error(err.message);
            cb(err, null);
        }
    }

    static async update(id, updatedInvoice, cb) {
        try {
            await db.queryPromise(updateInvoiceQuery, [updatedInvoice.userId, updatedInvoice.mobileNumber, updatedInvoice.name, id]);
            cb(null, { id, ...updatedInvoice });
        } catch (err) {
            logger.error(err.message);
            cb(err, null);
        }
    }

    static async delete(id, cb) {
        try {
            const connection = await db.getConnectionPromise();
            await db.beginTransactionPromise(connection);
            await db.queryPromise(deleteInvoiceQuery, id);
            await db.queryPromise(removeInvoiceTokenQuery, id);
            await db.commitPromise(connection);
            cb(null, { message: 'Invoice deleted successfully!' });
        } catch (err) {
            await db.rollbackPromise();
            logger.error(err.message);
            cb(err, null);
        }
    }

    static async findAllByDate(date, cb) {
        try {
            const invoiceResults = await db.queryPromise(getAllInvoicesByDateQuery, [date]);
            const invoiceTokenResults = await db.queryPromise(getAllInvoiceTokensByDateQuery, [date]);
            const invoices = [];
            invoiceResults.forEach(invoiceData => {
                const invoice = new Invoice(
                    invoiceData['ID'],
                    invoiceData['USER_ID'],
                    invoiceData['FIRST_NAME'],
                    invoiceData['MOBILE_NUMBER'],
                    invoiceData['NAME'],
                    [],
                    invoiceData['CREATED_AT']
                );
                let filteredTokens = invoiceTokenResults.filter(invoiceToken => invoiceToken['INVOICE_ID'] === invoiceData['ID']);
                filteredTokens.forEach(invoiceToken => {
                    invoice.invoiceTokens.push({
                        id: invoiceToken.ID,
                        invoiceId: invoiceToken['INVOICE_ID'],
                        tokenId: invoiceToken['TOKEN_ID'],
                        letter: invoiceToken['LETTER'],
                        quantity: invoiceToken['QUANTITY'],
                        price: invoiceToken['PRICE'],
                    });
                });
                invoices.push(invoice);
            });
            cb(null, invoices);
        } catch (err) {
            logger.error(err.message);
            cb(err, null);
        }
    }

    static getCurrentDateFormatted() {
        const today = new Date();
        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, '0');
        const day = String(today.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }
}

module.exports = Invoice;
