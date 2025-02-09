import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useCookies } from "react-cookie";
import { ToastContainer, toast } from "react-toastify";
import './Register.css';

const Register = () => {
  const navigate = useNavigate();
  const [token, setToken] = useCookies(['token']);
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
        "http://localhost:5000/api/v1/users",
        {
          ...inputValue,
        },
        { withCredentials: true }
      ).then(response => {
        setToken('token', response.data.access_token)
        console.log("Registered", response.data.access_token)
        const message = "Register successful!";
        handleSuccess(message);
        setTimeout(() => {
          navigate("/login");
        }, 1000);
      })
      .catch(error => {
        console.log("Username Already exists")
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
    <div className="register">
        <div className="form_container">
        <h2>Register</h2>
        <form onSubmit={handleSubmit}>
            <div>
            <label htmlFor="username">Email</label>
            <input
                type="username"
                name="username"
                value={username}
                placeholder="Enter your email"
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
            <span>
            Already have an account? <Link to={"/login"}>Login</Link>
            </span>
        </form>
        <ToastContainer />
        </div>
    </div>
  );
};

export default Register;
