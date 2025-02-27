import React, { useEffect, useState } from 'react'
import NavBar from '../NavBar/NavBar';
import './Event.css';
import { useCookies } from 'react-cookie';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from "react-toastify";

function Event() {
    const navigate = useNavigate();
    const [cookies, ] = useCookies(['token'], {
        path: '/',
      });
    const [eventData, setEventData] = useState()
    const [requests, setRequests] = useState()
    const [username, setUsername] = useState()

    const handleRemove = (user) => {
        axios.post("http://localhost:5000/api/v1/removePersonFromEvent", {
            "username" : user,
            "id" : eventData.id,
        })
        .then((response) => {
            console.log(response);
            getData()
        }).catch (error => {
            if(error.status === 401) {
                console.log(error.response.data.msg)
            } else {
            console.log(error.message)
            }
        });
    }

    const handleJoin = () => {
        axios.post("http://localhost:5000/api/v1/addPersonToEvent", {
            "username" : username,
            "id" : eventData.id,
        })
        .then((response) => {
            console.log(response);
            getData()
        }).catch (error => {
            if(error.status === 401) {
                console.log(error.response.data.msg)
            } else {
            console.log(error.message)
            }
        });
    }

    const handleAccept = (user) => {
        axios.post("http://localhost:5000/api/v1/addPersonToEvent", {
            "username" : user,
            "id" : eventData.id,
        })
        .then((response) => {
            console.log(response);
            handleRemoveRequest(user)
            getRequests()
            getData()
        }).catch (error => {
            if(error.status === 401) {
                console.log(error.response.data.msg)
            } else {
            console.log(error.message)
            }
        });
    }
   
    const handleRemoveRequest = (user) => {
        axios.post("http://localhost:5000/api/v1/removeRequest", {
            "username" : user,
            "id" : eventData.id,
        })
        .then((response) => {
            console.log(response);
            getRequests()
        }).catch (error => {
            if(error.status === 401) {
                console.log(error.response.data.msg)
            } else {
            console.log(error.message)
            }
        });
    } 

    const handleRequest = () => {
        axios.post("http://localhost:5000/api/v1/newRequest", {
            "username" : username,
            "id" : eventData.id,
        })
        .then((response) => {
            console.log(response);
            toast.success("Request sent successfully", {
                  position: "bottom-left",
            });
            getData()
        }).catch (error => {
            if(error.status === 401) {
                toast.error("Request already sent", {
                    position: "bottom-left",
                });
                console.log(error.response.data.msg)
            } else {
            console.log(error.message)
            }
        });
    }



    useEffect(() => {
        const verifyCookie = async () => {
          if (cookies.token === "undefined") {
            console.log("You need to login!")
            navigate("/login");
          }
          else {
          await axios.get(
            "http://localhost:5000/api/v1/user",
            { withCredentials: true, headers: { 'Authorization': `Bearer ${cookies.token}`} }
          ).then(response => {
            const user = response.data.profile;
            setUsername(user);
          })
          .catch(error => {
            console.log("Please login again!", error)
          });
        }
        };
        verifyCookie();
      }, [cookies.token, navigate]);

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

    async function getRequests() {
        try {
            const current = window.location.href.split("/")
            const response = await fetch("http://localhost:5000/api/v1/getRequests", {
                method: "POST",
                headers: {'Content-Type': "application/json"},
                body: JSON.stringify({ id: current[current.length - 1] }),
            });
            if (!response.ok) {
                throw new Error(`Response status: ${response.status}`);
              }
          
            const json = await response.json();
            setRequests(JSON.parse(json))
            console.log(JSON.parse(json))
        } catch (error) {
            console.error(error.message);
        }
    }  

    useEffect (()=> {
        getData();
        getRequests();
    }, []);

  return (
    <>
        <img id='back' alt='' src='../../background.svg'/>
        <NavBar username={username}/>
        <ToastContainer/>
        { eventData && username ? (
        <div className='event-wrapper'>
            <div className='event-information'>
                <p id='eventC-title'>Event information</p>
                <p id='eventC-name'>{eventData?.name}</p>
                <p id='eventC-location'>📍 {eventData?.location}</p>
                <p id='eventC-date'>📅 {eventData?.date}</p>
                <p id='eventC-description'>{eventData?.description}</p>
                {eventData.private === "true" ? 
                <p className="event-status private-event">This event is private</p> : 
                <p className="event-status public-event">This event is public</p>}
            </div>
            <div className='eventC-participants'>
                <p id='eventC-pTitle'>Event participants - 👥 {eventData.participants.length}</p>
                { eventData.owner !== username && eventData.private === "true" && !eventData.participants.includes(username) && <button id='act-button' onClick={() => handleRequest()}>Request to join</button>}
                { eventData.owner !== username && eventData.private === "false" && !eventData.participants.includes(username) && <button id='act-button' onClick={() => handleJoin()}>Join event</button>}
                
                {eventData.participants.length > 0 ? (
                <ul id="eventC-pList">
                    {eventData.participants.map((participant, index) => (
                        <li key={index} className="participant-item">{participant} {eventData.owner === username && <button id='remove-user' onClick={() => handleRemove(participant)}>❌</button>}</li>
                    ))}
                </ul>
                ) : (
                    <p id="eventC-pList">No participants</p>
                )}

            </div>
        </div>
        ) : (
            <p>Loading event data...</p>
        )}
        {requests && eventData && eventData.private === "true" && username === eventData.owner ? (
        <div className='event-requests-wrapper'>
            <div className='event-requests'>
                <p id='request-title'>Requests</p>
                <ul id="event-requestList">
                    {requests.length > 0 ? (
                        requests.map((requests) => (
                            <li key={requests.id}>
                                <span>{requests.username} - {new Date(requests.date.$date).toLocaleString()}</span>
                                <div className="request-buttons">
                                    <button id='accept-request-button' onClick={() => handleAccept(requests.username)}>✅</button>
                                    <button id='deny-request-button' onClick={() => handleRemoveRequest(requests.username)}>❌</button>
                                </div>
                            </li>
                        ))
                    ) : (
                        <p style={{color : "white"}}>No requests</p>
                    )}
                </ul>
            </div>
        </div>
        ) : (
            <p>Loading requests</p>
        )}
    </>
  )
}

export default Event