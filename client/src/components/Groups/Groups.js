import React, { useState, useEffect } from 'react'
import NavBar from '../NavBar/NavBar'
import './Groups.css'
import axios from 'axios'
import SearchSection from './components/SearchSection/SearchSection'
import InspectSection from './components/InspectSection/InspectSection'
import ListSection from './components/ListSection/ListSection'
import GraphSection from './components/GraphSection/GraphSection'
import { useCookies } from 'react-cookie'
import { useNavigate } from "react-router-dom";

function Groups() {
  const [mode, setMode] = useState("search") // search OR inspect
  const [userMode, setUserMode] = useState("list") // list OR graph
  const[groupData, setGroupData] = useState({
    "name": "", 
  })
  const [cookies, removeCookie] = useCookies();
  // const [username, setUsername] = useState();

  const handleSubmitInspect = async (groupName) => {
    console.log("groupName, ", groupName)
    groupData.name = groupName
    try {
      const response = await axios.get(
        "http://localhost:5000/api/v1/getGroup", 
        {
          params: {
            "name": groupData.name
          }
        },
        { withCredentials: true }
      );
      setGroupData(response.data)
      setMode("inspect")
      console.log(response.data)
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <>
      <img id='back' src='background.svg'/>
      <NavBar username= {cookies.user}/>
      <div className='left-container'>
        <h1>SEARCH OR INSPECT</h1> 
        {mode === "inspect" && 
        <button 
        type='button' 
        onClick={() => setMode("search")}
        className="search-button"
        >
        Search
        </button>}

        <div className='inner'>
          {mode === "search" ? 
            (<SearchSection  handleGroupButton={handleSubmitInspect}   /> )
            :
            (<InspectSection  groupData={groupData}  />)
          }
        </div>
      </div>

      <div className='right-container'>
        <h1>MY GROUPS</h1>   
        {userMode === "list" ? 
        <button 
        type='button' 
        onClick={() => setUserMode("graph")}
        className="search-button"
        >
        View Graph
        </button>
        :
        <button 
        type='button' 
        onClick={() => setUserMode("list")}
        className="search-button"
        >
        View List
        </button>
        }

        <div className='inner'>
          {userMode === "list" ? 
            (<ListSection  setMode={setMode} setGroupData={setGroupData} /> )
            :
            (<GraphSection setMode={setMode} setGroupData={setGroupData} />)
          }
        </div>
      </div>
    </>
  )
}

export default Groups