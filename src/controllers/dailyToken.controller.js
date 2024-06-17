const DailyToken = require('../models/dailyToken.model');
const { logger } = require('../utils/logger');

exports.getAllDailyTokens = (req, res) => {
    DailyToken.getAll((err, data) => {
        if (err) {
            res.status(500).send({
                status: 'error',
                message: err.message
            });
            return;
        }
        res.status(200).send({
            status: 'success',
            data
        });
    });
};

exports.createDailyToken = (req, res) => {
    const { letterId, quantity, price, date } = req.body;
    const newDailyToken = new DailyToken(letterId, quantity, price, date);

    DailyToken.create(newDailyToken, (err, data) => {
        if (err) {
            res.status(500).send({
                status: "error",
                message: err.message
            });
            return;
        }
        res.status(201).send({
            status: "success",
            data
        });
    });
};

exports.getDailyTokenById = (req, res) => {
    const { id } = req.params;

    DailyToken.findById(id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    status: 'error',
                    message: `Daily Token with id ${id} not found`
                });
                return;
            }
            res.status(500).send({
                status: 'error',
                message: err.message
            });
            return;
        }
        res.status(200).send({
            status: 'success',
            data
        });
    });
};

exports.updateDailyToken = (req, res) => {
    const { id } = req.params;
    const { letterId, quantity, price, date } = req.body;

    const updatedDailyToken = new DailyToken(letterId, quantity, price, date);

    DailyToken.update(id, updatedDailyToken, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    status: 'error',
                    message: `Daily Token with id ${id} not found`
                });
                return;
            }
            res.status(500).send({
                status: 'error',
                message: err.message
            });
            return;
        }
        res.status(200).send({
            status: 'success',
            data
        });
    });
};

exports.deleteDailyToken = (req, res) => {
    const { id } = req.params;

    DailyToken.delete(id, (err, _) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    status: 'error',
                    message: `Daily Token with id ${id} not found`
                });
                return;
            }
            res.status(500).send({
                status: 'error',
                message: err.message
            });
            return;
        }
        res.status(200).send({
            status: 'success',
            message: 'Daily Token deleted successfully'
        });
    });
};

exports.getDailyTokensByDate = (req, res) => {
    const { date } = req.params;

    DailyToken.findByDate(date, (err, data) => {
        if (err) {
            res.status(500).send({
                status: 'error',
                message: err.message
            });
            return;
        }
        res.status(200).send({
            status: 'success',
            data
        });
    });
};

exports.getAvailableDailyTokensByDate = (req, res) => {
    const { date } = req.params;
    DailyToken.findAvailableByDate(date, (err, data) => {
        if (err) {
            res.status(500).send({
                status: 'error',
                message: err.message
            });
            return;
        }
        res.status(200).send({
            status: 'success',
            data
        });
    });
};

exports.updateDailyTokenList = (req, res) => {
    const { date, tokens } = req.body;
    console.log(req.body)
    DailyToken.findAvailableByDate(date, (err, data) => {
        if (err) {
            res.status(500).send({
                status: 'error',
                message: err.message
            });
            return;
        }
        res.status(200).send({
            status: 'success',
            data
        });
    });
};
