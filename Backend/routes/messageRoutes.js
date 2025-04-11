const { sendMessage, getMessage } = require("../controllers/messageControllers")

const messageRoutes = require("express").Router()


messageRoutes.post(`/send/:id`,sendMessage)
messageRoutes.post(`/all/:id`,getMessage)

module.exports = messageRoutes