import React, { useState } from 'react'
// import './Groups.css'
import axios from 'axios'

function SearchSection({handleGroupButton}) {
    const [inputSearch, setInputSearch] = useState({ search: "" });
    const [searchData, setSearchData] = useState([]);


    const handleOnChange = (e) => {
        const { name, value } = e.target;
        setInputSearch({
          ...inputSearch,
          [name]: value,
        });
      };
    
      const handleSubmitSearch = async (e) => {
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



  return (
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

          {searchData && searchData.length > 0 ? 
            (searchData.map((group, index) => (
              <div key={index}>
                <button type='button' onClick={() => handleGroupButton(group.name)} >{group.name}</button>
              </div>
            )))
             : (
            <p>No groups found.</p>
            )
          }
    </>      
  )
}

export default SearchSection