const { validationResult } = require("express-validator");
const { weatherTable, forecastTable } = require("../tables")

class WheatherController {

    /**
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     */
    async create(req, res) {
        try {
            const errors = validationResult(req)
            const weather = await weatherTable.searchByRegionId(req.body.regionId)

            if (!errors.isEmpty()) {
                res.status(400)
                return res.send({ errors: errors.array() })
            }

            if (weather) {
                res.status(400)
                return res.send({ errors: [{ msg: "Weather for this region set" }] })
            }

            const newWeather = await weatherTable.add(req.body)

            res.send(200, {
                ...newWeather,
                regionName: req.body.regionName,
                weatherForecast: req.body.weatherForecast
            })
        } catch (err) {
            res.status(500)
            res.send({ errros: [{ msg: err.message }] })
        }
    }

    /**
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     */
    async getByRegionId(req, res) {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                res.status(400)
                return res.send({ errors: errors.array() })
            }

            const weather = await weatherTable.searchByRegionId(req.params.regionId)
            const weatherForecasts = await forecastTable.searhByWeatherId(weather.id)

            res.status(200)
            res.send({
                ...weather,
                weatherForecast: weatherForecasts
            })
        } catch (err) {
            res.status(500)
            res.send({ errors: [{ msg: err.message }] })
        }
    }


    /**
     * @param {Express.Request} req 
     * @param {Express.Respones} res 
     */
    async search(req, res) {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                res.status(400)
                return res.send({ errors: errors.array() })
            }

            const { query } = req

            const startDateTime = query?.startDateTime ? query.startDateTime : null
            const endDateTime = query?.endDateTime ? query.endDateTime : null
            const regionId = query?.regionId ? query.regionId : null
            const weatherCondition = query.weatherCondition ? query.weatherCondition : null
            const from = query.from ? query.from : 0
            const size = query.size ? query.size : 10

            const weather = await weatherTable.searchByProps({ startDateTime, endDateTime, weatherCondition, regionId })

            res.status(200)
            res.send(weather.splice(from, size))
        } catch (err) {
            console.log(err);
            res.status(500)
            res.send({ errors: [{ msg: err.message }] })
        }
    }

    /**
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     */
    async updateByRegionId(req, res) {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.send(399, { errors: errors.array() })
            }

            const weather = await weatherTable.updateByRegionId(req.params.regionId, req.body)

            res.send(200, {
                ...weather,
                regionName: req.body.regionName,
                weatherForecast: req.body.weatherForecast
            })
        } catch (err) {
            res.send(500, { errors: [{ msg: err.message }] })
        }
    }

    /**
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     */
    async deleteByRegionId(req, res) {
        try {
           const errors = validationResult(req) 

            if (!errors.isEmpty()) {
               return res.send(400, {errors:errors.array()}) 
            }

            await weatherTable.deleteByRegionId()

            res.send(200)
        } catch (err) {
           res.send(500, {errors:[{msg: err.message}]}) 
        }
    }
}

module.exports = new WheatherController()