const Letter = require('../models/letter.model');
const { logger } = require('../utils/logger');

exports.getAllLetters = (req, res) => {
    Letter.getAll((err, data) => {
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

exports.createLetter = (req, res) => {
    const { letter } = req.body;
    const newLetter = new Letter(letter.trim());

    Letter.create(newLetter, (err, data) => {
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

exports.getLetterById = (req, res) => {
    const { id } = req.params;

    Letter.findById(id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    status: 'error',
                    message: `Letter with id ${id} not found`
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

exports.updateLetter = (req, res) => {
    const { id } = req.params;
    const { letter } = req.body;

    const updatedLetter = new Letter(letter.trim());

    Letter.update(id, updatedLetter, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    status: 'error',
                    message: `Letter with id ${id} not found`
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

exports.deleteLetter = (req, res) => {
    const { id } = req.params;

    Letter.delete(id, (err, _) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    status: 'error',
                    message: `Letter with id ${id} not found`
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
            message: 'Letter deleted successfully'
        });
    });
};
