const { Router } = require("express")
const { body } = require("express-validator")
const { authorizationController } = require("../controller")


const router = Router()

router.post("/registration",
    [
        body("first_name").notEmpty().trim().not().contains(" "),
        body("last_name").notEmpty().trim().not().contains(" "),
        body("email").notEmpty().isEmail().trim().not().contains(" "),
        body("password").notEmpty().isLength({ min: 8, max: 32 }).withMessage("Password length must be equal or great 8.").not().contains(" ").trim()
    ], authorizationController.create)

module.exports = router