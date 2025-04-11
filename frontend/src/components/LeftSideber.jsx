import { useAppContext } from "@/context/appContext";

import axios from "axios";
import {
  Heart,
  Home,
  LogOut,
  MessageCircle,
  PlusSquare,
  Search,
  TrendingUp,
  User,
} from "lucide-react";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { useDispatch, useSelector } from "react-redux";
import { setAuthUser } from "@/redux/authslice";
import Createpost from "./Createpost";

const LeftSideber = () => {
  const { url } = useAppContext();
  const naviget = useNavigate();
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();
  const [open, setOpen] = useState();

  const logoutHander = async () => {
    await axios
      .get(`${url}/api/v2/user/logout`)
      .then((res) => {
        dispatch(setAuthUser(null));
        naviget("/login");
        toast.success(res.data.message);
      })
      .catch((err) => {
        toast.success(err.res.data.message);
      });
  };

  const sidebarHandelar = (text) => {
    if (text === "Logout") {
      logoutHander();
    }
    if (text === "Create") {
      setOpen(true);
    }
  };

  const sideberItem = [
    { name: "Home", icon: <Home /> },
    { name: "Search", icon: <Search /> },
    { name: "Explore", icon: <TrendingUp /> },
    { name: "Profile", icon: <User /> },
    { name: "Messages", icon: <MessageCircle /> },
    { name: "Notifications", icon: <Heart /> },
    { name: "Create", icon: <PlusSquare /> },
    {
      name: "Profile",
      icon: (
        <Avatar className="w-6 h-6">
          <AvatarImage className="rounded-full" src={user?.profilePic} />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      ),
    },
    { name: "Logout", icon: <LogOut /> },
  ];

  return (
    <div className="fixed top-0 z-10 left-0 px-4 border-r border-gray-300 w-[16%] h-screen">
      <div className="flex flex-col">
        <h1 className="my-8 pl-3 font-bold text-xl">LOGO</h1>
        <div>
          {sideberItem.map((item, index) => (
            <div
              onClick={() => sidebarHandelar(item.name)}
              key={index}
              className="flex items-center gap-4 relative hover:bg-gray-200 cursor-pointer rounded-lg p-3"
            >
              {item.icon}
              <span>{item.name}</span>
            </div>
          ))}
        </div>
      </div>
      <Createpost open={open} setOpen={setOpen}/>
    </div>
  );
};

export default LeftSideber;
