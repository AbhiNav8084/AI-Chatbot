const userModel = require("../models/user.model");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")


async function registerUser(req, res) {

    const { fullName: { firstName, lastName }, email, password } = req.body;

    const isUserAlreadyExists = await userModel.findOne({ email })

    if (isUserAlreadyExists) {
        return res.status(400).json({
            message: "User already exists"
        })
    }

    const hashPassword = await bcrypt.hash(password, 10)

    const user = await userModel.create({
        fullName: {
            firstName, lastName
        },
        email,
        password: hashPassword
    })

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

    res.cookie("token", token)

    res.status(201).json({
        message: "User registered successfully",
        user:{
            email: user.email,
            _id: user._id,
            fullName: user.fullName
        }
    })
}



module.exports={
    registerUser
}