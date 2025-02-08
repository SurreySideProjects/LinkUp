import './App.css';
import NavBar from './components/NavBar/NavBar';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";

const App = () => {
  const navigate = useNavigate();
  const [cookies, removeCookie] = useCookies([]);
  const [username, setUsername] = useState("");
  useEffect(() => {
    const verifyCookie = async () => {
      if (cookies.token === "undefined") {
        console.log("You need to login!")
        navigate("/login");
      }
      else {
      console.log("token", cookies.token)
      await axios.get(
        "http://localhost:5000/api/v1/user",
        { withCredentials: true, headers: { 'Authorization': `Bearer ${cookies.token}`} }
      ).then(response => {
        const { user } = response;
        setUsername(user);
        return toast(`Hello ${user}`, {
            position: "top-right",
          });
      })
      .catch(error => {
        console.log("Please login again!", error)
        return removeCookie("token"), navigate("/login");
      });
    }
    };
    verifyCookie();
  }, [cookies, navigate, removeCookie]);
  const Logout = () => {
    removeCookie("token");
    navigate("/signup");
  };
  return (
    <div>
      <NavBar/>
    </div>
  );
};

export default App;
