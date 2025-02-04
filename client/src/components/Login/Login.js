import React from 'react'

function Login() {
  return (
    <div className='wrapper'>
        <form action=''>
            <h1>Login</h1>
            <div className='input-box'>
                <input type='text' placeholder='Username' required />
            </div>
            <div className="input-box">
                <input type="text" placeholder='Password' required/>
            </div>
            <div className="remember-forgot">
                <label><input type="checkbox" />Remember Me</label>
                <a href="/#">Forgot password?</a>
            </div>
            <button type='submit'>Login</button>
            <div className="register-link">
                <p>Don't have an account? <a href="/#">Register</a></p>
            </div>
        </form>
    </div>
  )
}

export default Login