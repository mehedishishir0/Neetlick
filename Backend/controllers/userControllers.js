const cloudinary = require("../config/clodunary");
const createError = require("http-errors");
const User = require("../models/userModels");
const bycreptjs = require("bcryptjs");
const { successResponse } = require("../response/response");
const jwt = require("jsonwebtoken");
const getDataUri = require("../helper/datauri");
const createJwtToken = require("../helper/createJwtToken");
const Post = require("../models/postsModel");

exports.register = async (req, res, next) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !password || !email) {
      throw createError(401, "All fields are required");
    }

    // check if user already exists
    const user = await User.findOne({ username });
    if (user) {
      throw createError(409, "Username already exists");
    }
    const hashPassword = await bycreptjs.hash(password, 10);
    await User.create({
      username,
      email,
      password: hashPassword,
    });
    successResponse(res, {
      statusCode: 201,
      message: "User registered successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      throw createError(401, "All fields are required");
    }
    let user = await User.findOne({ email });
    if (!user) {
      throw createError(404, "User not found");
    }
    const isMatch = await bycreptjs.compare(password, user.password);
    if (!isMatch) {
      throw createError(401, "Invalid credentials");
    }
    const token = createJwtToken(
      { userId: user._id },
      process.env.JWT_SECRET_KEY,
      "1d"
    );
    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "strict",
      maxAge: 1 * 24 * 60 * 60 * 1000,
    });
    const populatedPost = await Promise.all(
      user.posts.map(async (postId) => {
        const post = await Post.findById(postId);
        if (post.author.equals(user._id)) {
          return post;
        }
        return null;
      })
    );

    user = {
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePic: user.profilePicture,
      bio: user.bio,
      followers: user.followers,
      following: user.following,
      posts: user.posts,
    };
    successResponse(res, {
      statusCode: 200,
      message: "User logged in successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

exports.logout = (req, res, next) => {
  try {
    res.clearCookie("token", {
      httpOnly: true,
      sameSite: "strict",
      expires: new Date(0),
    });
    successResponse(res, {
      statusCode: 200,
      message: "User logged out successfully",
    });
  } catch (error) {
    next(error);
  }
};

exports.getProfile = async (req, res, next) => {
  try {
    const userId = req.params.id;
    const user = await User.findById(userId).select("-password");
    if (!user) {
      throw createError(404, "User not found");
    }

    successResponse(res, {
      statusCode: 200,
      message: "User profile fetched successfully",
      data: user,
    });
  } catch (error) {
    next(error);
  }
};

exports.updateProfile = async (req, res, next) => {
  try {
    const userId = req.userid;
    const { bio, gender } = req.body;
    const profilePicture = req.file;

    const user = await User.findById(userId);
    if (!user) {
      throw createError(404, "User not found");
    }
    if (profilePicture) {
      const profilePicUrl = await cloudinary.uploader.upload(
        profilePicture.path,
        {
          folder: "instagram/profile_Pic",
        }
      );
      user.profilePicture = profilePicUrl.secure_url;
    }
    if (bio) user.bio = bio;
    if (gender) user.gender = gender;
    await user.save();
    const updatedUser = await User.findById(userId).select("-password");
    successResponse(res, {
      statusCode: 200,
      message: "User profile updated successfully",
      data: updatedUser,
    });
  } catch (error) {
    next(error);
  }
};

exports.getSuggestedUsers = async (req, res, next) => {
  try {
    const suggestedUser = await User.find({ _id: { $ne: req.userId } }).select(
      "-password"
    );
    suggestedUser.sort(() => 0.5 - Math.random());
    if (!suggestedUser) {
      throw createError(404, "No suggested users found");
    }
    successResponse(res, {
      statusCode: 200,
      message: "Suggested users fetched successfully",
      data: suggestedUser,
    });
  } catch (error) {
    next(error);
  }
};

exports.followUnfollow = async (req, res, next) => {
  try {
    const sendFollow = req.userid;
    const receiveFollow = req.params.id;
    if (sendFollow === receiveFollow) {
      throw createError(400, "You cannot follow yourself");
    }
    const user = await User.findById(sendFollow);
    const targetUser = await User.findById(receiveFollow);

    if (!user || !targetUser) {
      throw createError(404, "User not found");
    }
    if (user.following.includes(receiveFollow)) {
      await Promise.all([
        User.findByIdAndUpdate(sendFollow, {
          $pull: { following: receiveFollow },
        }),
        User.findByIdAndUpdate(receiveFollow, {
          $pull: { followers: sendFollow },
        }),
      ]);
      successResponse(res, {
        statusCode: 200,
        message: "unfollowed successfully",
      });
    } else {
      await Promise.all([
        User.findByIdAndUpdate(sendFollow, {
          $push: { following: receiveFollow },
        }),
        User.findByIdAndUpdate(receiveFollow, {
          $push: { followers: sendFollow },
        }),
      ]);
      successResponse(res, {
        statusCode: 200,
        message: "followed successfully",
      });
    }
  } catch (error) {
    next(error);
  }
};
