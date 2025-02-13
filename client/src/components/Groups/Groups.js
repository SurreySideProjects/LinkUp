import React, { useState } from 'react'
import NavBar from '../NavBar/NavBar'
import './Groups.css'
import axios from 'axios'
import SearchSection from './components/SearchSection'
import InspectSection from './components/InspectSection'

function Groups() {
  const [mode, setMode] = useState("search") // search OR inspect
  const[searchData, setSearchData] = useState()
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
      <div className='container'>
        <button type='button' onClick={() => setMode("inspect")}>Inspect</button>
        <button type='button' onClick={() => setMode("search")}>Search</button>
        
        <p>{mode==="search" ? "Searching" : "Inspecting"}</p>

        <div className='inner'>
          {mode === "search" ? 
            (<SearchSection  handleGroupButton={handleSubmitInspect}   /> )
            :
            (<InspectSection  groupData={groupData}  />)
          }
        </div>

      </div>
    </>
  )
}

export default Groups