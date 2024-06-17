const db = require('../config/db.config');
const {
    createNewUser: createNewUserQuery,
    findUserByEmail: findUserByEmailQuery,
    findUserById: findUserByIdQuery,
    updateUser: updateUserQuery,
    deleteUser: deleteUserQuery
} = require('../database/queries');
const { logger } = require('../utils/logger');

class User {
    constructor(firstname, lastname, email, password, mobileNumber, nic, role) {
        this.firstname = firstname;
        this.lastname = lastname;
        this.email = email;
        this.password = password;
        this.mobileNumber = mobileNumber;
        this.nic = nic;
        this.role = role;
    }

    static create(newUser, cb) {
        db.query(createNewUserQuery,
            [
                newUser.firstname,
                newUser.lastname,
                newUser.email,
                newUser.password,
                newUser.mobileNumber,
                newUser.nic,
                newUser.role
            ], (err, res) => {
                if (err) {
                    logger.error(err.message);
                    cb(err, null);
                    return;
                }
                cb(null, {
                    id: res.insertId,
                    firstname: newUser.firstname,
                    lastname: newUser.lastname,
                    email: newUser.email,
                    mobileNumber: newUser.mobileNumber,
                    nic: newUser.nic,
                    role: newUser.role
                });
            });
    }

    static findByEmail(email, cb) {
        db.query(findUserByEmailQuery, email, (err, res) => {
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

    static findById(id, cb) {
        db.query(findUserByIdQuery, id, (err, res) => {
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

    static update(id, user, cb) {
        db.query(updateUserQuery,
            [
                user.firstname,
                user.lastname,
                user.email,
                user.password,
                user.mobileNumber,
                user.nic,
                user.role,
                id
            ], (err, res) => {
                if (err) {
                    logger.error(err.message);
                    cb(err, null);
                    return;
                }
                if (res.affectedRows === 0) {
                    cb({ kind: "not_found" }, null);
                    return;
                }
                cb(null, { id: id, ...user });
            });
    }

    static delete(id, cb) {
        db.query(deleteUserQuery, id, (err, res) => {
            if (err) {
                logger.error(err.message);
                cb(err, null);
                return;
            }
            if (res.affectedRows === 0) {
                cb({ kind: "not_found" }, null);
                return;
            }
            cb(null, res);
        });
    }
}

module.exports = User;
