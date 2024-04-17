const { Router } = require("express")
const { body, param } = require("express-validator")
const { existRegionTypeById, checkAuthorization, existRegionTypeByType } = require("../middlewares")
const { typesController } = require("../controller")

const router = Router()

router.get("/types/:typeId/", [
    param("typeId").notEmpty().isInt({ gt: 0}),
    existRegionTypeById(),
    checkAuthorization()
], typesController.getById)

router.post("/types/", [
    body("type").notEmpty().isString().trim().not().contains(" "),
    existRegionTypeByType(),
    checkAuthorization(),
], typesController.create)

router.put("/types/:typeId", [
    param("typeId").notEmpty().isInt({ gt: 0}),
    body("type").notEmpty().isString().trim().not().contains(" "),
    existRegionTypeById(),
    existRegionTypeByType(),
    checkAuthorization()
], typesController.updateById)

router.delete("/types/:typeId", [
    param("typeId").notEmpty().isInt({ gt: 0}),
    body("type").notEmpty().isString().trim().not().contains(" "),
    existRegionTypeById(),
    checkAuthorization()
], typesController.deleteById)

module.exports = router