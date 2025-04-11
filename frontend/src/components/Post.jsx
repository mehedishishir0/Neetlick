"use client";
import { Button } from "@/components/ui/button";
import { Bookmark, MessageCircle, MoreHorizontal, Send } from "lucide-react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { FaHeart } from "react-icons/fa";
import { CiHeart } from "react-icons/ci";
import { useState } from "react";
import CommentDialog from "./CommentDialog";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import { useAppContext } from "@/context/appContext";
import { toast } from "sonner";
import { setPost } from "@/redux/postSlice";
const Post = ({ post }) => {
  const [text, setText] = useState("");
  const [open, setOpne] = useState(false);
  const [menu, setMenu] = useState(false);
  const { posts } = useSelector((store) => store.post);
  const { url } = useAppContext();
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
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
      <img
        className="rounded-sm my-2 w-full aspect-square object-cover"
        src={post?.image}
        alt="cake"
      />
      <div className="flex items-center justify-between my-2">
        <div className="flex items-center gap-3">
          <CiHeart size="25px" />
          <MessageCircle
            onClick={() => setOpne(true)}
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
        onClick={() => setOpne(true)}
        className="cursor-pointer text-gray-400 text-sm"
      >
        {post.comments.length} Comments
      </span>
      <CommentDialog open={open} setOpne={setOpne} post={post} />
      <div className="flex justify-between items-center">
        <input
          type="text"
          placeholder="Add a comment..."
          className="outline-none text-sm w-full"
          onChange={changeEventHandelar}
        />
        {text && <span className="text-[#3badf8] cursor-pointer">Post</span>}{" "}
      </div>
    </div>
  );
};

export default Post;
