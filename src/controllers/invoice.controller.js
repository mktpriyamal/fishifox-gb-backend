const Invoice = require('../models/invoice.model');
const { logger } = require('../utils/logger');

exports.getAllInvoices = (req, res) => {
    Invoice.getAll((err, data) => {
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

exports.createInvoice = (req, res) => {
    const { userId, mobileNumber, name, invoiceTokens } = req.body;
    const newInvoice = new Invoice(userId, mobileNumber, name, invoiceTokens);

    Invoice.create(newInvoice, (err, data) => {
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

exports.getInvoiceById = (req, res) => {
    const { id } = req.params;

    Invoice.findById(id, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    status: 'error',
                    message: `Invoice with id ${id} not found`
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

exports.updateInvoice = (req, res) => {
    const { id } = req.params;
    const { userId, mobileNumber, name, invoiceTokens } = req.body;

    const updatedInvoice = new Invoice(userId, mobileNumber, name, invoiceTokens);

    Invoice.update(id, updatedInvoice, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    status: 'error',
                    message: `Invoice with id ${id} not found`
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

exports.deleteInvoice = (req, res) => {
    const { id } = req.params;

    Invoice.delete(id, (err, _) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    status: 'error',
                    message: `Invoice with id ${id} not found`
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
            message: 'Invoice deleted successfully'
        });
    });
};
