import React, { useEffect, useState } from 'react'
import { IoIosLogOut } from "react-icons/io";
import { MdEventAvailable, MdGroups } from "react-icons/md";
import './NavBar.css'
import { useCookies } from 'react-cookie';
import { useNavigate } from "react-router-dom";
import { FaRandom } from "react-icons/fa";

function NavBar({username}) {
    const navigate = useNavigate();
    const [cookies, removeCookie] = useCookies([]);
    const Logout = () => {
        removeCookie("token");
        navigate("/login");
      };
  return (
    <nav className='navbar'>
        <a href="/" id='logo-link'><p id='logo'>LinkUp</p></a>
        <div className='navbar-center'>
            <ul className="nav-links">
                <li>
                    <a href="/groups"><MdGroups size={20} id='groups-logo'/>Groups</a>
                </li>
                <li>
                    <a href="/link2"><FaRandom size={20} id='random-logo'/>Link 2</a>
                </li>
                <li>
                    <a href="/events"><MdEventAvailable size={20} id='events-logo'/>Events</a>
                </li>
            </ul>
        </div>
        <div className='logout'>
            <p style={{textTransform: "uppercase"}}>{username}</p>
            <span></span>
            <button onClick={Logout}><IoIosLogOut size={30} id='logout-logo'/></button>
        </div>
    </nav>
  )
}

export default NavBar