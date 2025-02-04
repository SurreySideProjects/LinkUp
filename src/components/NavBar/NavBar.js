import React from 'react'
import './NavBar.css'

function NavBar() {
  return (
    <nav className='nav-bar'>
        <p>PartyVerse</p>
        <div className='nav-bar-center'>
            <ul className="nav-links">
                <li>
                    <a href="/products">Link 1</a>
                </li>
                <li>
                    <a href="/about">Link 2</a>
                </li>
                <li>
                    <a href="/contact">Link 3</a>
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