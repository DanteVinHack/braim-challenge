const RegisterRouter = require("./router.registration")
const LoginRouter = require("./router.login")
const AccountsRouter = require("./router.accounts")
const RegionsRouter = require("./router.regions")
const TypesRouter = require('./router.types');
const WeatherRouter = require("./router.weather")
const ForecastRouter = require("./router.forecast")

module.exports.LoginRouter = LoginRouter
module.exports.RegisterRouter = RegisterRouter
module.exports.AccountsRouter = AccountsRouter
module.exports.RegionsRouter = RegionsRouter
module.exports.TypesRouter = TypesRouter
module.exports.WeatherRouter = WeatherRouter
module.exports.ForecastRouter = ForecastRouter