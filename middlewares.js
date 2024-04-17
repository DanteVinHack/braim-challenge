const { usersTable, regionsTable, typesTable, weatherTable, forecastTable } = require("./tables")

/**
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
module.exports.checkAuthorization = () => async (req, res, next) => {
    try {
        req.cookies.id = Number(req.cookies.id)
        const cookieId = req.cookies.id

        if (!cookieId || cookieId < 1) {
            res.status(401)
            return res.send({ errors: [{ msg: "A request from an unauthorized user" }] })
        }

        const candidate = await usersTable.searchById(cookieId)
        if (!candidate) {
            res.status(401)
            return res.send({ errors: [{ msg: "User with that id not found" }] })
        }

        req.user = candidate

        next()
    } catch (err) {
        res.status(500)
        res.send({ errors: [{ msg: err.message }] })
    }
}

/**
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
module.exports.existRegionById = () => async (req, res, next) => {
    try {
        const region = await regionsTable.searchById(req.params?.regionId || req.query?.regionId || req.body?.regionId)

        if (!region) {
            res.status(404)
            return res.send({ errors: [{ msg: "The region with this region id was not found" }] })
        }

        next()
    } catch (err) {
        res.status(500)
        res.send({ errors: [{ msg: err.message }] })
    }
}

/**
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
module.exports.existRegionTypeById = () => async (req, res, next) => {
    try {
        req.params.typeId = Number(req.params.typeId)
        const typeId = req.params.typeId
        const region = await typesTable.searchById(typeId)

        if (!region) {
            res.status(404)
            return res.send({ errors: [{ msg: "The type with this type id was not found" }] })
        }

        next()
    } catch (err) {
        res.status(500)
        res.send({ errors: [{ msg: err.message }] })
    }
}

/**
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
module.exports.checkWeatherByRegionId = () => async (req, res, next) => {
    try {
        const weather = await weatherTable.searchByRegionId(req.params?.regionId || req.query?.regionId || req.body?.regionId)

        if (!weather) {
            res.status(404)
            return res.send({ errors: [{ msg: "Weather in this region not found" }] })
        }
    
        req.weather = weather;

        next()
    } catch (err) {
        res.status(500)
        res.send({ errors: [{ msg: err.message }] })
    }
}

module.exports.existRegionTypeByType = () => async (req, res, next) => {
    try {
        const { type } = req.body
        const regionsTypes = await typesTable.search("type", type)

        if (regionsTypes.length) {
            res.status(409)
            return res.send({ errors: [{ msg: "The type of region with this type already exists" }] })
        }

        next()
    } catch (err) {
        res.status(500)
        res.send({ errors: [{ msg: err.message }] })
    }
}

/**
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
module.exports.checkUniquenessCoordinates = () => async (req, res, next) => {
    try {
        const region = req.body
        const coordinateCoincidence = await regionsTable.searchByProps(["latitude", "longitude"], region)

        if (coordinateCoincidence) {
            res.status(409)
            return res.send({ errors: [{ msg: "A region with such latitude and longitude already exists" }] })
        }

        next()
    } catch (err) {
        res.status(500)
        res.send({ errors: [{ msg: err.message }] })
    }
}

/**
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
module.exports.checkWeatherCondition = () => async (req, res, next) => {
    try {
        const weatherCondition = req.query?.weatherCondition || req.body?.weatherCondition

        if (!weatherCondition) {
            next()
            return
        }

        if (!["CLEAR", "CLOUDY", "RAIN", "FOG", "SNOW", "STORM"].includes(weatherCondition)) {
            return res.send(400, { errors: [{ msg: `Weather condition not equal "CLEAR", "CLOUDY", "RAIN", "FOG", "SNOW" or "STORM"` }] })
        }

        next()
    } catch (err) {
        res.status(500)
        res.send({ errors: [{ msg: err.message }] })
    }
}

/**
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
module.exports.checkOnIsoDateTimeFormatBody = () => (req, res, next) => {
    try {
        const dateTime = req.body?.measurementDateTime || req.body?.dateTime

        if (dateTime && new Date(dateTime).toISOString() !== dateTime) {
            return res.send(400, { errors: [{ msg: "\"dateTime\" or \"measurementDateTime\" not in iso format" }] })
        }

        next()
    } catch (err) {
        res.status(500)
        res.send({ errors: [{ msg: err.message }] })
    }
}

/**
 * @param {Express.Request} req 
 * @param {Express.Response} res 
 */
module.exports.checkOnIsoDateTimeFormatQuery = () => (req, res, next) => {
    try {
        const { query } = req
        const startDateTime = query?.startDateTime ? query?.startDateTime : null
        const endDateTime = query?.endDateTime ? query?.endDateTime : null

        if (startDateTime && new Date(startDateTime).toISOString() !== startDateTime) {
            return res.send(400, { errors: [{ msg: "\"startDateTime\" not in iso format" }] })
        }

        if (endDateTime && new Date(endDateTime).toISOString() !== endDateTime) {
            return res.send(400, { errors: [{ msg: "\"endDateTime\" not format in iso date time format" }] })
        }

        next()
    } catch (err) {
        res.status(500)
        res.send({ errors: [{ msg: err.message }] })
    }
}

/**
 * @param {Express.Request} req
 * @param {Express.Response} res 
 */
module.exports.existForecastById = () => async (req, res, next) => {
    try {
        const forecast = await forecastTable.searchById(req.params.forecastId)
        
        if (!forecast) {
            return res.send(404, {errors: [{msg: "There is no forecast with such forecasted"}]})
        }

        req.forecast = forecast
        next()
    } catch (err) {
        console.log("Error", err);
        res.send(500, {errors: [{msg: err.message}]})
    }
}