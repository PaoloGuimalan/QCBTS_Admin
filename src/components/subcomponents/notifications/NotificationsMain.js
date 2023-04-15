import React, { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import '../../../styles/subcomponents/NotificationsMain.css'
import BellIcon from '@material-ui/icons/Notifications'
import ReqIcon from '@material-ui/icons/NoteAdd'
import { useDispatch, useSelector } from 'react-redux'
import { motion } from 'framer-motion'
import Axios from 'axios'
import { URL } from '../../../json/urlconfig'
import { SET_SYSTEM_ACTIVITIES_LIST } from '../../../redux/types'

function NotificationsMain() {
  
  const systemactivitieslist = useSelector(state => state.systemactivitieslist)
  const dispatch = useDispatch()
  const params = useLocation()

  const [selectedParam, setselectedParam] = useState("System Admin")

  useEffect(() => {
    Axios.get(`${URL}/admin/systemActivities`,{
      headers:{
        "x-access-token": localStorage.getItem("token")
      }
    }).then((response) => {
      if(response.data.status){
        dispatch({type: SET_SYSTEM_ACTIVITIES_LIST, systemactivitieslist: response.data.result})
      }
    }).catch((err) => {
      console.log(err)
    })
  },[])

  // useEffect(() => {
  //   // console.log(params.pathname.split("/")[3])
  //   if(params.pathname.split("/")[3] == undefined){
  //     setselectedParam("notif")
  //   }
  //   else{
  //     setselectedParam("req")
  //   }
  // },[params])

  return (
    <div id='div_notifications_main'>
      <div id='div_navigations_panel'>
        <p id='p_navigations_label'><BellIcon style={{ fontSize: "17px" }} /> System Activities</p>
        <div id='div_navigations_container'>
          <motion.button
          animate={{
            backgroundColor: selectedParam == "System Admin"? "orange" : "transparent",
            color: selectedParam == "System Admin"? "white" : "black"
          }}
          onClick={() => {
            setselectedParam("System Admin")
          }}
          className='link_icons_navigations'><BellIcon style={{ fontSize: "17px" }} />System Admin</motion.button>
          <motion.button
          animate={{
            backgroundColor: selectedParam == "Driver"? "orange" : "transparent",
            color: selectedParam == "Driver"? "white" : "black"
          }}
          onClick={() => {
            setselectedParam("Driver")
          }}
          className='link_icons_navigations'><BellIcon style={{ fontSize: "17px" }} />Drivers</motion.button>
          <motion.button
          animate={{
            backgroundColor: selectedParam == "Commuter"? "orange" : "transparent",
            color: selectedParam == "Commuter"? "white" : "black"
          }}
          onClick={() => {
            setselectedParam("Commuter")
          }}
          className='link_icons_navigations'><BellIcon style={{ fontSize: "17px" }} />Commuters</motion.button>
          {/* <Link to='/home/notifications' className='link_icons_navigations' style={{
            backgroundColor: selectedParam == "notif"? "#ffbf00" : "transparent",
            color: selectedParam == "notif"? "white" : "black"
          }}><BellIcon style={{ fontSize: "17px" }} /> Notifications</Link>
          <Link to='/home/notifications/requests' className='link_icons_navigations' style={{
            backgroundColor: selectedParam == "req"? "#ffbf00" : "transparent",
            color: selectedParam == "req"? "white" : "black"
          }}><ReqIcon style={{ fontSize: "17px" }} /> Requests</Link> */}
        </div>
      </div>
      <div id='div_systemactivites_result'>
        <div id='div_systemactivites_result_header'>
          <p id='div_systemactivites_result_label'>{selectedParam} Activities</p>
        </div>
        <div id='div_systemactivites_result_list'>
          {systemactivitieslist.filter((usrt, j) => usrt.userType == selectedParam).map((sal, i) => {
            return(
              <div key={i} className='div_systemactivities_result_indv'>
                <p>{sal.userType}</p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export default NotificationsMain