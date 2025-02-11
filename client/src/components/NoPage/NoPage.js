import React from 'react'
import NavBar from '../NavBar/NavBar'

function NoPage() {
  return (
    <>
      <img id='back' alt='' src='background.svg'/>
      <NavBar/>
      <div className='app' style={{color: "red"}}>
        Oops, page not found 
      </div>
    </>
  )
}

export default NoPage