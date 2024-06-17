const db = require('../config/db.config');
const {
    createInvoice: createNewInvoiceQuery,
    findInvoiceById: findInvoiceByIdQuery,
    updateInvoice: updateInvoiceQuery,
    deleteInvoice: deleteInvoiceQuery,
    createInvoiceToken: createInvoiceTokenQuery,
    removeInvoiceToken: removeInvoiceTokenQuery,
    getAllInvoicesQuery: getAllInvoicesQuery
} = require('../database/queries');
const { logger } = require('../utils/logger');

class Invoice {
    constructor(userId, mobileNumber, name, invoiceTokens = []) {
        this.userId = userId;
        this.mobileNumber = mobileNumber;
        this.name = name;
        this.invoiceTokens = invoiceTokens;
    }

    static getAll(cb) {
        db.query(getAllInvoicesQuery, (err, res) => {
            if (err) {
                logger.error(err.message);
                cb(err, null);
                return;
            }
            const invoicesMap = new Map();

            res.forEach(invoiceData => {
                const invoiceId = invoiceData.ID;

                if (!invoicesMap.has(invoiceId)) {
                    // Create new invoice object if not already in the map
                    const newInvoice = new Invoice(
                        invoiceData.USER_ID,
                        invoiceData.MOBILE_NUMBER,
                        invoiceData.NAME
                    );
                    newInvoice.id = invoiceId;
                    newInvoice.invoiceTokens = [];
                    invoicesMap.set(invoiceId, newInvoice);
                }

                // Add token to the corresponding invoice in the map
                const invoice = invoicesMap.get(invoiceId);
                invoice.invoiceTokens.push({
                    tokenId: invoiceData.TOKEN_ID,
                    quantity: invoiceData.QUANTITY
                });
            });

            // Convert map values (invoices) to array and pass to callback
            const invoices = Array.from(invoicesMap.values());
            cb(null, invoices);
        });
    }

    static create(newInvoice, cb) {
        db.beginTransaction((err) => {
            if (err) {
                logger.error(err.message);
                cb(err, null);
                return;
            }
            db.query(createNewInvoiceQuery, [newInvoice.userId, newInvoice.mobileNumber, newInvoice.name], (err, res) => {
                if (err) {
                    db.rollback(() => {
                        logger.error(err.message);
                        cb(err, null);
                    });
                    return;
                }
                const invoiceId = res.insertId;
                const tokenData = newInvoice.invoiceTokens.flatMap(token => [invoiceId, token.tokenId, token.quantity]);
                db.query(createInvoiceTokenQuery, tokenData, (err, _) => {
                    if (err) {
                        db.rollback(() => {
                            logger.error(err.message);
                            cb(err, null);
                        });
                        return;
                    }
                    db.commit((err) => {
                        if (err) {
                            db.rollback(() => {
                                logger.error(err.message);
                                cb(err, null);
                            });
                            return;
                        }
                        cb(null, { id: invoiceId, ...newInvoice });
                    });
                });
            });
        });
    }

    static findById(id, cb) {
        db.query(findInvoiceByIdQuery, id, (err, res) => {
            if (err) {
                logger.error(err.message);
                cb(err, null);
                return;
            }
            if (res.length) {
                const invoiceData = res[0];
                const invoice = new Invoice(invoiceData.user_id, invoiceData.mobile_number, invoiceData.name);
                invoice.id = invoiceData.id;
                cb(null, invoice);
                return;
            }
            cb({ kind: "not_found" }, null);
        });
    }

    static update(id, updatedInvoice, cb) {
        db.query(updateInvoiceQuery, [updatedInvoice.userId, updatedInvoice.mobileNumber, updatedInvoice.name, id], (err, res) => {
            if (err) {
                logger.error(err.message);
                cb(err, null);
                return;
            }
            cb(null, { id: id, ...updatedInvoice });
        });
    }

    static delete(id, cb) {
        db.beginTransaction((err) => {
            if (err) {
                logger.error(err.message);
                cb(err, null);
                return;
            }
            db.query(deleteInvoiceQuery, id, (err, res) => {
                if (err) {
                    db.rollback(() => {
                        logger.error(err.message);
                        cb(err, null);
                    });
                    return;
                }
                db.query(removeInvoiceTokenQuery, id, (err, _) => {
                    if (err) {
                        db.rollback(() => {
                            logger.error(err.message);
                            cb(err, null);
                        });
                        return;
                    }
                    db.commit((err) => {
                        if (err) {
                            db.rollback(() => {
                                logger.error(err.message);
                                cb(err, null);
                            });
                            return;
                        }
                        cb(null, res);
                    });
                });
            });
        });
    }
}

module.exports = Invoice;
