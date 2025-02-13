import React, { useState } from 'react'
import NavBar from '../NavBar/NavBar'
import './Groups.css'
import axios from 'axios'

function Groups() {
  const [mode, setMode] = useState("search") // search OR inspect
  const [inputSearch, setInputSearch] = useState({
    search: ""
  })
  const[searchData, setSearchData] = useState()
  const[groupData, setGroupData] = useState({
    "name": "", 

  })

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputSearch({
      ...inputSearch,
      [name]: value,
    });
  };

  const handleSubmitSearch = async (e) => {
    console.log(inputSearch)
    try {
      const response = await axios.get(
        "http://localhost:5000/api/v1/searchGroups", 
        {
          // ...inputSearch // if axios.post
          params: {
            "search": inputSearch.search
          }
        },
        { withCredentials: true }
      );
      setSearchData(response.data)
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitInspect = async (groupName) => {
    console.log("groupName, ", groupName)
    console.log(inputSearch)
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
          {mode==="search" &&
          <>
            <input
            type="search"
            name="search"
            // value={search}
            placeholder="Search for Groups"
            onChange={handleOnChange}
            required
            />
            <button type='submit' onClick={handleSubmitSearch}>Search</button>

          </> 
          }

          {mode==="search" && searchData && searchData.length > 0 ? 
            (searchData.map((group, index) => (
              <div key={index}>
                <button type='button' onClick={() => handleSubmitInspect(group.name)} >{group.name}</button>
              </div>
            )))
             : mode==="search" && (
            <p>No groups found.</p>
            )
          }

          {mode==="inspect" && groupData ?
          <>
          <p>
            {groupData.name}
            {groupData.creator}
            {groupData.description}
            {groupData.numOfMembers}
          </p>
          </>
          : 
          <>
          </>
          }

          {mode==="inspect" && 
          <>
          
          
          </>
          }
        </div>
      </div>
    </>
  )
}

export default Groups