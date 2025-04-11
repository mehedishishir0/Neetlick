import React, { useRef, useState } from "react";
import { Dialog, DialogContent, DialogHeader } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Textarea } from "./ui/textarea";
import { Button } from "./ui/button";
import { Loader2 } from "lucide-react";
import axios from "axios";
import { useAppContext } from "@/context/appContext";
import { toast } from "sonner";
import { useDispatch, useSelector } from "react-redux";
import { setPost } from "@/redux/postSlice";

const Createpost = ({ open, setOpen }) => {
  const imageRef = useRef();
  const [file, setFile] = useState("");
  const [caption, setCaption] = useState("");
  const [imageShow, setImageShow] = useState("");
  const [loading, setLoading] = useState(false);
  const { url } = useAppContext();
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const { posts } = useSelector((store) => store.post);

  const createPostHandelar = async () => {
    setLoading(true);
    const fromdata = new FormData();
    fromdata.append("caption", caption);
    fromdata.append("image", file);
    await axios
      .post(`${url}/api/v2/post/addpost`, fromdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then((res) => {
        toast.success(res.data.message);
        dispatch(setPost([res.data.data, ...posts]));
        setOpen(false);
      })
      .catch((err) => {
        toast.error(err.res.data.message);
        console.log(err.res.data);
      })
      .finally(() => [setLoading(false)]);
  };

  const fileChangeHandelar = async (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setFile(file);
      setImageShow(URL.createObjectURL(file));
    }
  };
  return (
    <Dialog open={open}>
      <DialogContent onInteractOutside={() => setOpen(false)}>
        <DialogHeader className="text-center font-semibold">
          Create a New Post
        </DialogHeader>
        <div className="flex gap-3 items-center">
          <Avatar>
            <AvatarImage src={user?.profilePic} alt="image" />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="font-semibold text-xs">{user?.username}</h2>
            <span className="text-xs text-gray-600">{user?.bio}</span>
          </div>
        </div>
        <Textarea
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          className="focus-visible:ring-transparent border-none"
          placeholder="write a caption"
        />
        {imageShow && (
          <div className="w-full flex items-center justify-center">
            <img src={`${imageShow}`} className=" h-56 rounded-xl" alt="" />
          </div>
        )}
        <input
          ref={imageRef}
          type="file"
          id="image"
          className="hidden"
          onChange={fileChangeHandelar}
        />
        <Button
          onClick={() => imageRef.current.click()}
          className="w-fit mx-auto bg-[#0095F6] hover:bg-[#0094f6b4] cursor-pointer"
        >
          Select from computer
        </Button>
        {imageShow &&
          (loading ? (
            <Button>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait...
            </Button>
          ) : (
            <Button
              onClick={createPostHandelar}
              type="submit"
              className="w-full"
            >
              Post
            </Button>
          ))}
      </DialogContent>
    </Dialog>
  );
};

export default Createpost;
