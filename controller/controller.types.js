const { validationResult } = require("express-validator")
const { typesTable } = require("../tables")

class TypesController {

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

            
            const type = req.body
            await typesTable.add(type)
            const response = await typesTable.search("type", type.type)

            res.status(201)
            res.send(response[0])
        } catch (err) {
            res.status(500)
            res.send({ errors: [{ msg: err.message }] })
        }
    }

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

            const regionType = await typesTable.searchById(req.params.typeId)

            res.status(200)
            res.send(regionType)
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

            const type = { id: req.params.typeId, ...req.body}
            await typesTable.updateById(type)

            res.status(200)
            res.send(type)
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
    async deleteById(req, res) {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                res.status(400)
                return res.send({ errors: errors.array() })
            }

            await typesTable.deleteById(req.params.typeId)

            res.status(200)
            res.send()
        } catch (err) {
            res.status(500)
            res.send({ errors: [{ msg: err.message }] })
        }
    }
}

module.exports = new TypesController()