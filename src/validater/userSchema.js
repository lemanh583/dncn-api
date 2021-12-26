const { check, validationResult } = require("express-validator");
const userModel = require("../model/users");

const validatorRegister = [
  check("username")
    .exists()
    .withMessage("Username must be exists!")
    .bail()
    .notEmpty()
    .withMessage("Username not empty!")
    .trim()
    .matches(/^[A-Za-z0-9_.]*$/g)
    .withMessage("Username not format!")
    .bail()
    .isLength({ min: 5, max: 100 })
    .withMessage("Length min 5 char and max 100 char!")
    .bail()
    .custom((value) => {
      return userModel.findOne({ username: value }).then((user) => {
        if (user) {
          return Promise.reject("Username already in use");
        }
      });
    })
    .bail(),
  check("name")
    .exists()
    .withMessage("name must be exists!")
    .bail()
    .notEmpty()
    .withMessage("name not empty!")
    .bail()
    .matches(/^[a-zA-ZaAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ ]*$/g)
    .withMessage("name not format!")
    .bail()
    .isLength({ min: 5, max: 100 })
    .withMessage("Length min 5 char and max 100 char!")
    .bail(),
  check("email")
    .exists()
    .withMessage("Email must be exists!")
    .bail()
    .notEmpty()
    .withMessage("Email not empty!")
    .bail()
    .isEmail()
    .withMessage("Email not format email!")
    .bail()
    .custom((value) => {
      return userModel.findOne({ email: value }).then((user) => {
        if (user) {
          return Promise.reject("E-mail already in use");
        }
      });
    })
    .bail(),
  check("password")
    .exists()
    .withMessage("Password must be exists!")
    .bail()
    .notEmpty()
    .withMessage("Password not empty!")
    .bail()
    .isLength({ min: 5, max: 100 })
    .withMessage("Password min 5 char and max 100 char!")
    .bail(),
  check("rePassword")
    .exists()
    .withMessage("Password must be exists!")
    .bail()
    .notEmpty()
    .withMessage("Re-password not empty!")
    .bail()
    .isLength({ min: 5, max: 100 })
    .withMessage("Re-password min 5 char and max 100 char!")
    .bail()
    .custom((value, { req }) => {
      if (value !== req.body.password) {
        throw new Error("Password confirmation is incorrect");
      }
      return value;
    }),
];

const validatorLogin = [
  check("account")
    .exists()
    .withMessage("Account must be exists!")
    .bail()
    .notEmpty()
    .withMessage("Account not empty!")
    .bail()
    .isLength({ min: 5, max: 100 })
    .withMessage("Password min 5 char and max 100 char!")
    .bail(),
  check("password")
    .exists()
    .withMessage("Password must be exists!")
    .bail()
    .notEmpty()
    .withMessage("Password not empty!")
    .bail()
    .isLength({ min: 5, max: 100 })
    .withMessage("Password min 5 char and max 100 char!")
    .bail(),
];

const checkUpdate = [
  check("username")
    .exists()
    .withMessage("Username must be exists!")
    .bail()
    .notEmpty()
    .withMessage("Username not empty!")
    .trim()
    .matches(/^[A-Za-z0-9_.]*$/g)
    .withMessage("Username not format!")
    .bail()
    .isLength({ min: 5, max: 100 })
    .withMessage("Length min 5 char and max 100 char!")
    .bail()
    .custom((value, request) => {
      // console.log('params', request.req.params)
      return userModel.findOne({ username: value, _id: {$ne: request.req.params.id} }).then((user) => {
        if (user) {
          return Promise.reject("Username already in use");
        }
      });
    })
    .bail(),
  check("name")
    .exists()
    .withMessage("name must be exists!")
    .bail()
    .notEmpty()
    .withMessage("name not empty!")
    .bail()
    // .matches(/^[a-zA-ZaAàÀảẢãÃáÁạẠăĂằẰẳẲẵẴắẮặẶâÂầẦẩẨẫẪấẤậẬbBcCdDđĐeEèÈẻẺẽẼéÉẹẸêÊềỀểỂễỄếẾệỆfFgGhHiIìÌỉỈĩĨíÍịỊjJkKlLmMnNoOòÒỏỎõÕóÓọỌôÔồỒổỔỗỖốỐộỘơƠờỜởỞỡỠớỚợỢpPqQrRsStTuUùÙủỦũŨúÚụỤưƯừỪửỬữỮứỨựỰvVwWxXyYỳỲỷỶỹỸýÝỵỴzZ ]*$/g)
    // .withMessage("name not format!")
    // .bail()
    .isLength({ min: 5, max: 100 })
    .withMessage("Length min 5 char and max 100 char!")
    .bail(),
  check("email")
    .exists()
    .withMessage("Email must be exists!")
    .bail()
    .notEmpty()
    .withMessage("Email not empty!")
    .bail()
    .isEmail()
    .withMessage("Email not format email!")
    .bail()
    .custom((value, request) => {
      // console.log('req', req.params.id)
      return userModel.findOne({ email: value, _id: {$ne: request.req.params.id} }).then((user) => {
        if (user) {
          return Promise.reject("E-mail already in use");
        }
      });
    })
    .bail(),
  check("phone")
    .not()
    .isNumeric()
    .withMessage("Phone is number")
]


module.exports = { validatorRegister, validatorLogin, checkUpdate };
