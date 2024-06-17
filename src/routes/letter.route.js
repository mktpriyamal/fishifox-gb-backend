const router = require('express').Router();
const { asyncHandler } = require('../middlewares/asyncHandler');
const { create: createValidator, update: updateValidator } = require('../validators/letter');
const letterController = require('../controllers/letter.controller');

router.route('/')
    .post(createValidator, asyncHandler(letterController.createLetter))
    .get(asyncHandler(letterController.getAllLetters));

router.route('/:id')
    .get(asyncHandler(letterController.getLetterById))
    .put(updateValidator, asyncHandler(letterController.updateLetter))
    .delete(asyncHandler(letterController.deleteLetter));

module.exports = router;
