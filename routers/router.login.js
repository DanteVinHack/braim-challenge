const { Router } = require("express")
const { authorizationController } = require("../controller")
const { checkAuthorization } = require("../middlewares")

const router = Router()

router.post("/login", checkAuthorization(),authorizationController.login)

module.exports = router