var router = require("express").Router();
var mongoose = require("mongoose");
const Task = require("../models/task");

router.get('/', function (req, res) {
    // This function responds with a List of tasks
    var limit = Number(req.query.limit || 1000000000);
    var skip = Number(req.query.skip || 0);
    var sort = req.query.sort || null;
    var select = req.query.sort || null;
    var where = req.query.where || null;

    if(where){
        where = JSON.parse(where);
    }
    if(sort){
        sort = JSON.parse(sort);
    }
    if(select){
        select= JSON.parse(select);
    }

    Task.find()
        .where(where)
        .sort(sort)
        .select(select)
        .skip(skip)
        .limit(limit)
        .then(function (tasks) {
            if (!req.query.count || req.query.count == false) {
                res.status(200).json({
                    message: "OK",
                    data: tasks
                });
            } else {
                res.status(200).json({
                    message: "OK - Count Requested",
                    data: tasks.length
                });
            }
        });
});

router.get('/:id', function (req, res) {
    //Respond with details of specified task or 404 error
    var id = req.params.id.toString();
    Task.findById(id, function (err, task) {
        if (task) {
            res.status(200).json({
                message: "OK - Task Found!",
                data: task
            });
        } else {
            console.log("in else")
            res.status(404).json({
                message: "Task Not Found!!",
                data: []
            });
        }
    });
});



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