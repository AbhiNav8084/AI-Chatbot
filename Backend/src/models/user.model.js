const mongoose = require("mongoose");


const userSchema = new mongoose.Schema({
    email:{
        type: String,
        required: [ true, "Email is required"],
        unique: true
    },
    fullName:{
        firstName:{
            type: String,
            required: [true, "FirstName is required"],
        },
        lastName:{
            type: String,
            required: [true, "lastName is required"],
        }
    },
    password:{
        type: String,
    }
},{
    timestamps: true
})

const userModel = mongoose.model("user", userSchema)


module.exports = userModel