import React, { useState } from 'react'
import NavBar from '../NavBar/NavBar'
import './Groups.css'
import axios from 'axios'
import { UNSAFE_createClientRoutesWithHMRRevalidationOptOut } from 'react-router-dom'

function Groups() {

  const [isSearch, setIsSearch] = useState(true)
  const [inputSearch, setInputSearch] = useState({
    search: ""
  })
  const search = inputSearch;

  const[searchData, setSearchData] = useState()
  const[groupData, setGroupData] = useState()

  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setInputSearch({
      ...inputSearch,
      [name]: value,
    });
  };



  const handleSubmitSearch = async (e) => {
    console.log(search)
    try {
      const response = await axios.get(
        "http://localhost:5000/api/v1/searchGroups", 
        {
          // ...inputSearch // if axios.post
          params: {
            "search": search.search
          }
        },
        { withCredentials: true }
      );
      setSearchData(response.data)
    } catch (error) {
      console.log(error);
    }
  };

  const handleSubmitInspect = async (e) => {
    console.log(search)
    try {
      const response = await axios.get(
        "http://localhost:5000/api/v1/getGroup", 
        {
          params: {
            "name": "ZZZZ"
          }
        },
        { withCredentials: true }
      );
      setGroupData(response.data)
      setIsSearch(!isSearch)
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
        <button type='button' onClick={() => setIsSearch((prev) => !prev)}>Inspect</button>
        <button type='button' onClick={() => setIsSearch((prev) => !prev)}>Search</button>
        
        <p>{isSearch ? "Searching" : "Inspecting"}</p>

        <div className='inner'>
          {isSearch &&
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

          {isSearch && searchData && searchData.length > 0 ? 
            (searchData.map((group, index) => (
              <div key={index}>
                <button type='button' onClick={handleSubmitInspect} >{group.name}</button>
              </div>
            )))
             : isSearch && (
            <p>No groups found.</p>
            )
          }

          { !isSearch && groupData ?
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

          {!isSearch && 
          <>
          
          
          </>
          }
        </div>
      </div>
    </>
  )
}

export default Groups