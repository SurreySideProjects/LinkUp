import './App.css';
import NavBar from './components/NavBar/NavBar';
import MapP from './components/Map/MapP';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import axios from "axios";
import { ToastContainer } from "react-toastify";

const App = () => {
  const navigate = useNavigate();
  const [cookies, setCookie] = useCookies([]);
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
        setCookie("user", user)
        setUsername(user);
      })
      .catch(error => {
        console.log("Please login again!", error)
        return [setCookie("token"), navigate("/login")];
      });
    }
    };
    verifyCookie();
  }, [cookies, navigate, setCookie]);

  return (
    <>
      <img id='back' alt='' src='background.svg'/>
      <div className='app'>
        <NavBar username={username}/>
        <MapP/>
        <ToastContainer/>
      </div>
    </>
  );
};

export default App;
