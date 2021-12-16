const { check, validationResult } = require("express-validator");

const validatorPostCreate = [
    check("title")
            .exists()
            .withMessage("title must be exists!")
            .bail()
            .notEmpty()
            .withMessage("title not empty!")
            .trim()
            .isLength({ min: 5, max: 200 })
            .withMessage("Length min 5 char and max 100 char!")
            .bail(),
    check("content")
            .exists()
            .withMessage("title must be exists!")
            .bail()
            .notEmpty()
            .withMessage("title not empty!")
            .trim()
            .isLength({ min: 25})
            .withMessage("Length min 5 char")
            .bail()
]

module.exports = {validatorPostCreate}