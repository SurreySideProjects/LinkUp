import React, { useEffect, useRef, useState } from 'react'
import { MapContainer, TileLayer, useMap, Popup, Marker } from 'react-leaflet'
import Geolocation from '@react-native-community/geolocation';
import './MapP.css';

function MyComponent({}) {
  const map = useMap();

  useEffect(() => {
    Geolocation.getCurrentPosition( position => { 
      map.setView([position.coords.latitude, position.coords.longitude], 14);
    })
  }, []);
}

function MapP() {

  return (
    <>
    <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
    integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
    crossOrigin=""/>
    <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
    integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
    crossOrigin=""></script>
    <div className='section'>
      <h1 id='title'>Event map</h1>
      <div className='map'>
        <MapContainer center={[51.505, -0.09]} zoom={13} scrollWheelZoom={false} >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
          <MyComponent/>
        </MapContainer>
      </div>
    </div>
    </>
  )
}

export default MapP