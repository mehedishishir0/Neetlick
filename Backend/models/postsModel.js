const mongoose = require("mongoose")

const postSchema = new mongoose.Schema({
  caption:{
    type: String,
    required: true,
  },
  image:{
    type: String,
    required: true,
  },
  author:{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  likes:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  }],
  comments:[{
    type: mongoose.Schema.Types.ObjectId,
    ref: "Comment",
    required: true,
  }]
},{timestamps:true})

module.exports =  mongoose.model("Post", postSchema)