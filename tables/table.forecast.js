const db = require("../db")

class ForecastTable {
    /**
     * @private
     */
    db = db

    /**
     * @param {Object} forecast
     * @param {Number} forecast.temperature
     * @param {Date} forecast.dateTime
     * @param {String} forecast.weatherCondition
     * @param {Number} forecast.regionId
     */
    async add({ temperature, dateTime, weatherCondition, regionId }) {
        return await new Promise((res, rej) => {
            this.db.query(`
INSERT INTO forecast (temperature, "dateTime", "weatherCondition")
    VALUES (${temperature}, '${dateTime}', '${weatherCondition}') RETURNING id`, (err, result) => {
                if (err) {
                    rej(err)
                    return
                }
                const forecastId = result.rows[0].id
                this.db.query(`INSERT INTO regionsforecast (forecastid, regionid) VALUES (${forecastId}, ${regionId})`, (err) => {
                    if (err) {
                        rej(err)
                        return
                    }
                    res(forecastId)
                })
            })
        })
    }

    /**
     * @param {Number} id 
     */
    async searchById(id) {
        return await new Promise((res, rej) => {
            this.db.query(`SELECT forecast.id, forecast."dateTime", forecast.temperature, forecast."weatherCondition", weather."regionId"
            FROM forecast JOIN weather ON weather.id = forecast.weatherid WHERE forecast.id = ${id};`, (err, result) => {
                if (err) {
                    rej(err)
                    return
                }

                res(result.rows[0])
            })
        })
    }

    /**
     * @param {Number} id 
     */
    async searhByWeatherId(id) {
        return await new Promise((res, rej) => {
            this.db.query(`
        SELECT forecast.id, forecast."weatherCondition", forecast.temperature, forecast."dateTime"
        FROM forecast JOIN weather ON weatherId = weather.id`, (err, result) => {
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
     * @param {Object} forecast
     * @param {Number} forecast.temperature
     * @param {Date} forecast.dateTime
     * @param {Number} forecast.weatherId
     * @param {String} forecast.weatherCondition
     */
    async updateById(id, forecast) {
        return await new Promise((res, rej) => {
            const query = [
                forecast.temperature ? `temperature = ${forecast.temperature}` : "",
                forecast.dateTime ? `"dateTime" = '${forecast.dateTime}'` : "",
                forecast.weatherCondition ? `"weatherCondition" = '${forecast.weatherCondition}'` : "",
                forecast.weatherId ? `weatherId = ${forecast.weatherId}` : "",
            ].filter(item => item != "")

            this.db.query(
                `UPDATE forecast SET ${query.join(", ")} WHERE id = ${id}`,
                (err, result) => {
                    if (err) {
                        rej(err)
                    }

                    res(id)
                })
        })
    }

    /**
     * @param {Number} id 
     */
    async deleteById(id) {
        return await new Promise((res, rej) => {
            this.db.query(`DELETE FROM forecast WHERE "id" = ${id};`, err => {
                if (err) {
                    console.log(err);
                    rej(err)
                    return 
                }
                res()
            })
        })
    }
}

module.exports = new ForecastTable()