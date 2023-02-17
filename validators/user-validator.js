const { body, validationResult } = require('express-validator')
const User = require('../models/User')

const registerationValidator = () => {
    return [
        body('email')
            .not()
            .trim()
            .isEmpty().withMessage('Enter your email').bail()
            .isEmail().withMessage('Enter valid email').bail()
            .custom(async value => {
                const user = await User.findOne({ email: value });
                if (user) {
                    return Promise.reject('User email already exists');
                }
                return true;
            }),
        body('phone')
            .not()
            .trim()
            .isEmpty().withMessage('Enter your phone').bail()
            .isNumeric().withMessage('Phone number only contains digits').bail()
            .isLength({ min: 10, max: 10 }).withMessage('Phone number must contains 10 digits').bail()
            .custom(async value => {
                const user = await User.findOne({ phone: value });
                if (user) {
                    return Promise.reject('User phone already exists');
                }
                return true;
            }),
        body('password')
            .not()
            .trim()
            .isEmpty().withMessage('Enter your password').bail()
            .matches('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})').withMessage('Password pattern does not matches'),
        body('confirm_password')
            .not()
            .trim()
            .isEmpty().withMessage('Enter your confirm password').bail()
            .custom((value, { req }) => {
                if (value !== req.body.password) {
                    throw new Error('Password confirmation does not match password');
                }
                return true;
            })
    ]
}

const loginEmailValidator = () => {
    return [
        body('email')
            .not()
            .trim()
            .isEmpty().withMessage('Enter your email').bail()
            .isEmail().withMessage('Enter valid email').bail(),
        body('password')
            .not()
            .trim()
            .isEmpty().withMessage('Enter your password').bail()
    ]
}

const loginPhoneValidator = () => {
    return [
        body('phone')
            .not()
            .trim()
            .isEmpty().withMessage('Enter your phone').bail()
            .isNumeric().withMessage('Phone number only contains digits').bail()
            .isLength({ min: 10, max: 10 }).withMessage('Phone number must contains 10 digits').bail(),
        body('password')
            .not()
            .trim()
            .isEmpty().withMessage('Enter your password').bail()
    ]
}

const updatePasswordValidator = () => {
    return [
        body('current_password')
            .not()
            .trim()
            .isEmpty().withMessage('Enter your current password').bail(),
        body('new_password')
            .not()
            .trim()
            .isEmpty().withMessage('Enter your new password').bail()
            .matches('^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})').withMessage('Password pattern does not matches'),
        body('confirm_password')
            .not()
            .trim()
            .isEmpty().withMessage('Enter your confirm password').bail()
            .custom((value, { req }) => {
                if (value !== req.body.new_password) {
                    throw new Error('Password confirmation does not match password');
                }
                return true;
            })
    ]
}

const validateApp = (req, res, next) => {
    const errors = validationResult(req)
    if (errors.isEmpty()) {
        return next()
    }
    //errors.array()[0].msg
    res.status(400).json({ status: false, message: errors.array() });
}

module.exports = {
    registerationValidator,
    loginEmailValidator,
    loginPhoneValidator,
    updatePasswordValidator,
    validateApp
}