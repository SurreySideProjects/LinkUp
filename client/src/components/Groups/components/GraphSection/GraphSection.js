import React, { useState, useEffect } from "react";
import "./GraphSection.css";
import axios from "axios";

const getUsersGroups = async(username) => { // this can also be placed inside main function
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
        return [];
    }
}

function GraphSection(){ 
    const username = "testuser";
        const [groupsData, setGroupsData] = useState([])
    
        const handleRefreshGroups = async(e) =>{ // refresh button 
            const groups = await getUsersGroups(username); 
            setGroupsData(groups);
            console.log(groups);
        }

        useEffect(() => { const fetchGroups = async() => {
            const groups = await getUsersGroups(username) 
            setGroupsData(groups)
            }
            fetchGroups()
        }, [])


    return (
        <div>
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
              <p className="no-results">Loading...</p>
            )}
          </div>
        </div>
    )


}

export default GraphSection