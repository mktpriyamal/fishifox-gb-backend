const db = require('../config/db.config');
const {
    createNewDailyToken: createNewDailyTokenQuery,
    findDailyTokenById: findDailyTokenByIdQuery,
    updateDailyToken: updateDailyTokenQuery,
    deleteDailyToken: deleteDailyTokenQuery,
    deleteDailyTokenByDateAndLetter: deleteDailyTokenByDateAndLetterQuery,
    findDailyTokensByDate: findDailyTokensByDateQuery, // Import the new query
    findAvailableTokensByDate: findAvailableTokensByDateQuery, // Import the new query
    allLetterTokensByDate: allLetterTokensByDateQuery // Import the new query
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

    static findTokensWithLettersByDate(date, cb) {
        db.query(allLetterTokensByDateQuery, date, (err, res) => {
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

    static async updateAllByDate(date, tokens, cb) {
        try {
            const results = await this.processItems(date, tokens);
            console.log('All items saved or updated:', results);
            cb(null, results);
        } catch (error) {
            console.error('Error inserting or updating data:', error);
            cb(null, null);
        }
    }

    static processItems(date,tokens) {
        const promises = tokens.map(item => {
            if (item['QUANTITY'] > 0 && item['PRICE'] > 0){
                return new Promise((resolve, reject) => {
                    // Check if record exists
                    db.query('SELECT DT.* FROM DAILY_TOKEN DT LEFT JOIN LETTERS L on L.ID = DT.LETTER_ID WHERE DATE=? AND L.LETTER=? LIMIT 1', [date,item['LETTER']], (err, results) => {
                        if (err) {
                            reject(err);
                        } else {
                            if (results.length > 0) {
                                // Record exists, perform update
                                db.query('UPDATE DAILY_TOKEN SET QUANTITY = ?, PRICE = ? WHERE DATE = ? AND LETTER_ID = (SELECT ID FROM LETTERS WHERE LETTER=?)',
                                    [item['QUANTITY'], item['PRICE'], date, item['LETTER']], (err, updateResult) => {
                                        if (err) {
                                            reject(err);
                                        } else {
                                            resolve(updateResult);
                                        }
                                    });
                            } else {
                                // Record does not exist, perform insert
                                db.query('INSERT INTO DAILY_TOKEN (LETTER_ID, QUANTITY, PRICE, DATE) VALUES ((SELECT ID FROM LETTERS WHERE LETTER=?), ?, ?, ?)',
                                    [item['LETTER'], item['QUANTITY'], item['PRICE'], date], (err, insertResult) => {
                                        if (err) {
                                            reject(err);
                                        } else {
                                            resolve(insertResult);
                                        }
                                    });
                            }
                        }
                    });
                });
            }
        });

        return Promise.all(promises);
    }
}

module.exports = DailyToken;
