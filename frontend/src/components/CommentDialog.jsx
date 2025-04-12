import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";
import { useDispatch, useSelector } from "react-redux";
import Comment from "./Comment";
import axios from "axios";
import { useAppContext } from "@/context/appContext";
import { toast } from "sonner";
import { setPost } from "@/redux/postSlice";

const CommentDialog = ({ open, setOpne }) => {
  const [text, setText] = useState("");
  const { selectedPost,posts } = useSelector((store) => store.post);
  const [comment,setComment] = useState(selectedPost?.comments)
  const { url } = useAppContext();
  const dispatch = useDispatch();

  const onChangeEventHandelar = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };

  const commentHandelar = async () => {
    await axios
      .post(`${url}/api/v2/post/${selectedPost?._id}/comment`, { text })
      .then((response) => {
        const updatedCommentData = [...comment, response.data.data];
        setComment(updatedCommentData);
        const updatedPostData = posts.map((p) =>
          p._id === selectedPost._id ? { ...p, comments: updatedCommentData } : p
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
    <div>
      <Dialog open={open}>
        <DialogContent
          onInteractOutside={() => setOpne(false)}
          className="max-w-[2000px] p-0 flex flex-col"
        >
          <div className="flex flex-1">
            <div className="w-1/2">
              <img
                src={selectedPost?.image}
                alt=""
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="w-1/2 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex gap-3 items-center">
                  <Link>
                    <Avatar>
                      <AvatarImage
                        src={selectedPost?.author.profilePicture}
                        alt=""
                      />
                      <AvatarFallback>Cn</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div>
                    <Link className="font-semibold text-xs ">
                      {selectedPost?.author.username}
                    </Link>
                  </div>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <MoreHorizontal className="cursor-pointer" />
                  </DialogTrigger>
                  <DialogContent className="flex flex-col items-center text-sm text-center">
                    <div className="cursor-pointer  w-full text-[#Ed4956] font-bold">
                      Unfollow
                    </div>
                    <div className="cursor-pointer w-full  ">
                      Add to favorates
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
              <hr className="border " />
              <div className="flex-1 overflow-y-auto max-h-96 p-4">
                {comment.map((comment, i) => (
                  <Comment key={i} comment={comment} />
                ))}
              </div>
              <div className="p-4 ">
                <div className="flex items-center gap-2">
                  <input
                    value={text}
                    onChange={onChangeEventHandelar}
                    type="text"
                    placeholder="Add Comment..."
                    className="w-full outline-none border border-gray-300 p-2 rounded"
                  />
                  <Button
                    disabled={!text.trim()}
                    onClick={commentHandelar}
                    variant="outline"
                  >
                    Send
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CommentDialog;
