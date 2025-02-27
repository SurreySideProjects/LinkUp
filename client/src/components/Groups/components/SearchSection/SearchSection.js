import React, { useState } from 'react'
// import './Groups.css'
import axios from 'axios'
import "./SearchSection.css"

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
    <div> {/*className="search-container"*/}
      <div className="search-bar">
        <div className="search-input-wrapper">
          <svg className="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="search"
            name="search"
            placeholder="Search for Groups"
            onChange={handleOnChange}
            className="search-input"
            required
          />
        </div>
        <button type="submit" onClick={handleSubmitSearch} className="search-button">
          Search
        </button>
      </div>

      <div className="results-container">
        {searchData && searchData.length > 0 ? (
          <div className="results-grid">
            {searchData.map((group, index) => (
              <button
                key={index}
                type="button"
                onClick={() => handleGroupButton(group.name)}
                className="group-button"
              >
                <span className="group-name">{group.name}</span>
                <svg className="arrow-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            ))}
          </div>
        ) : (
          <p className="no-results">No groups found.</p>
        )}
      </div>
    </div>
  );
  //   <>
  //       <input
  //           type="search"
  //           name="search"
  //           // value={search}
  //           placeholder="Search for Groups"
  //           onChange={handleOnChange}
  //           required
  //       />
  //       <button type='submit' onClick={handleSubmitSearch}>Search</button>

  //         {searchData && searchData.length > 0 ? 
  //           (searchData.map((group, index) => (
  //             <div key={index}>
  //               <button type='button' onClick={() => handleGroupButton(group.name)} >{group.name}</button>
  //             </div>
  //           )))
  //            : (
  //           <p>No groups found.</p>
  //           )
  //         }
  //   </>      
  // )
}

export default SearchSection