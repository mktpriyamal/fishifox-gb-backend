
const validatorHandler = (req, res, next, schema) => {
    const { error } = schema.validate(req.body);

    if (error) {
       const errorMessage = error.details.map(detail => detail.message).join(', ');
       res.status(400).json({
            status: 'error',
            message: errorMessage.replace('/[^a-zA-Z0-9 ]/g', '')
        });
        return;
    }
    next();
};

module.exports = validatorHandler;