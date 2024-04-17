const { Router } = require("express")
const { param, query, body } = require("express-validator")
const { checkAuthorization, existRegionById, checkWeatherByRegionId, checkWeatherCondition, checkOnIsoDateTimeFormatQuery, checkOnIsoDateTimeFormatBody } = require("../middlewares")
const { weatherController } = require("../controller")

const router = Router()

router.get("/weather/search", [
    query("regionId").optional({ nullable: true }).isInt({ gt: 0 }),
    query("windSpeed").optional({ nullable: true }).isInt({ gt: 0 }),
    query("perprecipitationAmount").optional({ nullable: true }).isInt({ gt: 0 }),
    query("size").optional({ nullable: true }).isInt({ gt: 0 }).withMessage("Size must be greater 0"),
    query("from").optional({ nullable: true }).isInt({ gt: -1 }).withMessage("From must be greater -1"),
    existRegionById(),
    checkWeatherByRegionId(),
    checkWeatherCondition(),
    checkOnIsoDateTimeFormatQuery(),
    checkAuthorization()
], weatherController.search)

router.get("/weather/:regionId/", [
    param("regionId").notEmpty().isInt({ gt: 0 }),
    existRegionById(),
    checkWeatherByRegionId(),
    checkAuthorization()
], weatherController.getByRegionId)

router.post("/weather/", [
    body("regionId").notEmpty().isInt({ gt: 0 }),
    body("regionName").notEmpty().isString(),
    body("regionId").notEmpty(),
    body("windSpeed").isFloat({ gt: -1}).withMessage("Wind speed can't be less 0"),
    body("temperature").isFloat(),
    body("precipitationAmount").isFloat({ gt: -1 }).withMessage("Precipitation amount can't be less 0"),
    existRegionById(),
    checkWeatherCondition(),
    checkOnIsoDateTimeFormatBody(),
    checkAuthorization()
], weatherController.create)

router.put("/weather/:regionId/", [
    body("regionId").notEmpty().isInt({ gt: 0 }),
    body("regionName").notEmpty().isString(),
    body("regionId").notEmpty(),
    body("windSpeed").isFloat({ gt: -1}).withMessage("Wind speed can't be less 0"),
    body("temperature").isFloat(),
    body("precipitationAmount").isFloat({ gt: -1 }).withMessage("Precipitation amount can't be less 0"),
    existRegionById(),
    checkWeatherByRegionId(),
    checkWeatherCondition(),
    checkOnIsoDateTimeFormatBody(),
    checkAuthorization()
], weatherController.updateByRegionId)

router.delete("/weather/:regionId/", [
    param("regionId").notEmpty().isInt({ gt: 0}),
    existRegionById(),
    checkAuthorization()
], weatherController.deleteByRegionId)

module.exports = router