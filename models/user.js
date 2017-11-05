// Load required packages
var mongoose = require('mongoose');

// Define our user schema
var UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name field is required"]
    },
    email: {
        type : String,
        required: [true, "Email field is required"],
        unique : [true, "Email already Exists"],
    },
    pendingTasks : {
        type : String,
        default : "None"
    },
    dateCreated : {
        type: Date, 
        default: Date.now
    }
});

// Export the Mongoose model
module.exports = mongoose.model('User', UserSchema);
