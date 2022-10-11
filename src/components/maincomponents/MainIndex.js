import React, { useState, useRef, useEffect } from 'react'
import '../../styles/maincompstyles/MainIndex.css'
import { GoogleMap, withGoogleMap, withScriptjs, Polygon, InfoWindow, Marker } from 'react-google-maps';
import Axios from 'axios'
import QCPath from '../../json/QCPath.json'
import IconsDisplay from '../../json/IconsDisplay';
import { useDispatch, useSelector } from 'react-redux';
import { SET_ALERT, SET_CENTER_MAP, SET_SELECTED_AREA, SET_SELECTED_AREA_INPUT, SET_SELECTED_MARKER } from '../../redux/types';
import { selectedAreaInputState, selectedAreaState } from '../../redux/actions';
import BusStopSelectionIcon from '../../resources/Pan_Blue_Circle.png'
import { motion } from 'framer-motion'
import OpennedIcon from '../../resources/OpenStop.png'
import ClosedIcon from '../../resources/ClosedStop.png'
import { URL } from '../../json/urlconfig'

function Map(){

  const busstopslist = useSelector(state => state.busstopslist);
  const mapmode = useSelector(state => state.mapmode);
  const selectedarea = useSelector(state => state.selectedarea);
  const selectedareainput = useSelector(state => state.selectedareainput);
  const centerMap = useSelector(state => state.centermap);
  const selectedMarker = useSelector(state => state.selectedmarker);
  const dispatch = useDispatch()

  const google = window.google;

  const [zoomlevel, setzoomlevel] = useState(17)
  // const [centerMap, setcenterMap] = useState({ lat: 14.647296, lng: 121.061376 });
  // const [selectedMarker, setselectedMarker] = useState(null);
  const MapRef = useRef(null);

  useEffect(() => {
    // console.log(MapRef.current)

    return () => {
      dispatch({ type: SET_SELECTED_AREA, selectedarea: selectedAreaState})
      dispatch({ type: SET_SELECTED_AREA_INPUT, selectedareainput: selectedAreaInputState })
      dispatch({ type: SET_CENTER_MAP, centermap: { lat: 14.647296, lng: 121.061376 }})
      dispatch({ type: SET_SELECTED_MARKER, selectedmarker: null })
    }
  },[])

  const alertPrompt = (statusPrompt, messagePrompt) => {
    dispatch({ type: SET_ALERT, alert: {
        trigger: true,
        status: statusPrompt,
        message: messagePrompt
    } })
    setTimeout(() => {
        dispatch({ type: SET_ALERT, alert: {
            trigger: false,
            status: statusPrompt,
            message: messagePrompt
        } })
    }, 3000)
    setTimeout(() => {
        dispatch({ type: SET_ALERT, alert: {
            trigger: false,
            status: false,
            message: "..."
        } })
    }, 4000)
  }

  const reverseGeoAPICall = (data) => {
    Axios.get(`https://us1.locationiq.com/v1/reverse?key=pk.2dd9b328ed0803c41448fc0c3ba30cd4&lat=${data.latLng.lat()}&lon=${data.latLng.lng()}&format=json`)
    .then((response) => {
      // console.log(response.data);
      // setcenterMap({ lat: parseFloat(response.data.lat), lng: parseFloat(response.data.lon) })
      dispatch({ type: SET_CENTER_MAP, centermap: { lat: parseFloat(response.data.lat), lng: parseFloat(response.data.lon) } })
      dispatch({ type: SET_SELECTED_AREA, selectedarea: {
        status: true,
        data: {
            fullAddress: response.data.display_name,
            coordinates: {
                lat: data.latLng.lat(),
                lng: data.latLng.lng()
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

  const transferDatatoInput = () => {
    dispatch({ type: SET_SELECTED_AREA_INPUT, selectedareainput: {
      ...selectedareainput,
      longitude: selectedarea.data.coordinates.lng,
      latitude: selectedarea.data.coordinates.lat,
      stationAddress: selectedarea.data.fullAddress
    } })
  }

  const updateBSStatus = (id, newStatus) => {
    Axios.post(`${URL}/admin/updateStopStatus`, {
      stopID: id,
      stopStatus: newStatus
    },{
      headers:{
        "x-access-token": localStorage.getItem("token")
      }
    }).then((response) => {
      if(response.data.status){
        alertPrompt(true, response.data.result.message)
      }
      else{
        alertPrompt(false, response.data.result.message)
      }
    }).catch((err) => {
      alertPrompt(false, "Connection Error!")
      console.log(err)
    })
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
      {busstopslist.map((data, i) => {
        return(
          <Marker
            icon={{
              url: data.status? OpennedIcon : ClosedIcon,
              anchor: new google.maps.Point(25, 25),
              scaledSize: new google.maps.Size(25, 25),
            }}
            onClick={() => { dispatch({ type: SET_SELECTED_MARKER, selectedmarker: data.busStopID }) }}
            key={i}
            position={{lat: parseFloat(data.coordinates.latitude), lng: parseFloat(data.coordinates.longitude)}}
          >
            {selectedMarker == data.busStopID? (
              <InfoWindow onCloseClick={() => {
                dispatch({ type: SET_SELECTED_MARKER, selectedmarker: null })
              }}>
                <div className='div_infowindow_existing_bs'>
                  <p id='p_stationName'>{data.stationName}</p>
                  <table id='table_existing_bs'>
                    <tbody>
                      <tr>
                        <th>Bus Stop ID</th>
                        <td>{data.busStopID}</td>
                      </tr>
                      <tr>
                        <th>Status</th>
                        <motion.td
                        animate={{
                          color: data.status? "lime" : "red"
                        }}
                        >{data.status? "Open" : "Closed"}</motion.td>
                      </tr>
                      <tr>
                        <th>Date Added</th>
                        <td>{data.dateAdded}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div id='div_btns_infowinfow'>
                    <motion.button
                    animate={{
                      backgroundColor: data.status? "red" : "lime"
                    }}
                    className='btn_infoWindow_existing_bs' onClick={() => { updateBSStatus(data.busStopID, data.status? false : true) }}>{data.status? "Close Station" : "Open Station"}</motion.button>
                    <button className='btn_infoWindow_existing_bs' onClick={() => {  }}>View Details</button>
                  </div>
                </div>
              </InfoWindow>
            ) : null}
          </Marker>
        )
      })}
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
            <InfoWindow onCloseClick={() => {
              dispatch({ type: SET_SELECTED_AREA, selectedarea: selectedAreaState})
            }}
            zIndex={2}
            >
              <div id='div_selected_area'>
                <p id='p_label_window'>Area Information</p>
                <p className='full_address_label'>Full Address</p>
                <p className='p_data_area'>{selectedarea.data.fullAddress}</p>
                <p className='full_address_label'>Coordinates</p>
                <p className='p_data_area_coords'>Longitude: {selectedarea.data.coordinates.lng}</p>
                <p className='p_data_area_coords'>Latitude: {selectedarea.data.coordinates.lat}</p>
                <div id='div_btns_infowinfow'>
                  <button className='btn_infoWindow' onClick={() => { transferDatatoInput() }}>Input Data</button>
                  <button className='btn_infoWindow' onClick={() => { closeInfoWindow() }}>Close</button>
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