const {
  addNewPost,
  getAllPosts,
  getPostById,
  likepost,
  dislikepost,
  addComments,
  getCommentByPost,
  deletePost,
  bookMarksPost,
} = require("../controllers/postControllers");
const upload = require("../helper/uploders");
const isAuthenticated = require("../middilwares/auth");

const postRouter = require("express").Router();

postRouter.post(
  "/addpost",
  isAuthenticated,
  upload.single("image"),
  addNewPost
);
postRouter.get("/all", isAuthenticated, getAllPosts);
postRouter.get("/userpost/all", isAuthenticated, getPostById);
postRouter.get("/:id/like", isAuthenticated, likepost);
postRouter.get("/:id/dislike", isAuthenticated, dislikepost);
postRouter.post("/:id/comment", isAuthenticated, addComments);
postRouter.post("/:id/comment/all", isAuthenticated, getCommentByPost);
postRouter.post("/delete/:id", isAuthenticated, deletePost);
postRouter.post("/:id/bookmarks", isAuthenticated, bookMarksPost);

module.exports = postRouter;
