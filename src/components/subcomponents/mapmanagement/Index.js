import React, { useState, useEffect } from 'react'
import MainIndex from '../../maincomponents/MainIndex'
import '../../../styles/subcomponents/Mapmanagement.css'
import MapIcon from '@material-ui/icons/Map'
import InfoIcon from '@material-ui/icons/Info'
import MenuIcon from '@material-ui/icons/Menu'
import CloseIcon from '@material-ui/icons/Close'
import { motion, useVisualElementContext } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { SET_MAP_MODE, SET_SELECTED_AREA } from '../../../redux/types/index'
import { selectedAreaState } from '../../../redux/actions'

function Index() {

  const mapmode = useSelector(state => state.mapmode);
  const dispatch = useDispatch();

  const [menutrigger, setmenutrigger] = useState(false);

  useEffect(() => {

    return () => {
      dispatch({ type: SET_MAP_MODE, mapmode: "none" })
    }
  },[])

  const BusStopMenuClose = () => {
    dispatch({ type: SET_MAP_MODE, mapmode: "none" })
    dispatch({ type: SET_SELECTED_AREA, selectedarea: selectedAreaState })
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
                          <tr className='tr_content_bus_stops_list'>
                            <td>HJSHD</td>
                            <td>aksdjh</td>
                          </tr>
                          <tr className='tr_content_bus_stops_list'>
                            <td>HJSHD</td>
                            <td>aksdjh</td>
                          </tr>
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
                      <input className='input_stations' type='text' id='longitude' name='longitude' placeholder='Longitude' />
                      <input className='input_stations' type='text' id='latitude' name='latitude' placeholder='Latitude' />
                      <p className='label_inputs_stations'>Station</p>
                      <input className='input_stations' type='text' id='stationName' name='stationName' placeholder='Station Name' />
                      <input className='input_stations' type='text' id='stationAddress' name='stationAddress' placeholder='Station Address' />
                      <div id='div_btns_add_station'>
                        <button className='btn_add_station_indvs'>Go To</button>
                        <button className='btn_add_station_indvs'>Save</button>
                        <button className='btn_add_station_indvs'>Clear</button>
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