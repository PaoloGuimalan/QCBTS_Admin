import React, { useState, useRef, useEffect } from 'react'
import '../../styles/maincompstyles/MainIndex.css'
import { GoogleMap, withGoogleMap, withScriptjs, Polygon, InfoWindow, Marker } from 'react-google-maps';
import Axios from 'axios'
import QCPath from '../../json/QCPath.json'
import IconsDisplay from '../../json/IconsDisplay';
import { useDispatch, useSelector } from 'react-redux';
import { SET_SELECTED_AREA } from '../../redux/types';
import { selectedAreaState } from '../../redux/actions';
import BusStopSelectionIcon from '../../resources/Pan_Blue_Circle.png'

function Map(){

  const mapmode = useSelector(state => state.mapmode);
  const selectedarea = useSelector(state => state.selectedarea);
  const dispatch = useDispatch()

  const google = window.google;

  const [zoomlevel, setzoomlevel] = useState(17)
  const [centerMap, setcenterMap] = useState({ lat: 14.647296, lng: 121.061376 });
  const MapRef = useRef(null);

  useEffect(() => {
    // console.log(MapRef.current)

    return () => {
      dispatch({ type: SET_SELECTED_AREA, selectedarea: selectedAreaState})
    }
  },[])

  const reverseGeoAPICall = (data) => {
    Axios.get(`https://us1.locationiq.com/v1/reverse?key=pk.2dd9b328ed0803c41448fc0c3ba30cd4&lat=${data.latLng.lat()}&lon=${data.latLng.lng()}&format=json`)
    .then((response) => {
      // console.log(response.data);
      setcenterMap({ lat: parseFloat(response.data.lat), lng: parseFloat(response.data.lon) })
      dispatch({ type: SET_SELECTED_AREA, selectedarea: {
        status: true,
        data: {
            fullAddress: response.data.display_name,
            coordinates: {
                lat: response.data.lat,
                lng: response.data.lon
            }
        }
      }})
    })
    .catch((err) => {
      console.log(err);
    })
  }

  const datazoom = () => {
    // setzoomlevel(zoomlevel - 1)
    // console.log(zoomlevel)
  }

  const clickMapArea = (data) => {
    if(mapmode == "bus_stops"){
        reverseGeoAPICall(data)
      // console.log({
      //   lat: data.latLng.lat(),
      //   lng: data.latLng.lng()
      // })
    }
  }

  const closeInfoWindow = () => {
    dispatch({ type: SET_SELECTED_AREA, selectedarea: selectedAreaState})
  }

  return(
    <GoogleMap
      ref={MapRef} 
      defaultZoom={17}
      onZoomChanged={() => { datazoom() }}
      center={centerMap}
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
        // reverseGeoAPICall(data)
        clickMapArea(data)
      }}
    >
      {selectedarea.status? 
        (
          <Marker 
          icon={{
            url: BusStopSelectionIcon,
            anchor: new google.maps.Point(15, 15),
            scaledSize: new google.maps.Size(20, 20),
          }}
          position={{lat: parseFloat(selectedarea.data.coordinates.lat), lng: parseFloat(selectedarea.data.coordinates.lng)}}
          >
            <InfoWindow>
              <div id='div_selected_area'>
                <p id='p_label_window'>Area Information</p>
                <p className='full_address_label'>Full Address</p>
                <p className='p_data_area'>{selectedarea.data.fullAddress}</p>
                <p className='full_address_label'>Coordinates</p>
                <p className='p_data_area_coords'>Longitude: {selectedarea.data.coordinates.lng}</p>
                <p className='p_data_area_coords'>Latitude: {selectedarea.data.coordinates.lat}</p>
                <div>
                  <button>Input Data</button>
                  <button onClick={() => { closeInfoWindow() }}>Close</button>
                </div>
              </div>
            </InfoWindow>
          </Marker>
        )
      : ""}
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