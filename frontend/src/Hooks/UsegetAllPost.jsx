import React, { useEffect } from "react";
import axios from "axios";
import { useAppContext } from "@/context/appContext";
import { useDispatch } from "react-redux";
import { setPost } from "@/redux/postSlice";

const UsegetAllPost = () => {
  const { url } = useAppContext();
  const dispatch = useDispatch();
  useEffect(() => {
    const fetchAllPost = async () => {
      await axios
        .get(`${url}/api/v2/post/all`)
        .then((response) => {
          dispatch(setPost(response.data.data));
        })
        .catch((err) => {
          console.log(err);
        });
    };
    fetchAllPost();
  }, []);
};

export default UsegetAllPost;
