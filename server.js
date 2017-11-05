// Get the packages we need
var express = require('express'),
    router = express.Router(),
    mongoose = require('mongoose'),
    secrets = require('./config/secrets'),
    bodyParser = require('body-parser');

// Create our Express application
var app = express();


// Use environment defined port or 3000
var port = process.env.PORT || 3000;

// Connect to a MongoDB
mongoose.connect(secrets.mongo_connection, {
    useMongoClient: true
});
mongoose.Promise = global.Promise;

// Allow CORS so that backend and frontend could be put on different servers
var allowCrossDomain = function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "X-Requested-With, X-HTTP-Method-Override, Content-Type, Accept");
    res.header("Access-Control-Allow-Methods", "POST, GET, PUT, DELETE, OPTIONS");
    next();
};
app.use(allowCrossDomain);

// Use the body-parser package in our application
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());

// Use routes as a module (see index.js)
app.use('/', require("./routes/"));

//Error Handlings
app.use(function (err, req, res, next) {

    if (err.name == "CastError") {
        if (err.model.modelName == "Task") {
            res.status(404).json({
                message: "Task Not Found",
                data: []
            });
        } else {
            res.status(404).json({
                message: "User Not Found",
                data: []
            });
        }
    } else if (err.code == 11000) {
        res.status(404).json({
            message: "This email already exists",
            data: []
        });
    } else {
        res.status(404).json({
            message: err.message,
            data: []
        })
    }
});

// Start the server
app.listen(port);
console.log('Server running on port ' + port);