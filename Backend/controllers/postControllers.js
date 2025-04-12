const Comments = require("../models/commentsModel");
const { successResponse } = require("../response/response");
const cloudinary = require("../config/clodunary");
const Post = require("../models/postsModel");
const User = require("../models/userModels");
const sharp = require("sharp");

exports.addNewPost = async (req, res, next) => {
  try {
    const { caption } = req.body;
    const image = req.file;
    const authorId = req.userid;

    if (!image) {
      throw createError(400, "please provide an image");
    }
    // const user = await User
    const optimizedImage = await sharp(image.buffer)
      .resize({
        width: 800,
        height: 800,
        withoutEnlargement: true,
        fit: "inside",
      })
      .withMetadata()
      .jpeg({ quality: 80 })
      .toBuffer();

    const fileuri = `data:image/jpeg;base64,${optimizedImage.toString(
      "base64"
    )}`;
    const response = await cloudinary.uploader.upload(fileuri);
    console.log(response);
    const post = await Post.create({
      caption,
      image: response.secure_url,
      author: authorId,
    });

    const user = await User.findById(authorId);
    if (user) {
      user.posts.push(post._id);
      await user.save();
    }
    await post.populate({ path: "author", select: "-password" });
    successResponse(res, {
      statusCode: 201,
      message: "Post created successfully",
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

exports.getAllPosts = async (req, res, next) => {
  try {
    const post = await Post.find()
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        options: { sort: { createdAt: -1 } }, // ✅ correct way to sort nested
        populate: {
          path: "author",
          select: "username profilePicture",
        },
      });

    successResponse(res, {
      statusCode: 200,
      message: "Posts fetched successfully",
      data: post,
    });
  } catch (error) {
    next(error);
  }
};

exports.getPostById = async (req, res, next) => {
  try {
    const authorId = req.userId;
    const posts = await Post.find({ author: authorId })
      .sort({ createdAt: -1 })
      .populate({ path: "author", select: "username profilePicture" })
      .populate({
        path: "comments",
        sort: { createdAt: -1 }.populate({
          path: "author",
          select: "username profilePicture",
        }),
      });

    successResponse(res, {
      statusCode: 200,
      message: "Posts fetched successfully",
      data: posts,
    });
  } catch (error) {
    next(error);
  }
};

exports.likepost = async (req, res, next) => {
  try {
    const sendLike = req.userid;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      throw createError(404, "Post not found");
    }
    await post.updateOne({ $addToSet: { likes: sendLike } });
    await post.save();

    successResponse(res, {
      statusCode: 200,
      message: "Post liked successfully",
    });
  } catch (error) {
    next(error);
  }
};
exports.dislikepost = async (req, res, next) => {
  try {
    const sendLike = req.userid;
    const postId = req.params.id;
    const post = await Post.findById(postId);
    if (!post) {
      throw createError(404, "Post not found");
    }
    await post.updateOne({ $pull: { likes: sendLike } });
    await post.save();

    successResponse(res, {
      statusCode: 200,
      message: "Post disliked ",
    });
  } catch (error) {
    next(error);
  }
};

exports.addComments = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const sendComment = req.userid;
    const { text } = req.body;
    if (!text) {
      throw createError(400, "Please provide a comment");
    }
    const post = await Post.findById(postId);
    if (!post) {
      throw createError(404, "Post not found");
    }
    const comment = await Comments.create({
      author: sendComment,
      text,
      post: postId,
    });
    post.comments.push(comment._id);
    await post.save();
    successResponse(res, {
      statusCode: 201,
      message: "Comment added successfully",
      data: comment,
    });
  } catch (error) {
    next(error);
  }
};
exports.getCommentByPost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const commnets = await Comments.find({ post: postId }).populate(
      "author",
      "username profilePicture"
    );
    if (!commnets) {
      throw createError(404, "Comments not found");
    }
    successResponse(res, {
      statusCode: 200,
      message: "Comments fetched successfully",
      data: commnets,
    });
  } catch (error) {}
};

exports.deletePost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const authorId = req.userid;
    const post = await Post.findById(postId);
    if (!post) {
      throw createError(404, "Post not found");
    }
    if (String(post.author) !== String(authorId)) {
      throw createError(403, "You are not authorized to delete this post");
    }
    await Post.findByIdAndDelete(postId);
    let user = await User.findById(authorId);
    user.posts = user.posts.filter((id) => id.toString() !== postId);
    await user.save();
    await Comments.deleteMany({ post: postId });

    successResponse(res, {
      statusCode: 200,
      message: "Post deleted successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.bookMarksPost = async (req, res, next) => {
  try {
    const postId = req.params.id;
    const authorId = req.userid;
    const post = await Post.findById(postId);
    if (!post) {
      throw createError(404, "Post not found");
    }
    const user = User.findById(authorId);
    if (user.bookmarks.includes(post._id)) {
      await user.updateOne({ $pull: { bookmarks: post._id } });
      await user.save();
      successResponse(res, {
        statusCode: 200,
        message: "Post removed from bookmarks",
      });
    } else {
      await user.updateOne({ $addToSet: { bookmarks: post._id } });
      await user.save();
      successResponse(res, {
        statusCode: 200,
        message: "Post added to bookmarks",
      });
    }
  } catch (error) {
    next(error);
  }
};
