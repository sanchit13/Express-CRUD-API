var router = require("express").Router();
var mongoose = require("mongoose");
const Task = require("../models/task");

router.get('/', function (req, res) {
    // This function responds with a List of tasks
    res.json({
        message: "Tasks GET request",
        data : []
    });
})

router.get('/:id', function (req, res) {
    //Respond with details of specified task or 404 error
    res.json({
        message: req.params.id,
        data : []
    });
})



//Done
router.post('/', function (req, res, next) {
    //Create a new task.Respond with details of new task or tell them that task already exists

    if (!req.body.name && !req.body.deadline) {
        res.status(404).json({
            message: "Please provide either a name or deadline in order to create the Task",
            data: []
        });
    } 

    Task.create(req.body).then(function (task) {
        res.status(201).json({
            message: "OK - Task Created",
            data: task
        });
    }).catch(next);
});


//Done
router.put('/:id', function (req,res,next) {
    //Replace entire task with supplied ysdk or 404 error
    //Response should be either ysdk not found or "Task has been Replaced"
     
    if (!req.body.name && !req.body.deadline) {
        res.status(404).json({
            message: "Please provide either a name or deadline in order to update the Task",
            data: []
        });
    } 

    else {
        Task.findByIdAndUpdate({
            _id: req.params.id
        }, req.body).then(function () {
            Task.findOne({_id:req.params.id}).then(function(task){
               res.status(201).json({
                   message : "Task has been Replaced",
                   data : task
               });
            });
        }).catch(next);
    }
})

//Done
router.delete('/:id', function (req, res, next) {
    //Delete specified Task or 404 error
    //Response should be either Task not found or "Task has been Deleted"
    Task.findByIdAndRemove({
        _id: req.params.id
    }).then(function (task, err) {
        if (task) {
            res.status(200).json({
                message: "This Task has been Deleted",
                data: task
            });
        } else if (task == null) {
            res.status(404).json({
                message: "Task Not Found",
                data: []
            });
        }
    }).catch(next);
})


module.exports = router;