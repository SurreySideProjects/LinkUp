import React, { useEffect, useState } from "react";
import "./ListSection.css";
import axios from "axios";
import { FaGrimace } from "react-icons/fa";
import { useCookies } from "react-cookie";

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

function ListSection({setMode, setGroupData}){ 
    const [cookies, removeCookie] = useCookies();
    const [groupsData, setGroupsData] = useState([])



    const handleRefreshGroups = async(e) =>{ // refresh button 
        const groups = await getUsersGroups(cookies.user); 
        setGroupsData(groups);
        console.log(groups);
    }
    // handleShowGroups()


    // const [groupsData, setGroupData] = useState(getUsersGroups(username))
    // const groupsData = getUsersGroups(username)
    useEffect(() => { const fetchGroups = async() => {
        const groups = await getUsersGroups(cookies.user) 
        setGroupsData(groups)
        }
        fetchGroups()
    }, [])
     

    return (
          <div className="results-container">
            {groupsData && groupsData.length > 0 ? (
              <div className="results-grid">
                {groupsData.map((group, index) => (
                  <button
                    key={index}
                    type="button"
                    onClick={() => [setMode("inspect"), setGroupData(group)]}
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
      );

}

export default ListSection