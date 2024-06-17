const User = require('../models/user.model');
const { hash: hashPassword, compare: comparePassword } = require('../utils/password');
const { generate: generateToken } = require('../utils/token');

exports.getUserById = (req, res) => {
    const userId = req.id; // Assuming the authenticated user's ID is available in req.user
    User.findById(userId, (err, data) => {
        if (err) {
            res.status(500).send({
                status: 'error',
                message: err.message
            });
            return;
        }
        if (data) {
            res.status(200).send({
                status: 'success',
                data: {
                    firstname: data.firstname,
                    lastname: data.lastname,
                    email: data.email,
                    role: data.role
                }
            });
        } else {
            res.status(404).send({
                status: 'error',
                message: 'User not found'
            });
        }
    });
};

exports.updateUser = (req, res) => {
    const userId = req.user.id; // Assuming the authenticated user's ID is available in req.user
    const { firstname, lastname, email, mobileNumber, nic } = req.body;

    const updatedUser = new User(firstname.trim(), lastname.trim(), email.trim(), null, mobileNumber.trim(), nic.trim(), null);

    User.update(userId, updatedUser, (err, data) => {
        if (err) {
            res.status(500).send({
                status: 'error',
                message: err.message
            });
            return;
        }
        if (data) {
            res.status(200).send({
                status: 'success',
                data
            });
        } else {
            res.status(404).send({
                status: 'error',
                message: 'User not found'
            });
        }
    });
};

exports.deleteUser = (req, res) => {
    const userId = req.user.id; // Assuming the authenticated user's ID is available in req.user
    User.delete(userId, (err, _) => {
        if (err) {
            res.status(500).send({
                status: 'error',
                message: err.message
            });
            return;
        }
        res.status(200).send({
            status: 'success',
            message: 'User deleted successfully'
        });
    });
};
