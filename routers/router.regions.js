const { Router } = require("express")
const { param, body } = require("express-validator")
const { regionsController, weatherController } = require("../controller")
const { checkAuthorization, existRegionById, checkUniquenessCoordinates, checkWeatherByRegionId, checkWeatherById } = require("../middlewares")

const router = Router()

router.get("/region/:regionId/", [
    param("regionId").notEmpty().isInt({ gt: 0 }),
    existRegionById(),
    checkAuthorization(),
], regionsController.getById)

router.post("/region/", [
    body("name").notEmpty(),
    body("parentRegion").not().isNumeric(),
    body("latitude").isFloat().notEmpty(),
    body("longitude").isFloat().notEmpty(),
    checkUniquenessCoordinates(),
    checkAuthorization()
], regionsController.create)

router.put("/region/:regionId/", [
    param("regionId").notEmpty().isInt({ gt: 0 }),
    body("name").notEmpty(),
    body("latitude").notEmpty().isFloat(),
    body("longitude").notEmpty().isFloat(),
    existRegionById(),
    checkUniquenessCoordinates(),
    checkAuthorization()
], regionsController.updateById)

router.delete("/region/:regionId/", [
    param("regionId").notEmpty().isInt({ gt: 0 }),
    existRegionById(),
    checkAuthorization()
], regionsController.deleteById)

// router.post("/region/:regionId/weather/:weatherId/", [
//     existRegionById(),
//     checkWeatherByRegionId()
// ], weatherController)

// router.delete("/region/:regionId/weather/:weatherId/")

module.exports = router