const { validationResult } = require("express-validator")
const { regionsTable } = require("../tables")
const db = require("../db")

class RegionsController {
    /**
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     */
    async getById(req, res) {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                res.status(400)
                return res.send({ errors: errors.array() })
            }

            const cookieId = req.cookies.id
            const { regionId } = req.params
            const region = await regionsTable.searchById(regionId)

            res.status(200)
            res.send({ id: cookieId, ...region })
        } catch (err) {
            res.status(500)
            res.send({ errors: [{ msg: err.message }] })
        }
    }

    /**
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     */
    async create(req, res) {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                res.status(400)
                return res.send({ errors: errors.array() })
            }

            const cookieId = req.cookies.id
            const region = req.body

            console.log("work");
            await regionsTable.add({ accountId: cookieId, ...region })
            const newRegion = await regionsTable.searchByProps(["latitude", "longitude"], region)

            res.status(201)
            res.send(newRegion)
        } catch (err) {
            res.status(500)
            res.send({ errors: [{ msg: err.message }] })
        }
    }

    /**
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     */
    async updateById(req, res) {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                res.status(400)
                return res.send({ errors: errors.array() })
            }

            const region = req.body
            const { regionId } = req.params

            await regionsTable.updateById({ id: regionId, ...region });

            res.status(200)
            res.send(region)
        } catch (err) {
            res.status(500)
            res.send({ errors: [{ msg: err.message }] })
        }
    }

    /**
     * @param {Express.Request} req 
     * @param {Express.Response} res 
     */
    async deleteById(req, res) {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                res.status(400)
                return res.send({ errors: errors.array() })
            }

            const region = await regionsTable.searchById(req.params.regionId)
            const childRegions = await regionsTable.search("parentRegion", region.name)

            if (childRegions.length) {
                res.status(400) 
                return res.send({ errors: [{msg: "The region is the parent of another region"}]})
            }

            await regionsTable.deleteById(req.params.regionId)

            res.status(200)
            res.send("DELETED")
        } catch (err) {
            res.status(500)
            res.send({ errors: [{ msg: err.message }] })
        }
    }
}

module.exports = new RegionsController()