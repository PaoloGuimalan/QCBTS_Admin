import React, { useState, useRef, useEffect } from 'react'
import '../../styles/maincompstyles/MainIndex.css'
import { GoogleMap, withGoogleMap, withScriptjs, Polygon, InfoWindow, Marker, Polyline } from 'react-google-maps';
import Axios from 'axios'
import QCPath from '../../json/QCPath.json'
import IconsDisplay from '../../json/IconsDisplay';
import { useDispatch, useSelector } from 'react-redux';
import { SET_ALERT, SET_CENTER_MAP, SET_ROUTE_MAKER_LIST, SET_SELECTED_AREA, SET_SELECTED_AREA_INPUT, SET_SELECTED_DETAILS, SET_SELECTED_LIVE_BUS, SET_SELECTED_MARKER } from '../../redux/types';
import { selectedAreaInputState, selectedAreaState, selectedDetailsState, setselecteddetails } from '../../redux/actions';
import BusStopSelectionIcon from '../../resources/Pan_Blue_Circle.png'
import { motion } from 'framer-motion'
import OpennedIcon from '../../resources/OpenStop.png'
import ClosedIcon from '../../resources/ClosedStop.png'
import LiveBusIcon from '../../resources/livebus.png'
import { URL } from '../../json/urlconfig'

function Map(){

  const busstopslist = useSelector(state => state.busstopslist);
  const mapmode = useSelector(state => state.mapmode);
  const selectedarea = useSelector(state => state.selectedarea);
  const selectedareainput = useSelector(state => state.selectedareainput);
  const centerMap = useSelector(state => state.centermap);
  const selectedMarker = useSelector(state => state.selectedmarker);
  const selecteddetails = useSelector(state => state.selecteddetails);
  const routepath = useSelector(state => state.routepath);
  const routestatusloader = useSelector(state => state.routestatusloader);
  const savedroutepath = useSelector(state => state.savedroutepath);
  const routemakerlist = useSelector(state => state.routemakerlist);
  const livebuslist = useSelector(state => state.livebuslist)
  const selectedlivebus = useSelector(state => state.selectedlivebus);
  const publicroutelist = useSelector(state => state.publicroutelist)
  const livemapicon = useSelector(state => state.livemapicon);
  const selectlayout = useSelector(state => state.selectlayout);
  const checkboxfilter = useSelector(state => state.checkboxfilter);
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
      dispatch({ type: SET_SELECTED_LIVE_BUS, selectedlivebus: ""})
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
        if(selecteddetails.status && (selecteddetails.busStopID == id)){
          setSelectedDetailsWindow(id)
        }
      }
      else{
        alertPrompt(false, response.data.result.message)
      }
    }).catch((err) => {
      alertPrompt(false, "Connection Error!")
      console.log(err)
    })
  }

  const setSelectedDetailsWindow = (passdataID) => {
    //Fetch data in server and put this function in useEffect where conditioned if buslist changes and if status is true
    Axios.get(`${URL}/admin/getSpecificBusStopData/${passdataID}`, {
      headers:{
        "x-access-token": localStorage.getItem("token")
      }
    }).then((response) => {
      if(response.data.status){
        dispatch({ type: SET_SELECTED_DETAILS, selecteddetails: {
          status: true,
          busStopID: response.data.result.busStopID,
          data: {
              stationName: response.data.result.stationName,
              stationAddress: response.data.result.stationAddress,
              coordinates: {
                  longitude: response.data.result.coordinates.longitude,
                  latitude: response.data.result.coordinates.latitude
              },
              dateAdded: response.data.result.dateAdded,
              addedBy: response.data.result.addedBy,
              status: response.data.result.status
          }
        } })
      }
      else{
        console.log(response.data.result.message)
      }
    }).catch((err) => {
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
        fullscreenControl:false,
        maxZoom: 0,
        minZoom: 12,
        disableDefaultUI: true,
        style: IconsDisplay,
        mapTypeId: selectlayout
        // mapTypeId: 'satellite'
        // mapTypeId: livemapicon? google.maps.MapTypeId.HYBRID : 'satellite' //roadmap, satellite, terrain, hybrid
      }}
      onClick={(data) => {
        // reverseGeoAPICall(data)
        clickMapArea(data)
      }}
    >
      {checkboxfilter.activeBuses? (
        livebuslist.map((lbs, i) => {
          return(
            <Marker
              icon={{
                url: LiveBusIcon,
                anchor: new google.maps.Point(25, 25),
                scaledSize: new google.maps.Size(25, 25),
              }}
              onClick={() => { dispatch({ type: SET_SELECTED_LIVE_BUS, selectedlivebus: lbs.userID }) }}
              key={i}
              position={{lat: parseFloat(lbs.latitude), lng: parseFloat(lbs.longitude)}}
            >
              {selectedlivebus == lbs.userID? (
                <InfoWindow onCloseClick={() => {
                  dispatch({ type: SET_SELECTED_LIVE_BUS, selectedlivebus: "" })
                }}>
                  <div className='div_infowindow_live_bs'>
                    <LiveBusComponent lbs={lbs} />
                  </div>
                </InfoWindow>
              ) : null}
            </Marker>
          )
        })
      ) : null}

      {checkboxfilter.selectedbusroutepreview? (
        livebuslist.map((lbs, i) => {
          if(selectedlivebus == lbs.userID){
            return(
              publicroutelist.map((pblrl, j) => {
                if(pblrl.routeID == lbs.routeID){
                  // console.log(pblrl.routePath)
                  return(
                    <Polyline
                      draggable={false}
                      editable={false}
                      path={pblrl.routePath}
                      options={{
                        fillColor: "transparent",
                        strokeColor: "yellow",
                        strokeWeight: 4
                      }}
                    />
                  )
                }
              })
            )
          }
        })
      ) : null}

      {busstopslist.map((data, i) => {
        if(data.status){
          return(checkboxfilter.openedStops? (
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
                        {data.status? (
                          <motion.button
                          animate={{
                            backgroundColor: "lime",
                            display: mapmode == "routes"? "block" : "none"
                          }}
                          className='btn_infoWindow_existing_bs' onClick={() => { 
                            dispatch({ type: SET_ROUTE_MAKER_LIST, routemakerlist: [
                            ...routemakerlist,
                            {
                              pendingID: Math.floor(Math.random() * 100000),
                              stationID: data.busStopID,
                              stationName: data.stationName,
                              coordinates: [
                                data.coordinates.longitude,
                                data.coordinates.latitude
                              ]
                            }] }) 
                            dispatch({ type: SET_SELECTED_MARKER, selectedmarker: null })
                          }}>{routemakerlist.length == 0? "Create Route" : "Add to Routes"}</motion.button>
                        ) : null}
                        <motion.button
                        animate={{
                          backgroundColor: data.status? "red" : "lime"
                        }}
                        className='btn_infoWindow_existing_bs' onClick={() => { updateBSStatus(data.busStopID, data.status? false : true) }}>{data.status? "Close Station" : "Open Station"}</motion.button>
                        <button className='btn_infoWindow_existing_bs' onClick={() => { setSelectedDetailsWindow(data.busStopID) }}>View Details</button>
                      </div>
                    </div>
                  </InfoWindow>
                ) : null}
              </Marker>
          ) : null)
        }
        else{
          return(checkboxfilter.closedStops? (
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
                        {data.status? (
                          <motion.button
                          animate={{
                            backgroundColor: "lime",
                            display: mapmode == "routes"? "block" : "none"
                          }}
                          className='btn_infoWindow_existing_bs' onClick={() => { 
                            dispatch({ type: SET_ROUTE_MAKER_LIST, routemakerlist: [
                            ...routemakerlist,
                            {
                              pendingID: Math.floor(Math.random() * 100000),
                              stationID: data.busStopID,
                              stationName: data.stationName,
                              coordinates: [
                                data.coordinates.longitude,
                                data.coordinates.latitude
                              ]
                            }] }) 
                            dispatch({ type: SET_SELECTED_MARKER, selectedmarker: null })
                          }}>{routemakerlist.length == 0? "Create Route" : "Add to Routes"}</motion.button>
                        ) : null}
                        <motion.button
                        animate={{
                          backgroundColor: data.status? "red" : "lime"
                        }}
                        className='btn_infoWindow_existing_bs' onClick={() => { updateBSStatus(data.busStopID, data.status? false : true) }}>{data.status? "Close Station" : "Open Station"}</motion.button>
                        <button className='btn_infoWindow_existing_bs' onClick={() => { setSelectedDetailsWindow(data.busStopID) }}>View Details</button>
                      </div>
                    </div>
                  </InfoWindow>
                ) : null}
              </Marker>
          ) : null)
        }
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
      {checkboxfilter.createroutepreview? (
        routepath.length != 0? (
          <Polyline
            draggable={false}
            editable={false}
            path={routepath}
            options={{
              fillColor: "transparent",
              strokeColor: "orange",
              strokeWeight: 4
            }}
          />
        ) : null
      ) : null}
      {checkboxfilter.routes? (
        savedroutepath.routePath.length != 0? (
          <Polyline
            draggable={false}
            editable={false}
            path={savedroutepath.routePath}
            options={{
              fillColor: "transparent",
              strokeColor: !savedroutepath.status? "lime" : "red",
              strokeWeight: 4
            }}
          />
        ) : null
      ) : null}
    </GoogleMap>
  )
}

function LiveBusComponent({lbs}){

  const [expandLiveBusInfo, setexpandLiveBusInfo] = useState(false)

  return(
    <motion.div
      className='div_livebuscomponent'
      initial={{
        width: "100%",
        overflowY: "hidden",
        cursor: "pointer"
      }}
      animate={{
        height: expandLiveBusInfo? "auto" : "25px",
        overflowY: expandLiveBusInfo? "hidden" : "hidden"
      }}
    >
      <p id='p_stationName'
        onClick={() => { setexpandLiveBusInfo(!expandLiveBusInfo) }}
      >LIVE BUS - {lbs.busID}</p>
      <table id='table_existing_bs'>
        <tbody>
          <tr>
            <th className='th_live_bs'>Bus Route</th>
            <td>{lbs.routeName}</td>
          </tr>
          <tr>
            <th className='th_live_bs'>Driver</th>
            <td>{lbs.firstName} {lbs.middleName == "N/A"? "" : lbs.middleName} {lbs.lastName}</td>
          </tr>
          <tr>
            <th className='th_live_bs'>Company</th>
            <td>{lbs.companyID}</td>
          </tr>
          <tr>
            <th className='th_live_bs'>Plate Number</th>
            <td>{lbs.plateNumber}</td>
          </tr>
        </tbody>
      </table>
      <div id='div_btns_infowinfow'>
        <button className='btn_infoWindow_live_bs' onClick={() => {  }}>View Bus Info</button>
        <button className='btn_infoWindow_live_bs' onClick={() => {  }}>View Driver Info</button>
      </div>
    </motion.div>
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