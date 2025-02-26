import React, { useEffect, useState } from 'react';
import './InspectSection.css';
import axios from 'axios';
import { useCookies } from 'react-cookie';

const isUserInGroup = async(username, groupname) =>{
  try{
    const response = await axios.get("http://localhost:5000/api/v1/isUserInGroup",
       {params: { 
        "groupname": groupname, 
        "username": username
      }}, 
      {withCredentials: true}
    );
    console.log(response.data.joined)
    return response.data.joined;

  } catch (error) {
    return false;
  }
}

function InspectSection({ groupData, setUserMode }) {
  const [cookies, setCookie] = useCookies();
  const [isJoined, setIsJoined] = useState()


  const handleJoinGroup = async() => {
    try{
      const response = await axios.post("http://localhost:5000/api/v1/addUserToGroup",
        {
          groupname: groupData.name, 
          username: cookies.user
        }, 
        {withCredentials: true}
      );
      console.log(response)
      setIsJoined(true)
    } catch (error) {
      console.log(error)
      setIsJoined(false)
    }
  }

  useEffect(() => {
    const fetchIsJoined = async () => {
      const result = await isUserInGroup(cookies.user, groupData.name);
      setIsJoined(result);
    };

    fetchIsJoined();
  }, [groupData.name, cookies.user])


  return (
    <div className="inspect-card">
      <div className="inspect-content">
        <div className="inspect-header">
          <h2 className="group-name">{groupData.name}</h2>
          <p className="creator">Created by: {groupData.creator}</p>
        </div>

        <div className="group-info">
          <h3 className="info-title">About this group</h3>
          <p className="description">{groupData.description}</p>
        </div>

        <div className="inspect-footer">
          <div className="member-count">
            <svg 
              className="member-icon"
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth="2" 
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span>{groupData.numOfMembers} members</span>
          </div>
          
          {!isJoined ?
            (<button type="button" className="join-button" onClick={() => handleJoinGroup()}>
              Join Group
            </button>)
          :
            (
            <>
            <button type="button" className="join-button" onClick={() => handleJoinGroup()}>
              Leave Group
            </button>

            <button type="button" className="join-button" onClick={() => setUserMode("messages")}>
              Chat
            </button>
            </>
            )
          }
        </div>
      </div>
    </div>
  );
}

export default InspectSection;