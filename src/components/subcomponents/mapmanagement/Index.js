import React, { useState, useEffect } from 'react'
import MainIndex from '../../maincomponents/MainIndex'
import '../../../styles/subcomponents/Mapmanagement.css'
import MapIcon from '@material-ui/icons/Map'
import InfoIcon from '@material-ui/icons/Info'
import MenuIcon from '@material-ui/icons/Menu'
import CloseIcon from '@material-ui/icons/Close'
import { motion, useVisualElementContext } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { SET_ALERT, SET_BUS_STOPS_LIST, SET_CENTER_MAP, SET_MAP_MODE, SET_SELECTED_AREA, SET_SELECTED_AREA_INPUT, SET_SELECTED_MARKER } from '../../../redux/types/index'
import { selectedAreaInputState, selectedAreaState } from '../../../redux/actions'
import Axios from 'axios'
import { URL } from '../../../json/urlconfig'

function Index() {

  const busstopslist = useSelector(state => state.busstopslist);
  const mapmode = useSelector(state => state.mapmode);
  const selectedareainput = useSelector(state => state.selectedareainput);
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
      }
      else{
        subscribeBusStopData()
      }
    }).catch((err) => {
      console.log(err);
      subscribeBusStopData();
    })
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
                                dispatch({ type: SET_SELECTED_MARKER, selectedmarker: list })
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
        <MainIndex />
    </div>
  )
}

export default Index