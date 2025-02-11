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
      await axios.get(
        "http://localhost:5000/api/v1/user",
        { withCredentials: true, headers: { 'Authorization': `Bearer ${cookies.token}`} }
      ).then(response => {
        const user = response.data.profile;
        setUsername(user);
        return toast(`Goodbye ${user}`, {
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

  return (
    <>
      <img id='back' src='background.svg'/>
      <div className='app'>
        <NavBar username={username}/>
      </div>
    </>
  );
};

export default App;
