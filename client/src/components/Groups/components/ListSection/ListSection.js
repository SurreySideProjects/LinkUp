import React, { useEffect, useState } from "react";
import "./ListSection.css";
import axios from "axios";
import { FaGrimace } from "react-icons/fa";

const getUsersGroups = async(username) => {
    try {
        const response = await axios.get("http://localhost:5000/api/v1/getGroupByUser", 
            {params : {"username": username}}
        )
        // setGroupData(response.data)
        console.log(response.data);
        return response.data;
    }
    catch (error) { 
        console.log(error);
        return;
    }

}

function ListSection(){ 
    const username = "testuser";
    const [groupsData, setGroupsData] = useState([])


    // const handleShowGroups = async (e) =>{
    //     try {
    //         const response = await axios.get("http://localhost:5000/api/v1/getGroupByUser", 
    //             {params : {"username": username}}
    //         )
    //         setGroupData(response.data)
    //         console.log(response.data);
    //         return response.data;
    //     }
    //     catch (error) { 
    //         console.log(error);
    //         return;
    //     }
    // }

    const handleShowGroups = async(e) =>{
        const groups = await getUsersGroups(username); 
        setGroupsData(groups);
        console.log(groups);
    }
    // handleShowGroups()


    // const [groupsData, setGroupData] = useState(getUsersGroups(username))
    // const groupsData = getUsersGroups(username)
    useEffect(() => { const fetchGroups = async() => {
        const groups = await getUsersGroups(username) 
        setGroupsData(groups)
        }
        fetchGroups()
    }, [])
     

    return (
        <div className="search-container">
          {/* <div className="search-bar">
            <button type="submit" onClick={handleShowGroups} className="search-button">
              Search
            </button>
          </div>
     */}
          <div className="results-container">
            {groupsData && groupsData.length > 0 ? (
              <div className="results-grid">
                {groupsData.map((group, index) => (
                  <button
                    key={index}
                    type="button"
                    // onClick={() => handleGroupButton(group.name)}
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

}

export default ListSection