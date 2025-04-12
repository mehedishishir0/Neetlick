"use client";
import { Button } from "@/components/ui/button";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { FaHeart, FaRegHeart } from "react-icons/fa";
import { useState } from "react";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useAppContext } from "@/context/appContext";
import { toast } from "sonner";
import { setPost, setSelectedPost } from "@/redux/postSlice";
const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpne] = useState(false);
  const [menu, setMenu] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const [like, setLike] = useState(post.likes.includes(user?._id) || false);
  const { posts } = useSelector((store) => store.post);
  const { url } = useAppContext();
  const dispatch = useDispatch();
  const [postLike, setPostLike] = useState(post.likes.length);
  const [comment, setComment] = useState(post.comments);
  const [showHeart, setShowHeart] = useState(false);

  const changeEventHandelar = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const deleteHandelar = async () => {
    await axios
      .post(`${url}/api/v2/post/delete/${post?._id}`)
      .then((res) => {
        toast.success(res.data.message);
        const updatedPostData = posts?.filter(
          (postItem) => postItem._id !== post._id
        );
        dispatch(setPost(updatedPostData));
        setMenu(false);
      })
      .catch((err) => {
        toast.error(err.res.data.message);
        console.log(err.res.data.message);
      });
  };

  const likeHandelar = async () => {
    const action = like ? "dislike" : "like";
    await axios
      .get(`${url}/api/v2/post/${post._id}/${action}`)
      .then((response) => {
        setLike(!like);
        const updatedLikes = like ? postLike - 1 : postLike + 1;
        setPostLike(updatedLikes);
        setShowHeart(true);
        setTimeout(() => setShowHeart(false), 1500);
        const updatedPostData = posts.map((p) =>
          p._id === post._id
            ? {
                ...p,
                likes: like
                  ? p.likes.filter((id) => id !== user._id)
                  : [...p.likes, user._id],
              }
            : p
        );
        dispatch(setPost(updatedPostData));
        toast.success(response.data.message);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const commentHandelar = async () => {
    await axios
      .post(`${url}/api/v2/post/${post._id}/comment`, { text })
      .then((response) => {
        const updatedCommentData = [...comment, response.data.data];
        setComment(updatedCommentData);
        const updatedPostData = posts.map((p) =>
          p._id === post._id ? { ...p, comments: updatedCommentData } : p
        );
        dispatch(setPost(updatedPostData));
        setText("");
        toast.success(response.data.message);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  return (
    <div className="my-8 w-full max-w-sm mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Avatar>
            <AvatarImage
              src={`${post.author?.profilePicture}`}
              alt="post_image"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h2>{post.author?.username}</h2>
        </div>
        <Dialog open={menu}>
          <DialogTrigger asChild>
            <MoreHorizontal
              onClick={() => setMenu(true)}
              className="cursor-pointer"
            />
          </DialogTrigger>
          <DialogContent
            onInteractOutside={() => setMenu(false)}
            className="flex flex-col items-center text-sm text-center"
          >
            <Button
              variant="ghost"
              className="cursor-pointer w-fit text-[#ED4956] font-bold"
            >
              Unfollow
            </Button>
            <Button variant="ghost" className="cursor-pointer w-fit ">
              Add to favorites
            </Button>
            {user && user?._id === post?.author._id && (
              <Button
                onClick={deleteHandelar}
                variant="ghost"
                className="cursor-pointer w-fit "
              >
                Delete
              </Button>
            )}
          </DialogContent>
        </Dialog>
      </div>
      <div className="relative w-full h-full  rounded-md overflow-hidden">
        {/* Image with Double Click Event */}
        <img
          src={post.image}
          alt="Post"
          className="select-none w-full h-full  rounded-sm my-2 object-contain"
          onDoubleClick={likeHandelar}
        />

        {/* Animated Heart Icon */}
        {showHeart && (
          <FaHeart className="absolute text-red-500 text-6xl top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 opacity-100 animate-ping" />
        )}
      </div>
      <div className="flex items-center justify-between my-2">
        <div className="flex items-center gap-3">
          {like ? (
            <FaHeart size={"22px"} className="cursor-pointer text-red-600" />
          ) : (
            <FaRegHeart
              onClick={likeHandelar}
              size={"22px"}
              className="cursor-pointer"
            />
          )}
          <MessageCircle
            onClick={() => {
              dispatch(setSelectedPost(post));
              setOpne(true);
            }}
            className="cursor-pointer hover:text-gray-600"
          />
          <Send className="cursor-pointer hover:text-gray-600" />
        </div>
        <Bookmark className="cursor-pointer hover:text-gray-600" />
      </div>
      <span className="font-medium block mb-2">{post.likes.length} Likes</span>
      <p>
        <span className="font-medium mr-2">{post.author?.username}</span>
        {post?.caption}
      </p>
      <span
        onClick={() => {
          dispatch(setSelectedPost(post));
          setOpne(true);
        }}
        className="cursor-pointer text-gray-400 text-sm"
      >
        {comment.length} Comments
      </span>
      <CommentDialog open={open} setOpne={setOpne} post={post} />
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Add a comment..."
          className="outline-none text-sm w-full"
          onChange={changeEventHandelar}
          value={text}
        />
        {text && (
          <span
            className="text-[#3badf8] cursor-pointer cursor-pointer"
            onClick={commentHandelar}
          >
            Post
          </span>
        )}{" "}
      </div>
    </div>
  );
};

export default Post;
