const express = require('express')
const bodyParser = require('body-parser')
const morgan = require('morgan')
const cors = require('cors')
const session = require('express-session')
const app = express()
const Role = require("./src/backend/model/Role")
const User = require("./src/backend/model/User")
const Ride = require("./src/backend/model/Ride")
const Rating = require("./src/backend/model/Rating")

process.env.SECRET_KEY = 'secret'

app.use(session({
    secret: 'riding_center',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false }
}))
app.use(morgan('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(cors())

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
})

const path = require('path')
app.use(express.static(path.join(__dirname, 'dist/')))

app.get('/api', function (req, res) {
    res.json({ status: 'Working' })
})

Role.hasMany(User)
User.belongsTo(Role)

User.hasMany(Ride);
Ride.belongsTo(User);

Ride.hasOne(Rating);
Rating.belongsTo(Ride);


let UserController = require('./src/backend/controller/UserController')
app.use('/api/user', UserController)

let RoleController = require('./src/backend/controller/RoleController')
app.use('/api/role', RoleController)

let RideController = require('./src/backend/controller/RideController')
app.use('/api/ride', RideController)

let RatingController = require('./src/backend/controller/RatingController')
app.use('/api/rating', RatingController)

let port = process.env.PORT || 4000
app.listen(port, function () {
    console.log('Express server listening on port ' + port)
})
