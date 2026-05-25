require('dotenv').config()
const app = require("./src/app");
const connectDB = require("./src/DB/db")

// Connect to MongoDB
connectDB()

app.listen(3000, () => {
    console.log("Server is running on port 3000")
})