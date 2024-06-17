const router = require('express').Router();
const { asyncHandler } = require('../middlewares/asyncHandler');
const { create: createValidator, update: updateValidator } = require('../validators/user');
const userController = require('../controllers/user.controller');

router.route('/:id')
    .get(asyncHandler(userController.getUserById))
    .put(updateValidator, asyncHandler(userController.updateUser))
    .delete(asyncHandler(userController.deleteUser));

module.exports = router;
