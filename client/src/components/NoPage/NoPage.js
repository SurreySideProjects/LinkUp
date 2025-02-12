import React from 'react'
import NavBar from '../NavBar/NavBar'
import './NoPage.css'

function NoPage() {
  return (
    <>
      <img id='back' alt='' src='background.svg'/>
      <NavBar/>
      <div className='notfound' style={{color: "red"}}>
        Oops, page not found 
      </div>
    </>
  )
}

export default NoPage