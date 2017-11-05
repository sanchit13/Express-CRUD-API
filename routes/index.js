var express = require("express");
var router = express.Router();
var apiRouter = require('./api');
var secrets = require('../config/secrets');


// Default Route
router.get('/',function(req,res){
    var connectionString = secrets.token;
    res.json({ message: 'My connection string is ' + connectionString });
});

//API Route
router.use('/api',apiRouter);

module.exports = router;