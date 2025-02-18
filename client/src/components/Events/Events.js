import React, { useEffect, useState } from 'react';
import NavBar from '../NavBar/NavBar';
import './Events.css';
import { IoMdClose } from "react-icons/io";
import { useCookies } from 'react-cookie';


function Events() {
  const [eventData, setEventData] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [cookies, setCookies] = useCookies([]); 
  const [formData, setFormData] = useState({
    name: '',
    location: '',
    date: '',
    description: '',
    private: 'false'
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch('http://localhost:5000/api/v1/createEvent', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${cookies.token}`
        },
        body: JSON.stringify(formData)
      });
      if (response.ok) {
        alert('Event created successfully!');
        setShowPopup(false);
        setFormData({ name: '', location: '', date: '', description: '', private: 'false' });
      } else {
        alert('Failed to create event');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while creating the event');
    }
  };

  const getEvents = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/getEvents');
      const result = await response.json();
      
      setEventData(JSON.parse(result)); 
    } catch (error) {
      console.error('Failed to fetch events:', error);
    }
  };

  useEffect (()=> {
    getEvents();
  }, []);

  return (
    <>
      <img id='back' src='background.svg'/>
      <NavBar/>
      <div className='events'>
        <button className='create-btn' onClick={() => setShowPopup(true)}>Create Event</button>

      {/* Event Cards */}
      <div className='events-container'>
      <div className='events-grid'>
        { console.log(typeof(eventData), eventData) || eventData.length > 0 ? (
          eventData.map((event, index) => (
            <div className='event-card' key={index}>
              <h3 className='event-name'>{event.name}</h3>
              <p className='event-location'>📍 {event.location}</p>
              <p className='event-date'>📅 {event.date}</p>
              <p className='event-participants'>👥 {event.participants.length} Participants</p>
            </div>
          ))
        ) : (
          <p className='no-events'>No events available</p>
        )}
      </div>
      </div>
        {/* POPUP SECTION */}
        {showPopup && (
        <div className='popup'>
          <IoMdClose 
            size={50} 
            className='close' 
            onClick={() => setShowPopup(false)} 
          />
          <div className='popup-form'>  
            <h1>Add an event!</h1>
            <form onSubmit={handleSubmit}>
              <input 
                type='text' 
                name='name' 
                placeholder='Name of the event' 
                value={formData.name} 
                onChange={handleChange} 
                required 
              />
              <input 
                type='text' 
                name='location' 
                placeholder='Location' 
                value={formData.location} 
                onChange={handleChange} 
                required 
              />
              <input 
                type='date' 
                name='date' 
                value={formData.date} 
                onChange={handleChange} 
                required 
              />
              <textarea 
                name='description' 
                placeholder='Description' 
                rows="5" 
                value={formData.description} 
                onChange={handleChange} 
                required 
              />
              <p>Private party?</p>
              <select 
                name='private' 
                value={formData.private} 
                onChange={handleChange}
              >
                <option value="false">Public</option>
                <option value="true">Private</option>
              </select>
              <button type='submit'>Submit</button>
            </form>
          </div>
        </div>
      )}
      {/* END OF POPUP SECTION */}
      </div>
    </>
  )
}

export default Events