var router = require("express").Router();
var userRouter = require('./users');
var taskRouter = require('./tasks');


//Default behavior on localhost:port/api/
router.get('/', function(req,res){
    res.json({
        message: "Welcome to Sanchit Dhiman's API for CS498! User the /users/ or /tasks/ routes to play with my API!"
    });
});

//Default behavior on localhost:port/api/users
router.use('/users',userRouter);

//Default behavior on localhost:port/api/tasks
router.use('/tasks',taskRouter);

module.exports = router; 