import React, { useState, useEffect } from "react";
import "./GraphSection.css";
import axios from "axios";
import ForceGraph2D from "react-force-graph-2d"; 
import { FaRegGrinTongueWink } from "react-icons/fa";
import { MdOutlineUpdateDisabled } from "react-icons/md";
import { useCookies } from "react-cookie";

const getUsersGroups = async(username) => { // this can also be placed inside main function
    try {
        const response = await axios.get("http://localhost:5000/api/v1/getGroupByUser", 
            {params : {"username": username}}
        )
        console.log(response.data);
        return response.data;
    }
    catch (error) { 
        console.log(error);
        return [];
    }
}

function GraphSection({setMode, setGroupData}){ 
    const [cookies, removeCookie] = useCookies();
    const [groupsData, setGroupsData] = useState([])
    const [graphData, setGraphData] = useState({nodes: [
          { id: "1", name: "Group 1", numOfUsers: 1, group: 1},
          { id: "2", name: "Group 2", numOfUsers: 1, group: 1},
          { id: "3", name: "Group 3", numOfUsers: 2, group: 1},
        ],
        links: [
          { source: "1", target: "2" },
          { source: "2", target: "3" },
        ],}
      )

    const pinky = "rgb(190, 13, 96)";

    const handleRefreshGroups = async(e) =>{ // refresh button 
        const groups = await getUsersGroups(cookies.user); 
        setGroupsData(groups);
        console.log(groups);
    }

    useEffect(() => { const fetchGroups = async() => {
        const groups = await getUsersGroups(cookies.user) 
        setGroupsData(groups)

        let graphDataHolder = {nodes: [], links: []};
        for (let i=0; i < groups.length; i++){
          console.log(1000)
          graphDataHolder.nodes[i] = {id: i+1, name: groups[i].name, numOfMembers: groups[i].numOfMembers, creator: groups[i].creator}
          graphDataHolder.links[i] = {source: i+1, target: i+1+1}
        }
        graphDataHolder.links.pop()
        setGraphData(graphDataHolder)
        console.log("holder", graphDataHolder);
        }
        fetchGroups()
    }, [])

    return (
          <div className="results-container">
            {groupsData && groupsData.length > 0 ? (
              <div className="results-grid">
                <ForceGraph2D
                  width={950}
                  height={450}
                  graphData={graphData}
                  onNodeClick={(node) => [setMode("inspect"), setGroupData(groupsData[node.id-1])]}

                  nodeCanvasObject={(node, ctx, globalScale) => {
                    const label = node.name;
                    const fontSize = 12 / globalScale;

                    ctx.fillStyle = "white"
                    ctx.beginPath();
                    ctx.arc(node.x, node.y, node.numOfMembers*10, 0, 2 * Math.PI, false); // Circle with radius 10
                    ctx.fill();

                    ctx.font = `${fontSize}px Sans-Serif`;
                    ctx.fillStyle = pinky;
                    ctx.textAlign = "center";
                    ctx.textBaseline = "middle";
                    ctx.fillText(label, node.x, node.y);

                  }}

                  linkCanvasObject={(link, ctx) => {
                    const start = link.source;
                    const end = link.target;
            
                    ctx.beginPath();
                    ctx.moveTo(start.x, start.y);
                    ctx.lineTo(end.x, end.y);
                    ctx.strokeStyle = pinky;
                    ctx.lineWidth = 5;
                    ctx.stroke();
                  }}
                />
              </div>
            ) : (
              <p className="no-results">Loading...</p>
            )}
          </div>
      );

}

export default GraphSection