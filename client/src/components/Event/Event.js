import React, { useEffect, useState } from 'react'
import NavBar from '../NavBar/NavBar';
import './Event.css';

function Event() {
    const [eventData, setEventData] = useState()

    async function getData() {
        try {
            const current = window.location.href.split("/")
            const response = await fetch("http://localhost:5000/api/v1/getEvent", {
                method: "POST",
                headers: {'Content-Type': "application/json"},
                body: JSON.stringify({ id: current[current.length - 1] }),
            });
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
              }
          
            const json = await response.json();
            setEventData(JSON.parse(json))
        } catch (error) {
            console.error(error.message);
        }
    }

      
    useEffect (()=> {
        getData();
    }, []);

  return (
    <>
        <img id='back' alt='' src='../../background.svg'/>
        <NavBar />
        { eventData ? (
        <div className='event-wrapper'>
            <div className='event-information'>
                <p>Event information</p>
                <p>{eventData?.name}</p>
                <p>{eventData?.location}</p>
                <p>{eventData?.date}</p>
                <p>{eventData?.description}</p>
            </div>
            <div className='event-participants'>
                <p>Event participants</p>
                <p>{eventData?.participants || "No participants"}</p>
            </div>
        </div>
        ) : (
            <p>Loading event data...</p>
        )}
    </>
  )
}

export default Event