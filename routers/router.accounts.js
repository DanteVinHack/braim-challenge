const { Router } = require("express")
const { param, query, body, cookie } = require("express-validator")
const { accountsController } = require("../controller")
const { checkAuthorization } = require("../middlewares")

const router = Router()

router.get("/accounts/search",
    [
        query("size").optional({ nullable: true }).isInt({ gt: 0 }).withMessage("Size must be greater 0"),
        query("from").optional({ nullable: true }).isInt({ gt: -1 }).withMessage("From must be greater -1"),
        checkAuthorization()
    ], accountsController.search)

router.get("/accounts/:accountId", [
    param("accountId").notEmpty().isInt({ gt: -1 }).withMessage("The account id must be greater than or equal to 0"),
    checkAuthorization()
], accountsController.getById)

router.put("/accounts/:accountId",
    [
        param("accountId").notEmpty().isInt({ gt: -1 }).withMessage("The account id must be greater than or equal to 0"),
        body("first_name").notEmpty().trim().not().contains(" "),
        body("last_name").notEmpty().trim().not().contains(" "),
        body("email").notEmpty().isEmail().trim().not().contains(" "),
        body("password").notEmpty().isLength({ min: 8, max: 32 }).withMessage("Password length must be equal or great 8.").not().contains(" ").trim(),
        checkAuthorization()
    ], accountsController.updateById)

router.delete("/accounts/:accountId",
    [
        param("accountId").exists().isInt({ gt: -1 }).withMessage("The account id must be greater than or equal to 0"),
        checkAuthorization()
    ], accountsController.deleteById)

module.exports = router