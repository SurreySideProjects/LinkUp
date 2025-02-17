import React, { useEffect, useState } from 'react';
import NavBar from '../NavBar/NavBar';
import './Events.css';


function Events() {
  const [eventData, setEventData] = useState([]);

  const getEvents  = async () => {

      const url = 'http://localhost:5000/api/v1/getEvents';

      const response = await fetch (url);
              try {
                  const responseJson = await response.json();
                  console.log(responseJson);
                  setEventData(responseJson.results);
              } catch (err) {
                  console.error(err);
              }
  }

  useEffect (()=> {
    /*getEvents();*/
  }, []);

  return (
    <>
      <img id='back' src='background.svg'/>
      <NavBar/>
      <div className='events'>
        <button>Create Event</button>
        <div className='allEvents'>
          <div className='event'>
            ADD INFO HERE
          </div>
        </div>
      </div>
    </>
  )
}

export default Events