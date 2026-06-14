require('dotenv').config();
const app = require("./src/app");
const connectDB = require("./src/DB/db");
const initSocketServer = require("./src/sockets/socket.server");
const httpServer = require("http").createServer(app);



connectDB();
initSocketServer(httpServer);

const PORT = process.env.PORT || 3000;

httpServer.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
})
