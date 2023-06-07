var express = require('express')
var path = require('path')
require('dotenv').config()

var app = express()

var mustacheExpress = require('mustache-express')
var engine = mustacheExpress()
app.engine('mustache', engine)

app.set('views', path.join(__dirname), 'views')
app.set('view engine', 'mustache')

app.use(express.json())
app.use(express.urlencoded({ extended: false}))
app.use(express.static(path.join(__dirname, 'public')))

app.use("/install", require("./control/InstallAPI"))
//app.use("/user", require("./control/UserAPI"))
//app.use("/pokemon", require("./control/PokemonAPI"))
//app.use("/trainer", require("./control/TrainerAPI"))
//app.use("/pokeball", require("./control/PokeballAPI"))

app.listen(3000, () => { console.log("Listenning") })