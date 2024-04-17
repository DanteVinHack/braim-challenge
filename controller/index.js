const regionsController = require("./controller.regions")
const authorizationController = require("./controller.authorization")
const accountsController = require("./controller.accounts")
const typesController = require("./controller.types")
const weatherController = require("./controller.wheather")
const forecastController = require("./controller.forecast")

module.exports.accountsController = accountsController
module.exports.authorizationController = authorizationController
module.exports.regionsController = regionsController
module.exports.typesController = typesController
module.exports.weatherController = weatherController
module.exports.forecastController = forecastController