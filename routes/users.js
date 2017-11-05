var router = require("express").Router();
var mongoose = require("mongoose");
const User = require("../models/user");


router.get('/', function (req, res) {
    // This function returns all users in the database!
    res.status(200).json({
        message: "OK",
        data : []
    });
})

router.get('/:id', function (req, res) {
    //Respond with details of specified user or 404 error
    res.status(200).json({
        message: req.params.id,
        data : []
    });
    //"message": "User not found"
})


router.post('/', function (req, res, next) {
    //Create a new user. Respond with details of new user or tell them that user already exists
    //"message": "Validation Error: A name is required! "
    //"message": "Validation Error: An email is required! ",
    //"message": "This email already exists",
    User.create(req.body).then(function (user) {
        res.status(201).json({
            message: "OK - User Created",
            data: user
        });
    }).catch(next);
});

router.put('/:id', function (req, res, next) {
    //Replace entire user with supplied user or 404 error
    //Response should be either User not found or "User has been Replaced"
    //"message": "User not found"
    
    if (!req.body.name && !req.body.email) {
        res.status(404).json({
            message: "Please provide either a name in order to update the User",
            data: []
        });
    } 

    else {
        User.findByIdAndUpdate({
            _id: req.params.id
        }, req.body).then(function () {
            User.findOne({_id:req.params.id}).then(function(user){
               res.status(201).json({
                   message : "User has been Replaced",
                   data : user
               });
            });
        }).catch(next);
    }
});

router.delete('/:id', function (req, res, next) {
    //Delete specified user or 404 error
    //Response should be either User not found or "User has been Deleted"
    User.findByIdAndRemove({
        _id: req.params.id
    }).then(function (user, err) {
        console.log(user);
        if (user) {
            res.status(200).json({
                message: "This User has been Deleted",
                data: user
            });
        }
        else if(user == null){
            res.status(404).json({
                message : "User Not Found",
                data : []
             });
        }
    }).catch(next);
})


// Users cannot be created (or updated) without a name or email. All other fields that the user did not specify should be set to reasonable values.

module.exports = router;