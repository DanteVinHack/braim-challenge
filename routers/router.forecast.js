const { Router } = require("express")
const { param, body } = require("express-validator")

const { forecastController } = require("../controller")
const { checkAuthorization, existForecastById, checkWeatherCondition, checkOnIsoDateTimeFormatBody, existRegionById } = require("../middlewares")

const router = Router()

router.get("/forecast/:forecastId/", [
    param("forecastId").notEmpty().isInt({ gt: 0 }),
    existForecastById(),
    checkAuthorization()
], forecastController.searchById)

router.post("/forecast/", [
    body("regionId").notEmpty().isInt({ gt: 0 }),
    body("dateTime").notEmpty().isISO8601(),
    existRegionById(),
    checkWeatherCondition(),
    checkAuthorization()
], forecastController.create)

router.put("/forecast/:forecastId/", [
    param("forecastId").notEmpty().isInt({ gt: 0 }).toInt(),
    body("dateTime").notEmpty().isISO8601(),
    existForecastById(),
    checkWeatherCondition(),
    checkAuthorization(),
], forecastController.updateById)

router.delete("/forecast/:forecastId/", [
    param("forecastId").notEmpty().isInt({ gt: 0 }).toInt(),
    existForecastById(),
    checkAuthorization()
], forecastController.deleteById)

module.exports = router