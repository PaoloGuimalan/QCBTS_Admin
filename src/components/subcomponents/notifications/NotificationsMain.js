import React, { useEffect, useState } from 'react'
import { Link, useLocation, useParams } from 'react-router-dom'
import '../../../styles/subcomponents/NotificationsMain.css'
import BellIcon from '@material-ui/icons/Notifications'
import ReqIcon from '@material-ui/icons/NoteAdd'

function NotificationsMain() {

  const params = useLocation()

  const [selectedParam, setselectedParam] = useState("notif")

  useEffect(() => {
    // console.log(params.pathname.split("/")[3])
    if(params.pathname.split("/")[3] == undefined){
      setselectedParam("notif")
    }
    else{
      setselectedParam("req")
    }
  },[params])

  return (
    <div id='div_notifications_main'>
      <div id='div_navigations_panel'>
        <p id='p_navigations_label'><BellIcon style={{ fontSize: "17px" }} /> Notifications</p>
        <div id='div_navigations_container'>
          <Link to='/home/notifications' className='link_icons_navigations' style={{
            backgroundColor: selectedParam == "notif"? "#ffbf00" : "transparent",
            color: selectedParam == "notif"? "white" : "black"
          }}><BellIcon style={{ fontSize: "17px" }} /> Notifications</Link>
          <Link to='/home/notifications/requests' className='link_icons_navigations' style={{
            backgroundColor: selectedParam == "req"? "#ffbf00" : "transparent",
            color: selectedParam == "req"? "white" : "black"
          }}><ReqIcon style={{ fontSize: "17px" }} /> Requests</Link>
        </div>
      </div>
    </div>
  )
}

export default NotificationsMain