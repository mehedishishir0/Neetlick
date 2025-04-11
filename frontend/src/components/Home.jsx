import React from "react";
import Feed from "./feed";
import { Outlet } from "react-router-dom";
import Rigtsidebar from "./Rigtsidebar";
import UsegetAllPost from "@/Hooks/UsegetAllPost";

const Home = () => {
  UsegetAllPost()
  return (
    <div className='flex w-full'>
      <Feed />
      <Rigtsidebar/>
    </div>
  );
};

export default Home;
