const forecastTable = require("./table.forecast")
const db = require("../db")

class WeatherTable {
    /**
     * @private
     */
    db = db

    /**
     * @param {Object} weatherInfo 
     * @param {Number} weatherInfo.regionId
     * @param {String} weatherInfo.regionName
     * @param {Number} weatherInfo.temperature
     * @param {Number} weatherInfo.humidity
     * @param {Number} weatherInfo.windSpeed
     * @param {String} weatherInfo.weatherCondition
     * @param {Number} weatherInfo.precipitationAmount
     * @param {Date} weatherInfo.measurementDateTime
     * @param {Number[]} weatherInfo.weatherForecast
     */
    async add(
        { regionId, temperature, humidity, windSpeed, weatherCondition, precipitationAmount, measurementDateTime, weatherForecast }
    ) {
        return await new Promise((res, rej) => {
            this.db.query(`INSERT INTO weather ("regionId", temperature, humidity, "windSpeed", "weatherCondition", "precipitationAmount", "measurementDateTime")
            VALUES
            (${regionId}, ${temperature}, ${humidity}, ${windSpeed}, '${weatherCondition}', ${precipitationAmount}, '${measurementDateTime}')  RETURNING id;`,
                async (err, result) => {
                    if (err) {
                        rej(err)
                        return
                    }

                    const weather = await this.searchById(result.rows[0].id)

                    if (weatherForecast.length <= 0) {
                        res(weather)
                        return
                    }

                    for (let i = 0; i < weatherForecast.length - 1; i++) {
                        const id = weatherForecast[i]
                        await forecastTable.updateById(id, { weatherId: weather.id })
                    }

                    const lastId = weatherForecast[weatherForecast.length - 1]
                    await forecastTable.updateById(lastId, { weatherId: weather.id })
                    res(weather)
                })
        })
    }


    /**
     * @param {Number} id 
     * @returns 
     */
    async searchById(id) {
        return await new Promise((res, rej) => {
            this.db.query(`SELECT * FROM weather WHERE id = ${id}`, (err, result) => {
                if (err) {
                    rej(err)
                    return
                }

                res(result.rows[0])
            })
        })
    }

    /**
     * @param {Number} regionId 
     */
    async searchByRegionId(regionId) {
        return await new Promise((res, rej) => {
            this.db.query(`
        SELECT 
        weather."regionId" as "id", regions.name as "regionName", weather.temperature, humidity, "windSpeed", "weatherCondition", 
        "precipitationAmount", "measurementDateTime" FROM weather 
        JOIN regions ON weather."regionId" = ${regionId} AND regions.id = weather."regionId"`,
                (err, result) => {
                    if (err) {
                        rej(err)
                        return
                    }

                    res(result.rows[0])
                })
        })
    }

    /**
     * @param {Objectj} weatherInfo
     * @param {ReturnType<new Date().toIsoFormant>} weatehrInfo.startDateTime
     * @param {ReturnType<new Date().toIsoFormant>} weatehrInfo.endDateTime
     * @param {ReturnType<"CLOUDY", "CLEAR">} weatehrInfo.weatherCondition
     * @param {Number} weatehrInfo.regionId
     * @returns 
     */
    async searchByProps({ endDateTime, startDateTime, regionId, weatherCondition }) {
        return await new Promise((res, rej) => {
            let queryArray = [
                startDateTime ? `"measurementDateTime" >= '${startDateTime}'` : "",
                endDateTime ? `"measurementDateTime" <= '${endDateTime}'` : "",
                regionId ? `"regionId" = ${regionId}` : "",
                weatherCondition ? `"weatherCondition" = '${weatherCondition}'` : ""
            ].filter(item => item != "")

            console.log("query array: ", queryArray);

            this.db.query(`
            SELECT * from weather
            WHERE ${queryArray.join(" AND ")}
            ${weatherCondition ? `"weatherCondition" = '${weatherCondition}'` : ""} 
            `, (err, result) => {
                if (err) {
                    rej(err)
                    return
                }

                res(result.rows)
            })
        })
    }

    /**
     * @param {Object} weatherInfo 
     * @param {Number} weatherInfo.regionId
     * @param {String} weatherInfo.regionName
     * @param {Number} weatherInfo.temperature
     * @param {Number} weatherInfo.humidity
     * @param {Number} weatherInfo.windSpeed
     * @param {String} weatherInfo.weatherCondition
     * @param {Number} weatherInfo.precipitationAmount
     * @param {Date} weatherInfo.measurementDateTime
     * @param {Number[]} weatherInfo.weatherForecast
     */
    async updateByRegionId(instanseRegionId,
        { regionId, temperature, humidity, windSpeed, weatherCondition, precipitationAmount, measurementDateTime, weatherForecast }
    ) {
        return await new Promise((res, rej) => {
            this.db.query(`
UPDATE weather SET
"regionId" = '${regionId}', temperature = ${temperature}, humidity = ${humidity}, "windSpeed" = ${windSpeed}, "weatherCondition" = '${weatherCondition}', "precipitationAmount" = ${precipitationAmount}, "measurementDateTime" = '${measurementDateTime}'
WHERE "regionId" = ${instanseRegionId} RETURNING id;`,
                async (err, result) => {
                    if (err) {
                        rej(err)
                        return
                    }

                    console.log(result);
                    const weather = await this.searchById(result.rows[0].id)

                    if (weatherForecast.length <= 0) {
                        res(weather)
                        return
                    }

                    for (let i = 0; i < weatherForecast.length - 1; i++) {
                        const id = weatherForecast[i]
                        await forecastTable.updateById(id, { weatherId: weather.id })
                    }

                    const lastId = weatherForecast[weatherForecast.length - 1]
                    await forecastTable.updateById(lastId, { weatherId: weather.id })
                    res(weather)
                })
        })
    }

    /**
     * @param {Number} regionId 
     */
    async deleteByRegionId(regionId) {
        return await new Promise((res, rej) => {
            this.db.query(`DELETE FROM weather WHERE "regionId" = ${regionId}`, (err) => {
                if (err) {
                    rej(err)
                    return
                }
            })
        })
    }
}

module.exports = new WeatherTable()