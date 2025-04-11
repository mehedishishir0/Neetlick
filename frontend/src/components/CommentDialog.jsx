import React, { useState } from "react";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { Button } from "./ui/button";

const CommentDialog = ({ open, setOpne }) => {
  const [text, setText] = useState("");

  const onChangeEventHandelar = (e) => {
    const inputText = e.target.value;
    if (inputText.trim()) {
      setText(inputText);
    } else {
      setText("");
    }
  };
  const sendMessageHandelar = async () => {
    alert(text);
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
                src="https://handletheheat.com/wp-content/uploads/2015/03/Best-Birthday-Cake-with-milk-chocolate-buttercream-SQUARE.jpg"
                alt=""
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div className="w-1/2 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="flex gap-3 items-center">
                  <Link>
                    <Avatar>
                      <AvatarImage src="" alt="" />
                      <AvatarFallback>Cn</AvatarFallback>
                    </Avatar>
                  </Link>
                  <div>
                    <Link className="font-semibold text-xs ">username</Link>
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
                comment this comment this comment this comment this comment this
                comment this comment this
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
                    onClick={sendMessageHandelar}
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
