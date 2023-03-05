import React, { useState, useEffect } from 'react'
import MainIndex from '../../maincomponents/MainIndex'
import '../../../styles/subcomponents/Mapmanagement.css'
import MapIcon from '@material-ui/icons/Map'
import InfoIcon from '@material-ui/icons/Info'
import MenuIcon from '@material-ui/icons/Menu'
import CloseIcon from '@material-ui/icons/Close'
import { motion, useVisualElementContext } from 'framer-motion'
import { useDispatch, useSelector } from 'react-redux'
import { SET_ROUTE_PATH, SET_PUBLIC_ROUTE_LIST, SET_ALERT, SET_BUS_STOPS_LIST, SET_CENTER_MAP, SET_MAP_MODE, SET_SELECTED_AREA, SET_SELECTED_AREA_INPUT, SET_SELECTED_DETAILS, SET_SELECTED_MARKER, SET_SAVED_ROUTE_PATH, SET_ROUTE_LIST, SET_ROUTE_MAKER_LIST, SET_ROUTE_STATUS_LOADER, SET_BUS_STOP_INFO, SET_LIVE_BUST_LIST } from '../../../redux/types/index'
import { savedroutepathState, selectedAreaInputState, selectedAreaState, selectedDetailsState } from '../../../redux/actions'
import Axios from 'axios'
import { EXT_URL, URL } from '../../../json/urlconfig'

function Index() {

  const busstopslist = useSelector(state => state.busstopslist);
  const mapmode = useSelector(state => state.mapmode);
  const selectedareainput = useSelector(state => state.selectedareainput);
  const selecteddetails = useSelector(state => state.selecteddetails);
  const centerMap = useSelector(state => state.centermap);
  const selectedMarker = useSelector(state => state.selectedmarker);
  const livebuslist = useSelector(state => state.livebuslist)
  const dispatch = useDispatch();

  const authdetails = useSelector(state => state.authdetails);

  const routestatusloader = useSelector(state => state.routestatusloader);
  const routelist = useSelector(state => state.routelist)
  const publicroutelist = useSelector(state => state.publicroutelist)
  const routemakerlist = useSelector(state => state.routemakerlist);
  const routepath = useSelector(state => state.routepath);
  const savedroutepath = useSelector(state => state.savedroutepath);
  
  const [routename, setroutename] = useState("");
  const [routePrivacy, setroutePrivacy] = useState(false);

  let routepathholder = [];
  let routepathdeconstruct = [];
  let routepathdeconstructlocation = [];

  let cancelAxios;

  const [menutrigger, setmenutrigger] = useState(false);

  useEffect(() => {

    initBusStopsData();
    initRoutesList()
    initPublicRoutesList()
    // subscribeBusStopData();

    return () => {
      dispatch({ type: SET_SAVED_ROUTE_PATH, savedroutepath: savedroutepathState })
      dispatch({ type: SET_MAP_MODE, mapmode: "none" })
      dispatch({ type: SET_SELECTED_AREA_INPUT, selectedareainput: selectedAreaInputState })
      dispatch({ type: SET_CENTER_MAP, centermap: { lat: 14.647296, lng: 121.061376 }})
      dispatch({ type: SET_SELECTED_MARKER, selectedmarker: null })
      cancelAxios.cancel()
    }
  },[])

  const initPublicRoutesList = () => {
    Axios.get(`${URL}/company/publicRouteList`, {
      headers:{
        "x-access-token": localStorage.getItem("token")
      }
    }).then((response) => {
      if(response.data.status){
        // console.log(response.data.result)
        dispatch({ type: SET_PUBLIC_ROUTE_LIST, publicroutelist: response.data.result })
      }
      else{
        console.log(response.data.result.message)
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  const initRoutesList = () => {
    Axios.get(`${URL}/company/routesList/${authdetails.userID}`, {
      headers:{
        "x-access-token": localStorage.getItem("token")
      }
    }).then((response) => {
      if(response.data.status){
        // console.log(response.data.result)
        dispatch({ type: SET_ROUTE_LIST, routelist: response.data.result })
      }
      else{
        console.log(response.data.result.message)
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  const initBusStopsData = () => {
    Axios.get(`${URL}/admin/initBusStopsData`, {
      headers:{
        "x-access-token": localStorage.getItem("token")
      }
    }).then((response) => {
      if(response.data.status){
        // console.log(response.data.result);
        cancelAxios = undefined
        if(typeof cancelAxios != typeof undefined){
          cancelAxios.cancel()
          subscribeBusStopData()
        }
        else{
          subscribeBusStopData()
        }
        dispatch({ type: SET_BUS_STOPS_LIST, busstopslist: response.data.result })
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  const subscribeBusStopData = () => {
    if(typeof cancelAxios != typeof undefined){
      cancelAxios.cancel()
    }
    else{
      cancelAxios = Axios.CancelToken.source()
      Axios.get(`${URL}/admin/busStopsDataSubscribe`, {
        headers:{
          "x-access-token": localStorage.getItem("token")
        },
        cancelToken: cancelAxios.token
      }).then((response) => {
        if(response.data.status){
          cancelAxios = undefined
          initBusStopsData()
          // dispatch({ type: SET_BUS_STOPS_LIST, busstopslist: response.data.result })
          setSelectedDetailsWindow(selecteddetails.busStopID)
        }
        else{
          initBusStopsData()
          setSelectedDetailsWindow(selecteddetails.busStopID)
        }
      }).catch((err) => {
        // console.log(err);
        if(err.message != 'canceled'){
          initBusStopsData();
        }
        setSelectedDetailsWindow(selecteddetails.busStopID)
      })
    }
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

  const routeCallAPI = () => {
    if(mapmode == "routes"){
      if(routemakerlist.length > 1){
        let pendingCoordinates = []
        let paringCoordinates = []

        routemakerlist.map((rtlst, i) => {
          if(i != 0){
            paringCoordinates.push([
              // routemakerlist[i - 1].pendingID,
              routemakerlist[i - 1].coordinates,
              // rtlst.pendingID,
              rtlst.coordinates
            ])
          }
          pendingCoordinates.push(rtlst.coordinates)

          if(routemakerlist.length - 1 == i){
            // console.log(paringCoordinates)
            // paringCoordinates.map((mps, i) => {
            //   // setTimeout(() => {
            //   //   directionsAPI(mps[0][0],mps[0][1],mps[1][0],mps[1][1])
            //   // }, 15000)
            //   setTimeout(() => {
            //     factoryFunc(mps[0][0],mps[0][1],mps[1][0],mps[1][1])
            //   },5000)
            //   // console.log(`${mps[0][0]} | ${mps[0][1]} || ${mps[1][0]} | ${mps[1][1]}`)
            // })
            directionsAPI(paringCoordinates, 0, pendingCoordinates.length - 1)
            dispatch({ type: SET_ROUTE_STATUS_LOADER, routestatusloader: { loading: true, percentage: 0 } })
            // console.log(paringCoordinates)
          }
        })
      }
      else{
        alert("Please add 2 or more stations");
      }
    }
  }

  const directionsAPI = (arraydata, currentIndex, arraylength) => {
    let indexCounter = currentIndex + 1;
    let long1 = arraydata[currentIndex][0][0]
    let lat1 = arraydata[currentIndex][0][1]
    let long2 = arraydata[currentIndex][1][0]
    let lat2 = arraydata[currentIndex][1][1]

    setTimeout(() => {
      Axios.get(`https://us1.locationiq.com/v1/directions/driving/${long1},${lat1};${long2},${lat2}?key=pk.2dd9b328ed0803c41448fc0c3ba30cd4&steps=true&alternatives=true&geometries=polyline&overview=full`)
      .then((response) => {
        // console.log(response.data);
        // setcenterMap({ lat: parseFloat(response.data.lat), lng: parseFloat(response.data.lon) })
        // console.log(`${currentIndex} | ${indexCounter} | ${arraylength}`)
        dispatch({ type: SET_ROUTE_STATUS_LOADER, routestatusloader: { loading: true, percentage: indexCounter / arraylength * 100 } })
        // console.log(response.data)
        // console.log(response.data.routes[0].legs[0])
        // dispatch({ type: SET_ROUTE_PATH, routepath: [
        //   ...routepath,
        //   ...response.data.routes[0].legs[0].steps
        // ] })
        routepathholder.push(...response.data.routes[0].legs[0].steps);

        if(indexCounter != arraylength){
          directionsAPI(arraydata, indexCounter, arraylength)
        }
        else{
          routepathholder.map((data, i) => {
            routepathdeconstruct.push(...data.intersections)
          })

          routepathdeconstruct.map((data, i) => {
            routepathdeconstructlocation.push({lng: parseFloat(data.location[0]), lat: parseFloat(data.location[1])})
          })

          setTimeout(() => {
            // console.log(routepathdeconstructlocation)
            dispatch({ type: SET_ROUTE_PATH, routepath: routepathdeconstructlocation })
            dispatch({ type: SET_ROUTE_STATUS_LOADER, routestatusloader: { loading: false, percentage: 0 } })
          },2000)
          // console.log("Done")
          dispatch({ type: SET_ROUTE_STATUS_LOADER, routestatusloader: { loading: true, percentage: indexCounter / arraylength * 100 } })
        }
      })
      .catch((err) => {
        console.log(err.message);
      })
    }, 5000)
  }

  const clearPendingRouteData = () => {
    dispatch({ type: SET_ROUTE_MAKER_LIST, routemakerlist: [] })
    dispatch({ type: SET_ROUTE_PATH, routepath: [] })
    setroutename("");
  }

  const saveRoute = () => {
    if(routename == ""){
      alert("Please input a name for the route")
    }
    else{
      // console.log(routemakerlist)
      if(routemakerlist.length > 1){
        if(routepath.length > 1){
          Axios.post(`${URL}/company/createRoute`, {
            routeName: routename,
            stationList: routemakerlist,
            routePath: routepath,
            companyID: authdetails.userID,
            privacy: routePrivacy
          },{
            headers:{
              "x-access-token": localStorage.getItem("token")
            }
          }).then((response) => {
            if(response.data.status){
              console.log(response.data.result.message)
              clearPendingRouteData()
              initRoutesList()
              initPublicRoutesList()
              setroutePrivacy(false);
            }
            else{
              console.log(response.data.result.message)
            }
          }).catch((err) => {
            console.log(err);
          })
        }
        else{
          alert("Click first Preview Route to scan the Route Path")
        }
      }
      else{
        alert("Please add 2 or more stations")
      }
    }
  }

  useEffect(() => {
    // var interval = setInterval(() => {
    //     Axios.get(`${EXT_URL}/liveData`).then((response) => {
    //         var arrayData = Object.values(response.data)
    //         // var arrayDataLength = arrayData.filter((dt, i) => dt.userID == selectedlivebus.userID).length
    //         // console.log(arrayData)
    //         dispatch({type: SET_LIVE_BUST_LIST, livebuslist: arrayData})
    //         // console.log(arrayDataLength)
    //         // if(arrayDataLength == 0){
    //         //     if(status == 0){
    //         //         status += 1
    //         //         dispatch({ type: SET_SELECTED_LIVE_BUS, selectedlivebus: { userID: "", companyID: "" } })
    //         //         if(selectedlivebus.userID != ""){
    //         //             if(Platform.OS == "android"){
    //         //                 ToastAndroid.show("Bus went offline", ToastAndroid.SHORT)
    //         //             }
    //         //             else{
    //         //                 alert("Bus went offline")
    //         //             }
    //         //         }
    //         //         // console.log(status, arrayDataLength)
    //         //     }
    //         // }
    //     }).catch((err) => {
    //         console.log(err)
    //     })
    // },2000)

    // return () => {
    //     clearInterval(interval)
    //     // status = false;
    // }
},[])

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
          right: savedroutepath.routeID != null? "10px" : "-470px"
        }}
        id='div_routes_info' className='absolute_divs_map'>
          <div id='div_route_info_header'>
            <p id='p_route_info_label'>Route Info - {savedroutepath.routeID}</p>
            <button id='btn_route_info_close' onClick={() => { dispatch({ type: SET_SAVED_ROUTE_PATH, savedroutepath: savedroutepathState }) }}><CloseIcon /></button>
          </div>
          <div id='div_route_info_data_section'>
            <div className='div_indv_sections'>
              <p id='p_enlisted_bus_stops_label'>Bus Stops in Route</p>
              <div id='div_table_conatiner_holder'>
                <table id='tbl_enlisted_bus_stops_container'>
                  <tbody>
                    <tr>
                      <th className='th_label_header'>BS ID</th>
                      <th className='th_label_header'>Station Name</th>
                    </tr>
                    {savedroutepath.stationList.map((list, i) => {
                      return(
                        <tr onClick={() => { dispatch({ type: SET_SELECTED_MARKER, selectedmarker: list.stationID}); dispatch({ type: SET_BUS_STOP_INFO, busstopinfo: null }) }} key={i} className='tr_content_bus_stops_list'>
                          <td>{list.stationID}</td>
                          <td>{list.stationName}</td>
                        </tr>
                        )
                    })}
                  </tbody>
                </table>
              </div>
            </div>
            <div className='div_indv_sections'>
              <p id='p_route_name_label'>{savedroutepath.routeName}</p>
              <div id='div_route_info_details'>
                <p id='p_details_label'>Details</p>
                <div id='div_details_data_dynamic_container'>
                  <p className='p_details_data_holder'>{savedroutepath.routeID}</p>
                  <p className='p_details_data_holder'>{savedroutepath.stationList.length} included Bus Stops</p>
                  <p className='p_details_data_holder'>Data from {savedroutepath.companyID}</p>
                </div>
              </div>
              <div id='div_route_info_details'>
                <p id='p_details_label'>Status</p>
                <div id='div_details_data_dynamic_container'>
                  <p className='p_details_data_holder'>{savedroutepath.privacy? "Route is in Public" : "Route is Private"}</p>
                  <p className='p_details_data_holder'>{savedroutepath.status? "Activated" : "Not Active"}</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
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
                <button className='btn_menu_navigations' onClick={() => { dispatch({ type: SET_MAP_MODE, mapmode: "routes" }) }}>Routes</button>
                <button className='btn_menu_navigations'>Traffic</button>
              </div>
            </li>
          </nav>
        </motion.div>
        <motion.div
        animate={{
          right: mapmode == "routes"? "10px" : "-470px"
        }}
        id='div_routes_window' className='absolute_divs_map'>
          <div id='div_routes_window_header'>
            <div id='p_routes_window_label'>
              <span className='span_inside_routes_window_label'>Routes | </span>
              {routestatusloader.loading? (
                <>
                  <span className='span_inside_routes_window_label'>
                    <div id='div_outside_bar'>
                      {/* <span id='span_status_loader'>Hello</span> */}
                      <motion.div
                      animate={{
                        width: `${routestatusloader.percentage}%`,
                        transition:{
                          bounce: 0,
                          duration: 0.5
                        }
                      }}
                      id='div_inside_bar'>&#8203;</motion.div>
                    </div>
                  </span>
                  <span id='span_status_loader'>...Generating Route Preview</span>
                </>
              ) : (
                <span id='span_status_loader'>No Actions</span>
              )}
            </div>
            <button id='btn_bus_stops_close' onClick={() => { dispatch({ type: SET_MAP_MODE, mapmode: "none" }) }}><CloseIcon /></button>            
          </div>
          <div id='div_routes_window_sections_holder'>
            <div className='div_routes_window_sections'>
              <div id='div_bus_stops_list'>
              <p className='p_routes_list_indicator_label'>Routes List</p>
              <div id='div_bus_stops_list_container'>
                      <table id='tbl_bus_stops_list'>
                        <tbody>
                          <tr id='tr_header_bus_stops_list'>
                            <th className='th_header_bus_stops_list'>Route ID</th>
                            <th className='th_header_bus_stops_list'>Route Name</th>
                          </tr>
                          {routelist.map((list, i) => {
                            return(
                              <tr onClick={() => { 
                                  dispatch({ type: SET_SAVED_ROUTE_PATH, savedroutepath: {
                                      routeID: list.routeID,
                                      routeName: list.routeName,
                                      stationList: list.stationList,
                                      routePath: list.routePath,
                                      companyID: list.companyID,
                                      privacy: list.privacy,
                                      status: list.status
                                  } })
                               }} key={i} className='tr_content_bus_stops_list'>
                                <td>{list.routeID}</td>
                                <td>{list.routeName}</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                  </div>
                  <p className='p_routes_list_indicator_label'>Public Routes</p>
                  <div id='div_bus_stops_list_container'>
                      <table id='tbl_bus_stops_list'>
                        <tbody>
                          <tr id='tr_header_bus_stops_list'>
                            <th className='th_header_bus_stops_list'>Route ID</th>
                            <th className='th_header_bus_stops_list'>Route Name</th>
                          </tr>
                          {publicroutelist.map((list, i) => {
                            return(
                              <tr onClick={() => { 
                                  dispatch({ type: SET_SAVED_ROUTE_PATH, savedroutepath: {
                                      routeID: list.routeID,
                                      routeName: list.routeName,
                                      stationList: list.stationList,
                                      routePath: list.routePath,
                                      companyID: list.companyID,
                                      privacy: list.privacy,
                                      status: list.status
                                  } })
                               }} key={i} className='tr_content_bus_stops_list'>
                                <td>{list.routeID}</td>
                                <td>{list.routeName}</td>
                              </tr>
                            )
                          })}
                        </tbody>
                      </table>
                  </div>
              </div>
            </div>
            <div className='div_routes_window_sections'>
              <div id='div_create_route_header'>
                <p id='p_create_route_label'>Create Route</p>
              </div>
              <div id='div_create_route_form'>
                <p id='p_create_route_name_label'>Route Name</p>
                <input type='text' id='input_create_route_name' value={routename} onChange={(e) => { setroutename(e.target.value) }} className='inputs_create_route_classifier' placeholder='Type Route Name' />
              </div>
              <div id='div_route_privacy'>
                <p id='p_label_route_privacy'>Route Privacy - {routePrivacy? "Public" : "Private"}</p>
                <div id='div_checker_route_privacy'>
                  <span>
                    <div class="container">
                      <label class="switch" for="checkbox">
                        <input type="checkbox" id="checkbox" checked={routePrivacy} onChange={(e) => { setroutePrivacy(e.target.checked) }}/>
                        <div class="slider round"></div>
                      </label>
                    </div>
                  </span>
                  <span>
                    <p id='p_note_route_privacy'>Allow other companies / operators see your route.</p>
                  </span>
                </div>
              </div>
              <div id='div_route_list_container'>
                <p id='p_route_list_label'>Pending Coordinates</p>
                <div id='div_pending_route_list'>
                  <table id='tbl_pending_route_list'>
                    <tbody>
                      <tr>
                        <th className='th_pending_route_list'>Station Name</th>
                        <th className='th_pending_route_list'>Coordinates</th>
                      </tr>
                      {
                        routemakerlist.map((rts, i) => {
                          return(
                            <tr key={i} className='tr_content_bus_stops_list' onClick={() => {
                              // console.log(routemakerlist.filter(item => rts.pendingID != item.pendingID))
                              dispatch({ type: SET_ROUTE_MAKER_LIST, routemakerlist: routemakerlist.filter(item => rts.pendingID != item.pendingID) })
                            }}>
                              <td className='td_content_route_indv'>{rts.stationName}</td>
                              <td className='td_content_route_indv'>
                                <span>{rts.coordinates[0]}</span>
                                <span>{rts.coordinates[1]}</span>
                              </td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </table>
                </div>
              </div>
              <div id='div_navigations_create_route'>
                <button className='btns_navigations_create_route' onClick={() => { routeCallAPI() }}>Preview Route</button>
                <button className='btns_navigations_create_route' onClick={() => { saveRoute() }}>Save Route</button>
                <button className='btns_navigations_create_route' onClick={() => { clearPendingRouteData() }}>Clear</button>
              </div>
            </div>
          </div>
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