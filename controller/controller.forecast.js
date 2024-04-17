const { validationResult } = require("express-validator")
const { forecastTable, weatherTable } = require("../tables")

class ForecastController {

    /**
     * @param {Express.Request} req 
     * @param {Express.Resopnse} req 
     */
    async create(req, res) {
        try {
            const errors = validationResult(req,)

            if (!errors.isEmpty()) {
                return res.send(400, { errors: errors.array() })
            }

            const forecastId = await forecastTable.add(req.body)
            const { precipitationAmount, windSpeed } = await weatherTable.searchByRegionId(req.body.regionId)

            res.send(200, {
                id: forecastId,
                precipitationAmount,
                windSpeed,
                ...req.body
            })
        } catch (err) {
            res.send(500, { errors: [{ msg: err.message }] })
        }
    }

    /**
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @returns 
     */
    async searchById(req, res) {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                res.send(400, { errors: errors.array() })
                return
            }

            res.send(200, req.forecast)
        } catch (err) {
            res.send(500, { errors: [{ msg: err.message }] })
        }
    }

    /**
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     * @returns 
     */
    async updateById(req, res) {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.send(400, { errors: errors.array() })
            }

            const forecastId = req.params.forecastId
            await forecastTable.updateById(forecastId, req.body)

            res.send(200, {
                id: forecastId,
                ...req.body
            })
        } catch (err) {
            res.send(500, { errors: [{ msg: err.message }] })
        }
    }

    async deleteById(req, res) {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.send(400, { errors: errors.array() })
            }

            await forecastTable.deleteById(req.params.forecastId)

            res.send(200)
        } catch (err) {
            res.send(500, { errors: [{ msg: err.message }] })
        }
    }
}

module.exports = new ForecastController()