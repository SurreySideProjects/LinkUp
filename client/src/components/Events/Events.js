import React from 'react';
import NavBar from '../NavBar/NavBar';
import './Events.css';


function Events() {
  return (
    <>
      <img id='back' src='background.svg'/>
      <NavBar/>
      <div className='events'>
        Events
      </div>
    </>
  )
}

export default Events