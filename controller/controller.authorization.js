const { validationResult } = require("express-validator")
const { usersTable } = require("../tables")

class AuthorizationController {
    async create(req, res) {
        try {
            const errors = validationResult(req);
            const user = req.body;
            console.log(user)

            if (!errors.isEmpty()) {
                return res.send({ errors: errors.array() })
            }

            const candidate = await usersTable.search("email", user.email)[0]

            if (candidate) {
                res.status(403)
                return res.send({
                    errors: [
                        {
                            type: "field",
                            value: user.email,
                            msg: "A user with this email already exists",
                            location: "database"
                        }
                    ]
                })
            }

            const newUser = await usersTable.add(user)

            res.status(201)
            res.cookie("id", newUser.id)
            res.send(newUser)
        } catch (err) {
            res.status(500)
            res.send({ errors: [{ msg: err.message }] })
        }
    }

    async login(req, res) {
        try {
            const user = req.body
            const candidate = await usersTable.search("email", user.email)[0]

            if (user.password !== candidate.password || !candidate) {
                res.status(401)
                return res.send({
                    errors: [
                        {
                            type: "authorization",
                            value: null,
                            msg: "Email or password isn't correct",
                            location: "database"
                        }
                    ]
                })
            }

            res.status(200)
            res.cookie("id", candidate.id)
            res.send({ id: candidate.id })
        } catch (err) {
            res.status(500)
            res.send({ errors: [{ msg: err.message }] })
        }
    }
}

module.exports = new AuthorizationController()