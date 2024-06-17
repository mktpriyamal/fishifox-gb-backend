const router = require('express').Router();
const { asyncHandler } = require('../middlewares/asyncHandler');
const { createInvoiceValidator } = require('../validators/invoice');
const invoiceController = require('../controllers/invoice.controller');

router.route('/')
    .post(createInvoiceValidator, asyncHandler(invoiceController.createInvoice))
    .get(asyncHandler(invoiceController.getAllInvoices)); // Add this route for getAll

router.route('/:id')
    .get(asyncHandler(invoiceController.getInvoiceById))
    .put(asyncHandler(invoiceController.updateInvoice))
    .delete(asyncHandler(invoiceController.deleteInvoice));

module.exports = router;
