const Joi = require('joi');
const validatorHandler = require('../middlewares/validatorHandler');

const createDailyToken = (req, res, next) => {
    const schema = Joi.object().keys({
        letterId: Joi.number().integer().required(),
        quantity: Joi.number().integer().required(),
        price: Joi.number().required(),
        date: Joi.date().iso().required()
    });
    validatorHandler(req, res, next, schema);
};

const updateDailyToken = (req, res, next) => {
    const schema = Joi.object().keys({
        letterId: Joi.number().integer().optional(),
        quantity: Joi.number().integer().optional(),
        price: Joi.number().optional(),
        date: Joi.date().iso().optional()
    });
    validatorHandler(req, res, next, schema);
};

module.exports = {
    create: createDailyToken,
    update: updateDailyToken
};
