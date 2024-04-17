const { validationResult } = require("express-validator")
const { usersTable } = require("../tables")

class AccountsController {
    async search(req, res) {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                res.status(400)
                return res.send(errors.array())
            }

            const { query } = req
            const from = query?.from ? query.from : 0
            const size = query?.size ? query.size : 10

            const result = await usersTable.searchByProps(Object.keys(query) ,query);

            res.status(200)
            res.send(result.splice(from, size))
        } catch (err) {
            res.status(500)
            res.send({ errors: [{ msg: err.message }] })
        }
    }

    async getById(req, res) {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                res.status(400);
                return res.send({ errors: errors.array() })
            }

            const { accountId } = req.params
            const candidate = await usersTable.searchById(accountId)

            if (!candidate) {
                res.status(404)
                return res.send({
                    errors: [
                        {
                            type: "params",
                            value: id,
                            msg: "The user with this id was not found",
                            location: "database"
                        }
                    ]
                })
            }

            res.status(200)
            res.send(candidate)
        } catch (err) {
            res.status(500)
            res.send({ errors: [{ msg: err.message }] })
        }
    }

    async updateById(req, res) {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                res.status(400)
                return res.send({ errors: errors.array() })
            }

            const { accountId } = req.params
            const user = req.body
            const cookieId = req.cookies.id

            const candidate = await usersTable.searchById(accountId)

            if (cookieId !== candidate.id) {
                res.status(403)
                return res.send({
                    errors: [
                        { msg: "Updating a non-personal account" }
                    ]
                })
            }

            if (await usersTable.search("email", user.email)[0]) {
                res.status(409)
                return res.send({
                    errors: [
                        { msg: "An account with this email already exists" }
                    ]
                })
            }

            const userInfo = { ...user, id: cookieId }
            await usersTable.updateById(userInfo)

            res.status(200)
            res.send(userInfo)
        } catch (err) {
            res.status(500)
            res.send({ errors: [{ msg: err.message }] })
        }
    }

    async deleteById(req, res) {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                res.status(400)
                return res.send({ errors: errors.array() })
            }

            const { accountId } = req.params
            const userId = req.user.id
            const candidate = await usersTable.searchById(accountId)

            if (userId !== candidate.id) {
                res.status(403)
                return res.send({
                    errors: [
                        { msg: "Deleting a non-personal account" }
                    ]
                })
            }

            await usersTable.deleteById(userId)

            res.status(200)
            res.send()
        } catch (err) {
            res.status(500)
            res.send({ errors: [{ msg: err.message }] })
        }
    }
}

module.exports = new AccountsController()