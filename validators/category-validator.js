const { body, validationResult } = require('express-validator')

const addCategoryValidator = () => {
    return [
        body('name')
            .not()
            .trim()
            .isEmpty().withMessage('Enter category name').bail()
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
    addCategoryValidator,
    validateApp
}