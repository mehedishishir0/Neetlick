require('dotenv').config()
const app = require("./app");
const connectDb = require('./config/db');

const port = process.env.PORT || 8001
app.listen(port,()=>{
    connectDb()
    console.log(`Server running on http://localhost:${port}`)  // Log the server is running on the specified port
})