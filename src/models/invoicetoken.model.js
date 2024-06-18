const db = require('../config/db.config');
const { createInvoiceToken: createInvoiceTokenQuery, findInvoiceTokenById: findInvoiceTokenByIdQuery } = require('../database/queries');
const { logger } = require('../utils/logger');

class InvoiceToken {
    constructor(id,invoiceId, tokenId,letter, quantity,price) {
        this.id = id;
        this.invoiceId = invoiceId;
        this.tokenId = tokenId;
        this.letter = letter;
        this.quantity = quantity;
        this.price = price;
    }
}

module.exports = InvoiceToken;
