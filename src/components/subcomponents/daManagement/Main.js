import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../../styles/subcomponents/DAManagementMain.css'
import MessagesIcon from '@material-ui/icons/Message'
import SearchIcon from '@material-ui/icons/Search'
import BellIcon from '@material-ui/icons/Notifications'

function Main() {

  const navigate = useNavigate()

  const [selectedDriversList, setselectedDriversList] = useState("All");

  return (
    <div id='div_da_main'>
        <div id='div_da_header'>
            <p id='p_da_header_label'>Driver Account Management</p>
            <div id='flexed_div'></div>
            <div id='notifbar_div_da'>
             <button onClick={() => { navigate("/home/messages/da") }} className='btn_notifbar_da'><MessagesIcon style={{fontSize: "20px", color: "white"}} /></button>
             <button onClick={() => { navigate("/home/notifications") }} className='btn_notifbar_da'><BellIcon style={{fontSize: "20px", color: "white"}} /></button>
            </div>
        </div>
        <div id='div_da_main_container'>
            <div id='div_da_main_header'>
              <div id='div_header_handler'>
                <p className='p_header_label_cont'>Company / Operator & Drivers List</p>
                <p className='p_header_label_cont'>Manage Drivers here</p>
              </div>
            </div>
            <div id='div_main_lists'>
              <div className='div_list_sections_container'>
                <p className='p_each_list_label'>Company / Operators</p>
                <div className='div_list_sections'>
                  <p>Hello World</p>
                </div>
              </div>
              <div className='div_list_sections_container'>
                <p className='p_each_list_label'>Drivers From ({selectedDriversList})</p>
                <div className='div_list_sections'>
                  <p>Hello World</p>
                </div>
              </div>
            </div>
        </div>
    </div>
  )
}

export default Main