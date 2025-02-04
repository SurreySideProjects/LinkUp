import React from 'react'
import './NavBar.css'

function NavBar() {
  return (
    <nav className='navbar'>
        <p id='logo'>PartyVerse</p>
        <div className='navbar-center'>
            <ul className="nav-links">
                <li>
                    <a href="/link1">Link 1</a>
                </li>
                <li>
                    <a href="/link2">Link 2</a>
                </li>
                <li>
                    <a href="/link3">Link 3</a>
                </li>
            </ul>
        </div>
        <div>
            <button>Login</button>
            <button>Register</button>
        </div>
    </nav>
  )
}

export default NavBar