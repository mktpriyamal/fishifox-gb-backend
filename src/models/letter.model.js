const db = require('../config/db.config');
const {
    createNewLetter: createLetterQuery,
    getAllLetters: getAllLettersQuery,
    findLetterById: findLetterByIdQuery,
    updateLetter: updateLetterQuery,
    deleteLetter: deleteLetterQuery
} = require('../database/queries');
const { logger } = require('../utils/logger');

class Letter {
    constructor(letter) {
        this.letter = letter;
    }

    static create(newLetter, cb) {
        console.log(createLetterQuery)
        db.query(createLetterQuery, newLetter.letter, (err, res) => {
            if (err) {
                logger.error(err.message);
                cb(err, null);
                return;
            }
            cb(null, {
                id: res.insertId,
                letter: newLetter.letter
            });
        });
    }

    static getAll(cb) {
        db.query(getAllLettersQuery, (err, res) => {
            if (err) {
                logger.error(err.message);
                cb(err, null);
                return;
            }
            cb(null, res);
        });
    }

    static findById(letterId, cb) {
        db.query(findLetterByIdQuery, letterId, (err, res) => {
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

    static update(letterId, updatedLetter, cb) {
        db.query(updateLetterQuery, [updatedLetter.letter, letterId], (err, res) => {
            if (err) {
                logger.error(err.message);
                cb(err, null);
                return;
            }
            if (res.affectedRows === 0) {
                cb({ kind: "not_found" }, null);
                return;
            }
            cb(null, { id: letterId, letter: updatedLetter.letter });
        });
    }

    static delete(letterId, cb) {
        db.query(deleteLetterQuery, letterId, (err, res) => {
            if (err) {
                logger.error(err.message);
                cb(err, null);
                return;
            }
            if (res.affectedRows === 0) {
                cb({ kind: "not_found" }, null);
                return;
            }
            cb(null, { message: "Letter deleted successfully" });
        });
    }
}

module.exports = Letter;
