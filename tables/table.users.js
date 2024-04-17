const db = require("../db")

class UsersPG {
    /**
     * @private
     */
    db = db

    /**
     * @param {Object} user
     * @param {Number} user.id
     * @param {String} user.firstName
     * @param {String} user.lastName
     * @param {String} user.email
     * @param {String} user.password
     * @public
     * @returns {Promise<user>}
     */
    async add(user) {
        return await new Promise((res, rej) => {
            db.query(`INSERT INTO users ("firstName", "lastName", email, password) VALUES ('${user.first_name}', '${user.last_name}', '${user.email}', '${user.password}');`, (err, result) => {
                if (err) {
                    rej(err)
                    return;
                }

                res(result)
            })
        })
    }

    /**
     * @param {String} prop
     * @param {String} value
     * @public
     * @returns {Promise<[]|null>}
     */
    async search(prop, value) {
        return await new Promise((res, rej) => {
            db.query(`SELECT * FROM users WHERE ${prop} = '${value}';`, (err, result) => {
                if (err) {
                    rej(err)
                    return;
                }

                res(result.rows)
            })
        })
    }

    /**
     * @param {Object} userInfo
     * @param {Number} userInfo.id
     * @param {String} userInfo.firstName
     * @param {String} userInfo.lastName
     * @param {String} userInfo.email
     * @param {String} userInfo.password
     * @param {Number} id
     * @public
     * @returns {Promise<userInfo|null>}
     */
    async searchById(id) {
        return await new Promise((res, rej) => {
            db.query(`SELECT "firstName", "lastName", email, id FROM users WHERE id = ${id};`, (err, result) => {
                if (err) {
                    rej(err)
                    return;
                }

                res(result.rows[0])
            })
        })
    }
    /**
     * @param {Object} userInfo
     * @param {Number} userInfo.id
     * @param {String} userInfo.firstName
     * @param {String} userInfo.lastName
     * @param {String} userInfo.email
     * @param {String} userInfo.password
     * @param {String} prop
     * @public
     * @returns {Promise<userInfo[]|null>}
     */
    async searchByProps(props, userInfo) {
        return await new Promise((res, rej) => {
            const queryArray = [`"${props}" ILIKE '${userInfo[props[0]]}%'`];

            for (let i = 1; i < props.length; i++) {
                queryArray.push(`"${props[i]}" ILIKE '${userInfo[props[i]]}%'`)
            }

            db.query(`SELECT "firstName", "lastName", email, id FROM users WHERE ${queryArray.join(" AND ")};`, (err, result) => {
                if (err) {
                    rej(err)
                    return;
                }

                res(result.rows)
            })
        })
    }

    /**
     * @param {Object} userInfo
     * @param {Number} userInfo.id
     * @param {String} userInfo.firstName
     * @param {String} userInfo.lastName
     * @param {String} userInfo.email
     * @param {String} userInfo.password
     * @param {String} prop
     * @public
     * @returns {Promise}
     */
    async updateById(userInfo) {
        return await new Promise((res, rej) => {
            this.db.query(`UPDATE users 
            SET "firstName"='${userInfo.firstName}', "lastName"='${userInfo.lastName}', email='${userInfo.email}', password='${userInfo.password}'
            WHERE id = ${userInfo.id};`, (err, result) => {
                if (err) {
                    rej(err)
                    return;
                }

                res()
            })

        })
    }

    /**
     * @param {Number} id 
     */
    async deleteById(id) {
        return await new Promise((res, rej) => {
            this.db.query(`DELETE FROM users WHERE id = ${id};`, (err, result) => {
                if (err) {
                    rej(err)
                    return;
                }

                res()
            })
        })
    }
}

module.exports = new UsersPG()