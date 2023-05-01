import React from 'react'
import '../../../styles/subcomponents/DriverDetails.css'
import { useNavigate, useParams } from 'react-router-dom'
import BackIcon from '@material-ui/icons/KeyboardArrowLeft'
import Axios from 'axios'
import { URL } from '../../../json/urlconfig'
import DefaultImg from '../../../resources/defaultimg.png'

function DriverDetails() {

  const params = useParams()
  const navigate = useNavigate()
  const driverID = params["driverID"]

  return (
    <div id='div_driver_details'>
      <nav id='nav_addcompany'>
        <li>
          <div id='div_addcompany_navigations'>
            <button id='btn_backicon' onClick={() => { 
              navigate(-1) 
            }} ><BackIcon style={{ fontSize: "35px", color: "#404040" }} /></button>
            <p id='label_company_details'>Driver's Profile</p>
          </div>
        </li>
        <li>
          <div className='div_dd_content_containers'>
            <div>
              <img src={DefaultImg} id='img_default_container' />
            </div>
            <div id='div_dd_name_container'>
              <p className='p_dd_name_labels'>Hello World</p>
              <p className='p_dd_name_labels'>Hello World</p>
            </div>
            <div id='div_dd_button_report_container'>
              <button id='btn_create_report'>Create Report</button>
            </div>
          </div>
          <div className='div_dd_content_containers'>
            <p>Hello World</p>
          </div>
          <div className='div_dd_content_containers'>
            <p>Hello World</p>
          </div>
        </li>
      </nav>
    </div>
  )
}

export default DriverDetails