import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [token, setToken] = useCookies(['token']);
  const [userMessage, setUserMessage] = useState("")

  const [inputValue, setInputValue] = useState({
    username: "",
    password: "",
  });
  const { username, password } = inputValue;
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputValue({
      ...inputValue,
      [name]: value,
    });
  };

  const handleError = (err) =>
    toast.error(err, {
      position: "bottom-left",
    });
  const handleSuccess = (msg) =>
    toast.success(msg, {
      position: "bottom-left",
    });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        "http://localhost:5000/api/v1/login",
        {
          ...inputValue,
        },
        { withCredentials: true }
      ).then(response => {
        setToken('token', response.data.access_token)
        console.log("logged in", response.data.access_token)
        const message = "Login successful!";
        handleSuccess(message);
        setTimeout(() => {
          navigate("/");
        }, 1000);
      })
      .catch(error => {
        setUserMessage("Wrong username or password")
        console.log("wrong password")
        handleError(error);
      });
    } catch (error) {
      console.log(error);
    }
    setInputValue({
      ...inputValue,
      username: "",
      password: "",
    });
  };

  return (
    <div className="login">
        <div className="form_container">
        <h2>Login</h2>
        <form onSubmit={handleSubmit}>
            <div>
            <label htmlFor="username">Username</label>
            <input
                type="username"
                name="username"
                value={username}
                placeholder="Enter your username"
                onChange={handleOnChange}
            />
            </div>
            <div>
            <label htmlFor="password">Password</label>
            <input
                type="password"
                name="password"
                value={password}
                placeholder="Enter your password"
                onChange={handleOnChange}
            />
            </div>
            <button type="submit">Submit</button>
            {userMessage && <p>{userMessage}</p>}
            <span>
            You don't have an account yet? <Link to={"/register"}>Register</Link>
            </span>
        </form>
        <ToastContainer />
        </div>
    </div>
  );
};

export default Login;
