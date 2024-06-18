const User = require('../models/user.model');
const { hash: hashPassword, compare: comparePassword } = require('../utils/password');
const { generate: generateToken } = require('../utils/token');

exports.signup = (req, res) => {
    const { firstname, lastname, email, password,mobileNumber,nic,role } = req.body;
    const hashedPassword = hashPassword(password.trim());

    const user = new User(firstname.trim(), lastname.trim(), email.trim(), hashedPassword,mobileNumber.trim(),nic.trim(),role.trim().toUpperCase());

    User.create(user, (err, data) => {
        if (err) {
            res.status(500).send({
                status: "error",
                message: err.message
            });
        } else {
            const token = generateToken(data.id);
            res.status(201).send({
                status: "success",
                data: {
                    token,
                    data
                }
            });
        }
    });
};

exports.signin = (req, res) => {
    const { email, password } = req.body;
    console.log(email,password)
    User.findByEmail(email.trim(), (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    status: 'error',
                    message: `User with email ${email} was not found`
                });
                return;
            }
            res.status(500).send({
                status: 'error',
                message: err.message
            });
            return;
        }
        if (data) {
            if (comparePassword(password.trim(), data['PASSWORD'])) {
                const token = generateToken(data['ID']);
                res.status(200).send({
                    status: 'success',
                    data: {
                        token,
                        id: data['ID'],
                        firstname: data['FIRST_NAME'],
                        lastname: data['LAST_NAME'],
                        email: data['EMAIL'],
                        mobileNumber: data['MOBILE_NUMBER'],
                        role: data['ROLE'],
                        nic: data['NIC']
                    }
                });
                return;
            }
            res.status(401).send({
                status: 'error',
                message: 'Incorrect password'
            });
        }
    });

}