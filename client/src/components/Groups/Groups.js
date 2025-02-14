import React, { useState } from 'react'
import NavBar from '../NavBar/NavBar'
import './Groups.css'
import axios from 'axios'
import SearchSection from './components/SearchSection/SearchSection'
import InspectSection from './components/InspectSection/InspectSection'

function Groups() {
  const [mode, setMode] = useState("search") // search OR inspect
  const [userMode, setUserMode] = useState("list")
  const[groupData, setGroupData] = useState({
    "name": "", 
  })

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
      <NavBar/>
      <div className='left-container'>

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
        {userMode === "list" && 
        <button 
        type='button' 
        onClick={() => setMode("search")}
        className="search-button"
        >
        Search
        </button>}
      </div>
    </>
  )
}

export default Groups