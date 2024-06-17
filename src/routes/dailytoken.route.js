const router = require('express').Router();
const { asyncHandler } = require('../middlewares/asyncHandler');
const { create: createValidator, update: updateValidator } = require('../validators/dailytoken');
const dailyTokenController = require('../controllers/dailyToken.controller');

router.route('/')
    .post(createValidator, asyncHandler(dailyTokenController.createDailyToken))
    .get(asyncHandler(dailyTokenController.getAllDailyTokens));

router.route('/:id')
    .get(asyncHandler(dailyTokenController.getDailyTokenById))
    .put(updateValidator, asyncHandler(dailyTokenController.updateDailyToken))
    .delete(asyncHandler(dailyTokenController.deleteDailyToken));

// New route for getting daily tokens by date
router.route('/by-date/:date')
    .get(asyncHandler(dailyTokenController.getDailyTokensByDate))
    .post(createValidator,asyncHandler(dailyTokenController.updateDailyTokenList));
router.route('/available-by-date/:date')
    .get(asyncHandler(dailyTokenController.getAvailableDailyTokensByDate));

module.exports = router;
