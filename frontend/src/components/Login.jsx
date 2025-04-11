import React, { useState } from "react";
import { Label } from "./ui/label";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import axios from "axios";
import { useAppContext } from "@/context/appContext";
import { toast } from "sonner";
import { Link, useNavigate } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { useDispatch } from "react-redux";
import { setAuthUser } from "@/redux/authslice";

const Login = () => {
  const [input, setInput] = useState({
    email: "",
    password: "",
  });
  const [loading, setIsloading] = useState(false);
  const naviget = useNavigate();
  const dispatch = useDispatch();

  const { url } = useAppContext();

  const chnageEventHandelar = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const handelSubmit = async (e) => {
    e.preventDefault();
    setIsloading(true);
    await axios
      .post(`${url}/api/v2/user/login`, input, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        toast.success(response.data.message);
        setInput({
          email: "",
          password: "",
        });
        naviget("/");
        dispatch(setAuthUser(response.data.data));
      })
      .catch((error) => {
        console.log(error.response);
        toast.error(error.response.data.message);
      })
      .finally(() => {
        setIsloading(false);
      });
  };

  return (
    <div className="flex items-center w-screen h-screen justify-center">
      <form
        onSubmit={handelSubmit}
        className="shadow-lg flex flex-col gap-5 p-8"
      >
        <div className="my-4">
          <h1 className="text-center font-bold text-xl">LOGO</h1>
          <p className="text-sm text-center">Signup to see photos & videos </p>
        </div>
        <div>
          <Label className="py-2 font-medium">Email</Label>
          <Input
            type="text"
            name="email"
            onChange={chnageEventHandelar}
            value={input.email}
            className="focus-visible:ring-transparent"
          />
        </div>
        <div>
          <Label className="py-2 font-medium">Password</Label>
          <Input
            onChange={chnageEventHandelar}
            value={input.password}
            type="text"
            name="password"
            className="focus-visible:ring-transparent"
          />
        </div>
        {loading ? (
          <Button>
            <Loader2 className="mr-2 h-4 animate-spin" />
            Please wait...
          </Button>
        ) : (
          <Button type="submit">Signup</Button>
        )}
        <span className="text-center">
          Dosen't have an account? <Link to="/signup"> Sginup</Link>
        </span>
      </form>
    </div>
  );
};

export default Login;
