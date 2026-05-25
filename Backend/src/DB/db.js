const mongoose = require("mongoose");


async function connectDB() {
    try {
        await mongoose.connect(process.env.MONGO_URI)

        console.log("Server is connected to Database")
    } catch (err) {
        console.error("Error connecting to DB", err)
        process.exit(1)
    }
}

module.exports = connectDB