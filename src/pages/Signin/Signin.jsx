import React, { useState } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { loginStart, loginSuccess, loginFailed } from "../../redux/userSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export const Signin = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_SERVER}/auth/signin`,
        { username, password }
      );
      console.log("hello", res.data);
      dispatch(loginSuccess(res.data));
      toast.success("Logged In Successfully!");
      navigate("/");
    } catch (err) {
      toast.error("Error in Login");
      dispatch(loginFailed());
    }
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    dispatch(loginStart());
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_BACKEND_SERVER}/auth/signup`,
        {
          username,
          email,
          password,
        }
      );
      dispatch(loginSuccess(res.data));
      toast.success("Signed up Successfully!");
      navigate("/");
    } catch (err) {
      dispatch(loginFailed());
      toast.error("Error in Signup");
    }
  };

  return (
    <form className="bg-gray-200 flex flex-col py-12 px-8 rounded-lg w-8/12 md:w-6/12 mx-auto gap-10">
      <h2 className="text-3xl font-bold text-center">Sign in to Twitter</h2>

      <input
        onChange={(e) => setUsername(e.target.value)}
        type="text"
        placeholder="username"
        className="text-xl py-2 rounded-full px-4"
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="password"
        className="text-xl py-2 rounded-full px-4"
      />

      <button
        className="text-xl py-2 rounded-full px-4 bg-blue-500 text-white"
        onClick={handleLogin}
      >
        Sign in
      </button>

      <p className="text-center text-xl">Don't have an account?</p>

      <input
        onChange={(e) => setUsername(e.target.value)}
        type="text"
        placeholder="username"
        className="text-xl py-2 rounded-full px-4"
      />
      <input
        onChange={(e) => setEmail(e.target.value)}
        type="email"
        placeholder="email"
        required
        className="text-xl py-2 rounded-full px-4"
      />
      <input
        onChange={(e) => setPassword(e.target.value)}
        type="password"
        placeholder="password"
        className="text-xl py-2 rounded-full px-4"
      />

      <button
        onClick={handleSignup}
        className="text-xl py-2 rounded-full px-4 bg-blue-500 text-white"
        type="submit"
      >
        Sign up
      </button>
    </form>
  );
};
