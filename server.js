const express = require("express")
const cors = require("cors")
const cookieParser = require("cookie-parser")

const app = express()

const { RegisterRouter, LoginRouter, AccountsRouter, RegionsRouter, TypesRouter, WeatherRouter, ForecastRouter } = require("./routers")
const PORT = 7000

app.use(express.json())
app.use(cookieParser())
app.use("/", RegisterRouter)
app.use("/", RegionsRouter)
app.use("/", LoginRouter)
app.use("/", AccountsRouter)
app.use("/region", TypesRouter)
app.use("/region", WeatherRouter)
app.use("/region/weather", ForecastRouter)
app.use(cors)

app.get(["/", "/api/health"], (req, res) => {
    res.send({ message: "OK", uptime: process.uptime() });
    console.log('Logger');
  });

app.listen(PORT, "localhost", async err => {
    if (err) {
        console.log(err.message)
    }

    console.log(`Server start on port: ${PORT}`)
})