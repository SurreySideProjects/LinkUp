import React, { useState } from 'react'
// import './Groups.css'


function InspectSection({groupData}) {

  return (
    <>
        <p>
            {groupData.name}
            {groupData.creator}
            {groupData.description}
            {groupData.numOfMembers}
        </p>
        <button type='button' >join group</button>
    </>
  )
}

export default InspectSection
