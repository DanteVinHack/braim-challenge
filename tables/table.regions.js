const db = require("../db")

class RegionsDB {
    /**
     * @private
     */
    db = db

    /**
     * @param {Object} region
     * @param {Number} region.accountId
     * @param {String} region.name
     * @param {String} region.parentRegion
     * @param {Number} region.accountId
     * @param {Number} region.latitude
     * @param {Number} region.longitude
     * @returns {Promise<>} 
     */
    async add(region) {
        return await new Promise((res, rej) => {
            let valuesString;
            if (region?.parentRegion) {
                valuesString = `('${region.accountId}', '${region.name}', '${region.parentRegion}', '${region.latitude}', '${region.longitude}')`
            } else {
                valuesString = `('${region.accountId}', '${region.name}', null, '${region.latitude}', '${region.longitude}')`
            }

            this.db.query(`INSERT INTO regions(
                accountId, name, parentregion, latitude, longitude
            ) values ${valuesString}`, (err, result) => {
                if (err) {
                    rej(err)
                    return
                }

                res(result)
            })
        })
    }

    /**
     * @param {Object} regionInfo
     * @param {Number} regionInfo.accountId
     * @param {String} regionInfo.name
     * @param {String} regionInfo.parentRegion
     * @param {Number} regionInfo.accountId
     * @param {Number} regionInfo.latitude
     * @param {Number} regionInfo.longitude
     * @param {String[]} props
     * @returns {Promise<>} 
     */
    async searchByProps(props, regionInfo) {
        return await new Promise((res, rej) => {
            let queryString = `${props[0]} = '${regionInfo[props[0]]}' `

            for (let i = 1; i < props.length; i++) {
                queryString += `AND ${props[i]} = '${regionInfo[props[i]]} '`
            }

            this.db.query(`SELECT id, name, parentregion, latitude, longitude FROM regions WHERE ${queryString};`, (err, result) => {
                if (err) {
                    rej(err)
                    return;
                }

                res(result.rows[0])
            })
        })
    }

    /**
     * @param {String} prop 
     * @param {String} value 
     * @returns {Promise<[]|null>}
     */
    async search(prop, value) {
        return await new Promise((res, rej) => {
            this.db.query(`SELECT * FROM regions WHERE ${prop} = '${value}'`, (err, result) => {
                if (err) {
                    rej(err)
                    return
                }

                res(result.rows)
            })
        })
    }

    /**
     * @param {Number} id
     * @returns {Promise<{regionType: Number}|null>}
     */
    async searchById(id) {
        return await new Promise((res, rej) => {
            this.db.query(`SELECT id as "regionType", accountId as "accountId", name, parentRegion as "parentRegion", latitude, longitude FROM regions WHERE id = ${id};`,
                (err, result) => {
                    if (err) {
                        rej(err)
                        return;
                    }

                    res(result.rows[0])
                })
        })
    }

    /**
     * @param {Object} regionInfo
     * @param {Number} regionInfo.id
     * @param {String} regionInfo.name
     * @param {String} regionInfo.parentRegion
     * @param {Number} regionInfo.latitude
     * @param {Number} regionInfo.longitude
     * @returns {Promise}
    */
    async updateById({ id, name, parentRegion, latitude, longitude }) {
        return await new Promise((res, rej) => {
            this.db.query(`UPDATE regions 
                SET name = '${name}', parentRegion='${parentRegion}', latitude='${latitude}', longitude='${longitude}'
                WHERE id = ${id};`, (err, result) => {
                if (err) {
                    rej(err)
                }

                res(result)
            })

        })
    }

    /**
     * @param {Number} id 
     */
    async deleteById(id) {
        return await new Promise((res, rej) => {
            this.db.query(`DELETE FROM regions WHERE id = ${id};`, (err, result) => {
                if (err) {
                    rej(err)
                    return;
                }

                res()
            })
        })
    }
}

module.exports = new RegionsDB()