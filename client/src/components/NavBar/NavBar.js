import React, { useEffect, useState } from 'react'
import { IoIosLogOut } from "react-icons/io";
import './NavBar.css'
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";

function NavBar({username}) {
    const navigate = useNavigate();
    const [cookies, removeCookie] = useCookies([]);
    const Logout = () => {
        removeCookie("token");
        navigate("/login");
      };
  return (
    <nav className='navbar'>
        <p id='logo'>LinkUp</p>
        <div className='navbar-center'>
            <ul className="nav-links">
                <li>
                    <a href="/groups">Groups</a>
                </li>
                <li>
                    <a href="/link2">Link 2</a>
                </li>
                <li>
                    <a href="/link3">Link 3</a>
                </li>
            </ul>
        </div>
        <div className='logout'>
            <p>{username}</p>
            <span></span>
            <button onClick={Logout}><IoIosLogOut size={30}/></button>
        </div>
    </nav>
  )
}

export default NavBar