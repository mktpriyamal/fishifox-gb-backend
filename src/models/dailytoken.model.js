const db = require('../config/db.config');
const {
    createNewDailyToken: createNewDailyTokenQuery,
    findDailyTokenById: findDailyTokenByIdQuery,
    updateDailyToken: updateDailyTokenQuery,
    deleteDailyToken: deleteDailyTokenQuery,
    findDailyTokensByDate: findDailyTokensByDateQuery, // Import the new query
    findAvailableTokensByDate: findAvailableTokensByDateQuery // Import the new query
} = require('../database/queries');
const { logger } = require('../utils/logger');

class DailyToken {
    constructor(letterId, quantity, price, date) {
        this.letterId = letterId;
        this.quantity = quantity;
        this.price = price;
        this.date = date;
    }

    static findByDate(date, cb) {
        db.query(findDailyTokensByDateQuery, date, (err, res) => {
            if (err) {
                logger.error(err.message);
                cb(err, null);
                return;
            }
            cb(null, res);
        });
    }

    static create(newDailyToken, cb) {
        const values = [newDailyToken.letterId, newDailyToken.quantity, newDailyToken.price, newDailyToken.date];
        db.query(createNewDailyTokenQuery, values, (err, res) => {
            if (err) {
                logger.error(err.message);
                cb(err, null);
                return;
            }
            cb(null, { id: res.insertId, ...newDailyToken });
        });
    }

    static findById(id, cb) {
        db.query(findDailyTokenByIdQuery, [id], (err, res) => {
            if (err) {
                logger.error(err.message);
                cb(err, null);
                return;
            }
            if (res.length) {
                cb(null, res[0]);
                return;
            }
            cb({ kind: "not_found" }, null);
        });
    }

    static update(id, updatedDailyToken, cb) {
        const values = [updatedDailyToken.letterId, updatedDailyToken.quantity, updatedDailyToken.price, updatedDailyToken.date, id];
        db.query(updateDailyTokenQuery, values, (err, res) => {
            if (err) {
                logger.error(err.message);
                cb(err, null);
                return;
            }
            if (res.affectedRows === 0) {
                cb({ kind: "not_found" }, null);
                return;
            }
            cb(null, { id: id, ...updatedDailyToken });
        });
    }

    static delete(id, cb) {
        db.query(deleteDailyTokenQuery, [id], (err, res) => {
            if (err) {
                logger.error(err.message);
                cb(err, null);
                return;
            }
            if (res.affectedRows === 0) {
                cb({ kind: "not_found" }, null);
                return;
            }
            cb(null, { message: "DailyToken deleted successfully" });
        });
    }

    static findAvailableByDate(date, cb) {
        db.query(findAvailableTokensByDateQuery, date, (err, res) => {
            if (err) {
                logger.error(err.message);
                cb(err, null);
                return;
            }
            cb(null, res);
        });
    }
}

module.exports = DailyToken;
