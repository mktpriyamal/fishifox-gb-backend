const Joi = require('joi');
const validatorHandler = require('../middlewares/validatorHandler');

const create = (req, res, next) => {
    const schema = Joi.object().keys({
        letter: Joi.string()
            .trim()
            .alphanum()
            .min(1)
            .max(3)
            .required(),
    });
    validatorHandler(req, res, next, schema);
};
const update = (req, res, next) => {
    const schema = Joi.object().keys({
        id: Joi.number()
            .min(1)
            .max(10)
            .required(),
        letter: Joi.string()
            .trim()
            .alphanum()
            .min(1)
            .max(3)
            .required(),
    });
    validatorHandler(req, res, next, schema);
};

module.exports = {
    create,
    update
};