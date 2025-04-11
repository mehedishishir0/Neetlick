const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const createError = require("http-errors");
const { errorResponse } = require("./response/response");
const userRouter = require("./routes/userRoutes");
const messageRoutes = require("./routes/messageRoutes");
const postRoutes = require("./routes/postRoutes");
const postRouter = require("./routes/postRoutes");

const app = express();

// Enable CORS
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  cors({
    origin: true, //replace with your frontend URL
    credentials: true, //enable sending cookies
  })
);

// Enable cookie-parser
app.use(cookieParser());
app.use('/api/v2/user',userRouter)
app.use('/api/v2/message',messageRoutes)
app.use('/api/v2/post',postRouter)
// routes

app.get("/", (req, res) => {
  res.status(200).send("Welcome");
});

app.use((req, res, next) => {
  next(createError(404, "Page not found"));
});

app.use((err, req, res, next) => {
  errorResponse(res, {
    statusCode: err.statusCode || 500,
    message: err.message || "Internal Server Error",
  });
});
module.exports = app;
