import React, { useState, useEffect } from 'react'
import MainIndex from '../../maincomponents/MainIndex'
import '../../../styles/subcomponents/Mapmanagement.css'
import MapIcon from '@material-ui/icons/Map'
import InfoIcon from '@material-ui/icons/Info'
import MenuIcon from '@material-ui/icons/Menu'
import CloseIcon from '@material-ui/icons/Close'
import { motion, useVisualElementContext } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { SET_ALERT, SET_BUS_STOPS_LIST, SET_CENTER_MAP, SET_MAP_MODE, SET_SELECTED_AREA, SET_SELECTED_AREA_INPUT, SET_SELECTED_DETAILS, SET_SELECTED_MARKER } from '../../../redux/types/index'
import { selectedAreaInputState, selectedAreaState, selectedDetailsState } from '../../../redux/actions'
import Axios from 'axios'
import { URL } from '../../../json/urlconfig'

function Index() {

  const busstopslist = useSelector(state => state.busstopslist);
  const mapmode = useSelector(state => state.mapmode);
  const selectedareainput = useSelector(state => state.selectedareainput);
  const selecteddetails = useSelector(state => state.selecteddetails);
  const centerMap = useSelector(state => state.centermap);
  const selectedMarker = useSelector(state => state.selectedmarker);
  const dispatch = useDispatch();

  const [menutrigger, setmenutrigger] = useState(false);

  useEffect(() => {

    initBusStopsData();
    subscribeBusStopData();

    return () => {
      dispatch({ type: SET_MAP_MODE, mapmode: "none" })
      dispatch({ type: SET_SELECTED_AREA_INPUT, selectedareainput: selectedAreaInputState })
      dispatch({ type: SET_CENTER_MAP, centermap: { lat: 14.647296, lng: 121.061376 }})
      dispatch({ type: SET_SELECTED_MARKER, selectedmarker: null })
    }
  },[])

  const initBusStopsData = () => {
    Axios.get(`${URL}/admin/initBusStopsData`, {
      headers:{
        "x-access-token": localStorage.getItem("token")
      }
    }).then((response) => {
      if(response.data.status){
        // console.log(response.data.result);
        dispatch({ type: SET_BUS_STOPS_LIST, busstopslist: response.data.result })
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  const subscribeBusStopData = () => {
    Axios.get(`${URL}/admin/busStopsDataSubscribe`, {
      headers:{
        "x-access-token": localStorage.getItem("token")
      }
    }).then((response) => {
      if(response.data.status){
        dispatch({ type: SET_BUS_STOPS_LIST, busstopslist: response.data.result })
        subscribeBusStopData()
        setSelectedDetailsWindow(selecteddetails.busStopID)
      }
      else{
        subscribeBusStopData()
        setSelectedDetailsWindow(selecteddetails.busStopID)
      }
    }).catch((err) => {
      // console.log(err);
      subscribeBusStopData();
      initBusStopsData();
      setSelectedDetailsWindow(selecteddetails.busStopID)
    })
  }

  const deleteBusStop = (id) => {
    Axios.get(`${URL}/admin/deleteBusStop/${id}`, {
      headers:{
        "x-access-token": localStorage.getItem("token")
      }
    }).then((response) => {
      if(response.data.status){
        StationDetailsClose()
        dispatch({ type: SET_SELECTED_MARKER, selectedmarker: null })
        alertPrompt(true, response.data.result.message)
      }
      else{
        alertPrompt(false, response.data.result.message)
      }
    }).catch((err) => {
      alertPrompt(false, "Cannot process deletion")
      console.log(err)
    })
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
    if(selecteddetails.status){
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
  }

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


  const BusStopMenuClose = () => {
    dispatch({ type: SET_MAP_MODE, mapmode: "none" })
    dispatch({ type: SET_SELECTED_AREA, selectedarea: selectedAreaState })
  }

  const clearInputs = () => {
    dispatch({ type: SET_SELECTED_AREA_INPUT, selectedareainput: selectedAreaInputState })
  }

  const saveBusStopData = () => {
    if(selectedareainput.longitude != "" && selectedareainput.latitude != "" && selectedareainput.stationName != "" && selectedareainput.stationAddress != ""){
      Axios.post(`${URL}/admin/addBusStop`, {
        stationName: selectedareainput.stationName,
        stationAddress: selectedareainput.stationAddress,
        longitude: selectedareainput.longitude,
        latitude: selectedareainput.latitude
      },{
        headers:{
          "x-access-token": localStorage.getItem("token")
        }
      }).then((response) => {
        if(response.data.status){
          alertPrompt(true, "A Stop has been Added!")
          clearInputs()
        }
        else{
          alertPrompt(false, response.data.result.message)
        }
      }).catch((err) => {
        alertPrompt(false, "Request Error occured!")
        console.log(err);
      })
    }
    else{
      alertPrompt(false, "Please provide a complete data!");
    }
  }

  const StationDetailsClose = () => {
    dispatch({ type: SET_SELECTED_DETAILS, selecteddetails: {
      ...selectedDetailsState,
      status: false
    } })
  }

  return (
    <div id='div_submap'>
        <div id='div_map_header' className='absolute_divs_map'>
          <div id='div_iconheader_holder'>
            <MapIcon />
            <p>Welcome | Map Management</p>
          </div>
          <div id='info_div'>
            <button id='btn_info' onClick={() => { setmenutrigger(!menutrigger) }}><MenuIcon /></button>
          </div>
        </div>
        <motion.div
        animate={{
          marginLeft: menutrigger? "10px" : "-240px"
        }}
        id='div_menu_options' className='absolute_divs_map'>
          <nav id='nav_menu_options'>
            <li>
              <p id='menu_label'>Menu</p>
            </li>
            <li>
              <div id='div_menu_btns'>
                <button className='btn_menu_navigations'>Live Map</button>
                <button className='btn_menu_navigations' onClick={() => { dispatch({ type: SET_MAP_MODE, mapmode: "bus_stops" }) }}>Bus Stops</button>
                <button className='btn_menu_navigations'>Routes</button>
              </div>
            </li>
          </nav>
        </motion.div>
        <motion.div
        animate={{
          right: mapmode == "bus_stops"? "10px" : "-460px"
        }}
        id='div_bus_stops_menu' className='absolute_divs_map'>
          <nav id='nav_bus_stops_menu'>
            <li id='li_bus_stops_menu_header'>
              <div id='div_bus_stops_header'>
                <p id='div_bus_stops_label'>Bus Stops Menu</p>
                <button id='btn_bus_stops_close' onClick={() => { BusStopMenuClose() }}><CloseIcon /></button>
              </div>
            </li>
            <li id='li_bus_stops_data_holder'>
              <nav id='nav_bus_stops_data_section'>
                <li className='li_bus_stops_data_section'>
                  <div id='div_bus_stops_list'>
                    <div id='div_bus_stops_list_container'>
                      <table id='tbl_bus_stops_list'>
                        <tbody>
                          <tr id='tr_header_bus_stops_list'>
                            <th className='th_header_bus_stops_list'>BS ID</th>
                            <th className='th_header_bus_stops_list'>Station Name</th>
                          </tr>
                          {busstopslist.map((list, i) => {
                            return(
                              <tr onClick={() => {
                                dispatch({ type: SET_CENTER_MAP, centermap: { lat: parseFloat(list.coordinates.latitude), lng: parseFloat(list.coordinates.longitude) }})
                                dispatch({ type: SET_SELECTED_MARKER, selectedmarker: list.busStopID })
                              }} key={i} className='tr_content_bus_stops_list'>
                                <td>{list.busStopID}</td>
                                <td>{list.stationName}</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </li>
                <li className='li_bus_stops_data_section'>
                  <div id='div_add_station'>
                    <p id='label_add_station'>Add a Station</p>
                    <div id='div_add_station_inputs'>
                      <p className='label_inputs_stations'>Coordinates</p>
                      <input value={selectedareainput.longitude} onChange={(e) => { dispatch({ type: SET_SELECTED_AREA_INPUT, selectedareainput: {
                        ...selectedareainput,
                        longitude: e.target.value
                      } }) }} className='input_stations' type='text' id='longitude' name='longitude' placeholder='Longitude' />
                      <input value={selectedareainput.latitude} onChange={(e) => { dispatch({ type: SET_SELECTED_AREA_INPUT, selectedareainput: {
                        ...selectedareainput,
                        latitude: e.target.value
                      } }) }} className='input_stations' type='text' id='latitude' name='latitude' placeholder='Latitude' />
                      <p className='label_inputs_stations'>Station</p>
                      <input value={selectedareainput.stationName} onChange={(e) => { dispatch({ type: SET_SELECTED_AREA_INPUT, selectedareainput: {
                        ...selectedareainput,
                        stationName: e.target.value
                      } }) }} className='input_stations' type='text' id='stationName' name='stationName' placeholder='Station Name' />
                      <input value={selectedareainput.stationAddress} onChange={(e) => { dispatch({ type: SET_SELECTED_AREA_INPUT, selectedareainput: {
                        ...selectedareainput,
                        stationAddress: e.target.value
                      } }) }} className='input_stations' type='text' id='stationAddress' name='stationAddress' placeholder='Station Address' />
                      <div id='div_btns_add_station'>
                        <button className='btn_add_station_indvs'>Go To</button>
                        <button className='btn_add_station_indvs' onClick={() => { saveBusStopData() }}>Save</button>
                        <button className='btn_add_station_indvs' onClick={() => { clearInputs() }}>Clear</button>
                      </div>
                    </div>
                  </div>
                </li>
              </nav>
            </li>
          </nav>
        </motion.div>
        <motion.div
        animate={{
          right: selecteddetails.status? "10px" : "-310px"
        }}
        id='div_selected_details' className='absolute_divs_map'>
        <nav id='nav_bus_stops_menu'>
            <li id='li_bus_stops_menu_header'>
              <div id='div_bus_stops_header'>
                <p id='div_bus_stops_label'>Station</p>
                <button id='btn_bus_stops_close' onClick={() => { StationDetailsClose() }}><CloseIcon /></button>
              </div>
            </li>
            <li id='li_station_data_holder'>
              <div id='div_stationdetails'>
                <div id='div_stationdetailstable_handler'>
                  <p id='selectedstation_label_name'>
                    <motion.div
                    animate={{
                      backgroundColor: selecteddetails.data.status? "blue" : "red"
                    }}
                    id='div_selecteddetails_status'>&nbsp;</motion.div>
                    {selecteddetails.data.stationName}
                  </p>
                  <table id='tbl_stationdetails'>
                    <tbody>
                      <tr className='tr_stationdetails'>
                        <th className='th_stationdetails'>Station ID</th>
                        <td className='td_stationdetails'>{selecteddetails.busStopID} - {selecteddetails.data.status? "Open" : "Closed"}</td>
                      </tr>
                      <tr className='tr_stationdetails'>
                        <th className='th_stationdetails'>Address</th>
                        <td className='td_stationdetails'>{selecteddetails.data.stationAddress}</td>
                      </tr>
                      <tr className='tr_stationdetails'>
                        <th className='th_stationdetails'>Coordinates</th>
                        <td className='td_stationdetails'>Lng: {selecteddetails.data.coordinates.longitude} <br /> Lat: {selecteddetails.data.coordinates.latitude}</td>
                      </tr>
                      <tr className='tr_stationdetails'>
                        <th className='th_stationdetails'>Date Added</th>
                        <td className='td_stationdetails'>{selecteddetails.data.dateAdded}</td>
                      </tr>
                      <tr className='tr_stationdetails'>
                        <th className='th_stationdetails'>Added By</th>
                        <td className='td_stationdetails'>{selecteddetails.data.addedBy}</td>
                      </tr>
                    </tbody>
                  </table>
                  <div id='div_selecteddetails_btn'>
                    <motion.button
                    animate={{
                      backgroundColor: selecteddetails.data.status? "red" : "lime"
                    }}
                    onClick={() => { updateBSStatus(selecteddetails.busStopID, selecteddetails.data.status? false : true) }}
                    className='btn_selecteddetails'>{selecteddetails.data.status? "Close Station" : "Open Station"}</motion.button>
                    <button className='btn_selecteddetails'>Edit</button>
                    <button className='btn_selecteddetails' onClick={() => { deleteBusStop(selecteddetails.busStopID) }} >Delete</button>
                  </div>
                </div>
                <p>...</p>
              </div>
            </li>
          </nav>
        </motion.div>
        <MainIndex />
    </div>
  )
}

export default Index