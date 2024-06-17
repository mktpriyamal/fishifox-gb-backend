const db = require('../config/db.config');
const { createInvoiceToken: createInvoiceTokenQuery, findInvoiceTokenById: findInvoiceTokenByIdQuery } = require('../database/queries');
const { logger } = require('../utils/logger');

class InvoiceToken {
    constructor(invoiceId, tokenId, quantity) {
        this.invoiceId = invoiceId;
        this.tokenId = tokenId;
        this.quantity = quantity;
    }

    static create(newInvoiceToken, cb) {
        db.query(createInvoiceTokenQuery,
            [
                newInvoiceToken.invoiceId,
                newInvoiceToken.tokenId,
                newInvoiceToken.quantity
            ], (err, res) => {
                if (err) {
                    logger.error(err.message);
                    cb(err, null);
                    return;
                }
                cb(null, {
                    id: res.insertId,
                    invoiceId: newInvoiceToken.invoiceId,
                    tokenId: newInvoiceToken.tokenId,
                    quantity: newInvoiceToken.quantity
                });
            });
    }

    static findById(id, cb) {
        db.query(findInvoiceTokenByIdQuery, id, (err, res) => {
            if (err) {
                logger.error(err.message);
                cb(err, null);
                return;
            }
            if (res.length) {
                cb(null, res[0]);
                return;
            }
            cb({ kind: "not_found" }, null);
        })
    }
}

module.exports = InvoiceToken;
