// Load required packages
var mongoose = require('mongoose');

// Define our user schema
var TaskSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name field is required"]
    },
    deadline: {
        type: Date,
        required: [true, "Deadline field is required"]
    },
    completed: {
        type: Boolean,
        default: false
    },
    assignedUser: {
        type: String,
        default: ""
    },
    assignedUserName: {
        type: String,
        default: "unassigned"
    },

    description: {
        type: String,
        default: "Not Available"
    },
    
    dateCreated: {
        type: Date,
        default: Date.now
    }
});

// Export the Mongoose model
module.exports = mongoose.model('Task', TaskSchema);