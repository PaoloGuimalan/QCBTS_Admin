import React, { useState, useRef, useEffect } from 'react'
import '../../styles/maincompstyles/MainIndex.css'
import { GoogleMap, withGoogleMap, withScriptjs, Polygon } from 'react-google-maps';
import Axios from 'axios'
import QCPath from '../../json/QCPath.json'
import IconsDisplay from '../../json/IconsDisplay';

function Map(){

  const [zoomlevel, setzoomlevel] = useState(17)
  const MapRef = useRef(null);

  useEffect(() => {
    // console.log(MapRef.current)
  },[])

  const reverseGeoAPICall = (data) => {
    // Axios.get(`https://us1.locationiq.com/v1/reverse?key=pk.2dd9b328ed0803c41448fc0c3ba30cd4&lat=${data.latLng.lat()}&lon=${data.latLng.lng()}&format=json`)
    // .then((response) => {
    //   console.log(response.data);
    // })
    // .catch((err) => {
    //   console.log(err);
    // })
  }

  const datazoom = () => {
    // setzoomlevel(zoomlevel - 1)
    // console.log(zoomlevel)
  }

  return(
    <GoogleMap
      ref={MapRef} 
      defaultZoom={17}
      onZoomChanged={() => { datazoom() }}
      center={{ lat: 14.647296, lng: 121.061376 }}
      options={{
        gestureHandling:'greedy',
        zoomControlOptions: { position: 3 },
        streetViewControl:false,
        fullscreenControl:true,
        maxZoom: 0,
        minZoom: 12,
        disableDefaultUI: true,
        style: IconsDisplay,
        mapTypeId: 'satellite' //roadmap, satellite, terrain, hybrid
      }}
      onClick={(data) => {
        reverseGeoAPICall(data)
      }}
    >
      <Polygon
        draggable={false}
        editable={false}
        paths={[QCPath.coordinates[0][0], QCPath.coordinates[0][0]]}
        options={{
          fillColor: "transparent",
          strokeColor: "red"
        }}
      />
    </GoogleMap>
  )
}

const WrappedMap = withScriptjs(withGoogleMap(Map));

function MapRoute(){
  return(
    <WrappedMap
      googleMapURL={`https://maps.googleapis.com/maps/api/js?v=3.exp&libraries=geometry,drawing,places&key=AIzaSyAeogbvkQJHv5Xm0Ph_O_ehNWBxkdr_1CU`}
      loadingElement={<div style={{height: '100%'}} />}
      containerElement={<div style={{height: '100%'}} />}
      mapElement={<div style={{height: '100%'}} />} 
    />
  )
}

function MainIndex() {
  return (
    <div id='divMainIndex'>
      <MapRoute />
    </div>
  )
}

export default MainIndex