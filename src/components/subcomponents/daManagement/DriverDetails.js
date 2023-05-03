import React, { useEffect, useState } from 'react'
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

  const [driverprofiledata, setdriverprofiledata] = useState({
    userID: "",
    companyID: "",
    userType: "",
    firstName: "",
    middleName: "",
    lastName: "",
    mobileNumber: 0,
    email: "",
    dlicense: "",
    age: 0,
    dateRegistered: "",
    timeRegistered: "",
    status: null,
    locationSharing: null,
    bus: {
      busID: "",
      companyID: "",
      driverID: "",
      busModel: "",
      plateNumber: "",
      capacity: "",
      busNo: 0
    },
    routeData: {
      routeID: "",
      routeName: "",
      dateAdded: "",
      addedBy: "",
      companyID: "",
      privacy: null,
      status: null
    }
  })

  useEffect(() => {
    initDriverProfile()
  },[])

  const initDriverProfile = () => {
    Axios.get(`${URL}/admin/getDriverProfile/${driverID}`,{
      headers:{
        "x-access-token": localStorage.getItem("token")
      }
    }).then((response) => {
      if(response.data.status){
        //fetch driver profile data
        setdriverprofiledata(response.data.result[0])
        // console.log(response.data.result)
      }
    }).catch((err) => {
      console.log(err)
    })
  }

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
              <p className='p_dd_name_labels'>{driverprofiledata.firstName} {driverprofiledata.middleName == "N/A" || driverprofiledata.middleName == ""? "" : driverprofiledata.middleName} {driverprofiledata.lastName}</p>
              <p className='p_dd_name_labels'>{driverprofiledata.email}</p>
            </div>
            <div id='div_dd_button_report_container'>
              <button id='btn_create_report' onClick={() => { navigate(`/home/damanagement/driverreport/${driverID}`) }}>Generate Report</button>
            </div>
          </div>
          <div className='div_dd_content_containers'>
            <div id='div_dd_aci_content_main'>
              <p className='p_dd_container_labels'>Account Information</p>
              <div id='div_dd_aci_container'>
                <div className='div_dd_aci_per_data_container'>
                  <p className='p_dd_aci_data_labels'>Driver ID</p>
                  <p className='p_dd_aci_data_content'>{driverprofiledata.userID}</p>
                </div>
                <div className='div_dd_aci_per_data_container'>
                  <p className='p_dd_aci_data_labels'>Driver's License</p>
                  <p className='p_dd_aci_data_content'>{driverprofiledata.dlicense}</p>
                </div>
                <div className='div_dd_aci_per_data_container'>
                  <p className='p_dd_aci_data_labels'>Company ID</p>
                  <p className='p_dd_aci_data_content'>{driverprofiledata.companyID}</p>
                </div>
              </div>
            </div>
          </div>
          {driverprofiledata.routeData != null? (
            <div className='div_dd_content_containers'>
              <div id='div_dd_aci_content_main'>
                <p className='p_dd_container_labels'>Driver Route</p>
                <div id='div_dd_aci_container'>
                  <div className='div_dd_aci_per_data_container'>
                    <p className='p_dd_aci_data_labels'>Route ID</p>
                    <p className='p_dd_aci_data_content'>{driverprofiledata.routeData.routeID}</p>
                  </div>
                  <div className='div_dd_aci_per_data_container'>
                    <p className='p_dd_aci_data_labels'>Route Name</p>
                    <p className='p_dd_aci_data_content'>{driverprofiledata.routeData.routeName}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
          {driverprofiledata.bus != null? (
            <div className='div_dd_content_containers'>
              <div id='div_dd_aci_content_main'>
                <p className='p_dd_container_labels'>Bus Assigned</p>
                <div id='div_dd_aci_container'>
                  <div className='div_dd_aci_per_data_container'>
                    <p className='p_dd_aci_data_labels'>Bus ID</p>
                    <p className='p_dd_aci_data_content'>{driverprofiledata.bus.busID}</p>
                  </div>
                  <div className='div_dd_aci_per_data_container'>
                    <p className='p_dd_aci_data_labels'>Plate Number</p>
                    <p className='p_dd_aci_data_content'>{driverprofiledata.bus.plateNumber}</p>
                  </div>
                  <div className='div_dd_aci_per_data_container'>
                    <p className='p_dd_aci_data_labels'>Bus No.</p>
                    <p className='p_dd_aci_data_content'>{driverprofiledata.bus.busNo == 0? "unassigned" : driverprofiledata.bus.busNo}</p>
                  </div>
                  <div className='div_dd_aci_per_data_container'>
                    <p className='p_dd_aci_data_labels'>Capacity</p>
                    <p className='p_dd_aci_data_content'>{driverprofiledata.bus.capacity}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : null}
        </li>
      </nav>
    </div>
  )
}

export default DriverDetails