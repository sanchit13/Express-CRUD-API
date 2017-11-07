var router = require("express").Router();
var mongoose = require("mongoose");
const User = require("../models/user");

/*
    where	filter results based on JSON query
    sort	specify the order in which to sort each specified field (1- ascending; -1 - descending)
    select	specify the set of fields to include or exclude in each document (1 - include; 0 - exclude)
    skip	specify the number of results to skip in the result set; useful for pagination
    limit	specify the number of results to return (default should be 100 for tasks and unlimited for users)
    count	if set to true, return the count of documents that match the query (instead of the documents themselves)
*/

router.get('/', function (req, res) {

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

    User.find()
        .where(where)
        .sort(sort)
        .select(select)
        .skip(skip)
        .limit(limit)
        .then(function (users) {
            if (!req.query.count || req.query.count == false) {
                res.status(200).json({
                    message: "OK",
                    data: users
                });
            } else {
                res.status(200).json({
                    message: "OK - Count Requested",
                    data: users.length
                });
            }
        });
});

router.get('/:id', function (req, res) {
    //Respond with details of specified user or 404 error
    var id = req.params.id.toString();
    User.findById(id, function (err, user) {
        if (user) {
            res.status(200).json({
                message: "OK - User Found!",
                data: user
            });
        } else {
            console.log("in else")
            res.status(404).json({
                message: "User Not Found!!",
                data: []
            });
        }
    });
});


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
    } else {
        User.findByIdAndUpdate({
            _id: req.params.id
        }, req.body).then(function () {
            User.findOne({
                _id: req.params.id
            }).then(function (user) {
                res.status(201).json({
                    message: "User has been Replaced",
                    data: user
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
        } else if (user == null) {
            res.status(404).json({
                message: "User Not Found",
                data: []
            });
        }
    }).catch(next);
})


// Users cannot be created (or updated) without a name or email. All other fields that the user did not specify should be set to reasonable values.

module.exports = router;