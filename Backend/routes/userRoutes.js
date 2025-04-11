const { register, login, logout, getProfile, updateProfile, getSuggestedUsers, followUnfollow } = require("../controllers/userControllers")
const upload = require("../helper/uploders")
const isAuthenticated = require("../middilwares/auth")

const userRouter = require("express").Router()


userRouter.post('/register',register)
userRouter.post('/login',login)
userRouter.get('/logout',logout)
userRouter.get('/:id/profile',isAuthenticated, getProfile)
userRouter.post('/profile/edit',isAuthenticated,upload.single("profilePicture") , updateProfile)
userRouter.get("/suggested",isAuthenticated,getSuggestedUsers)
userRouter.get("/followunfollow/:id",isAuthenticated,followUnfollow)

module.exports = userRouter