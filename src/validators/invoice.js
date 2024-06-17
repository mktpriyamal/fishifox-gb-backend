const Joi = require('joi');
const validatorHandler = require('../middlewares/validatorHandler');

const createInvoiceValidator = (req, res, next) => {
    const schema = Joi.object({
        userId: Joi.number().integer().required(),
        mobileNumber: Joi.string().trim().min(10).max(12).required(),
        name: Joi.string().trim().min(5).max(50).required(),
        invoiceTokens: Joi.array().items(Joi.object({
            tokenId: Joi.number().integer().required(),
            quantity: Joi.number().integer().required()
        })).required()
    });
    validatorHandler(req, res, next, schema);
};

const updateInvoiceValidator = (req, res, next) => {
    const schema = Joi.object().keys({
        userId: Joi.number().integer().required(),
        mobileNumber: Joi.string().trim().min(10).max(12).required(),
        name: Joi.string().trim().max(50).required(),
        invoiceTokens: Joi.array().items(
            Joi.object().keys({
                tokenId: Joi.number().integer().required(),
                quantity: Joi.number().integer().required()
            })
        ).required()
    });
    validatorHandler(req, res, next, schema);
};

module.exports = {
    createInvoiceValidator,
    updateInvoiceValidator
};
