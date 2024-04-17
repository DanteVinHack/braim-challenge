const db = require("../db")

class TypesTable {
    /**
     * @private
     */
    db = db


    /**
     * @param {Object} type 
     * @param {String} type.type
     * @returns {Promise<null>}
     */
    async add({ type }) {
        return await new Promise((res, rej) => {
            this.db.query(`INSERT INTO types (type) VALUES ('${type}');`, (err, result) => {
                if (err) {
                    rej(err)
                    return
                }

                res()
            })
        })
    }

    /**
     * @param {Object} type
     * @param {Number} type.id
     * @param {String} type.type
     * @param {String} prop
     * @param {String} value
     * @returns {Promise<type[]|null>}
     */
    async search(prop, value) {
        return await new Promise((res, rej) => {
            this.db.query(`SELECT * FROM types WHERE ${prop} = '${value}'`, (err, result) => {
                if (err) {
                    rej(err)
                    return
                }

                res(result.rows)
            })
        })
    }

    /**
     * @param {Object} type
     * @param {Number} type.id
     * @param {String} type.type
     * @param {Number} id 
     * @return {Promise<type|null>}
     */
    async searchById(id) {
        return await new Promise((res, rej) => {
            this.db.query(`SELECT * FROM types WHERE id = ${id}`, (err, result) => {
                if (err) {
                    rej(err)
                    return
                }

                res(result.rows[0])
            })
        })
    }

    /**
     * @param {Object} type
     * @param {Number} type.id
     * @param {String} type.type
     * @return {Promise<type|null>}
     */
    async updateById({ type, id }) {
        return await new Promise((res, rej) => {
            this.db.query(`UPDATE types SET type='${type}' WHERE id = ${id}`, (err, result) => {
                if (err) {
                    rej(err)
                    return
                }

                res()
            })
        })
    }

    /**
    * @param {Number} id 
    * @return {Promise<null>}
    */
    async deleteById(id) {
        return await new Promise((res, rej) => {
            this.db.query(`DELETE FROM types WHERE id = ${id}`, (err, result) => {
                if (err) {
                    rej(err)
                    return
                }

                res()
            })
        })
    }
}

module.exports = new TypesTable()