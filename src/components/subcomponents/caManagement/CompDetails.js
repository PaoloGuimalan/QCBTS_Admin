import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import '../../../styles/subcomponents/CompDetails.css'
import BackIcon from '@material-ui/icons/KeyboardArrowLeft'
import Axios from 'axios'
import { URL } from '../../../json/urlconfig'
import { useDispatch, useSelector } from 'react-redux'
import { SET_ALERT, SET_ASSIGNED_ROUTES, SET_BUS_LIST, SET_COMPANY_RECORD, SET_DRIVERS_LIST, SET_ROUTES_SELECTION_LIST, SET_TRIP_SCHEDULES_LIST } from '../../../redux/types'
import { companyRecordState } from '../../../redux/actions'
import DefaultIconComp from '../../../resources/defaultcompany.png'
import MessageIcon from '@material-ui/icons/Message';
import DeleteIcon from '@material-ui/icons/Delete'
import MailIcon from '@material-ui/icons/Mail'
import CheckIcon from '@material-ui/icons/Check'
import UncheckIcon from '@material-ui/icons/Close'
import AddIcon from '@material-ui/icons/Add'
import EditIcon from '@material-ui/icons/Edit'
import InfoIcon from '@material-ui/icons/Info'
import DeleteSweepIcon from '@material-ui/icons/DeleteSweep'
import { motion } from 'framer-motion'

function CompDetails() {

  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const companyID = params["companyID"];

  const companyrecord = useSelector(state => state.companyrecord);
  const [editForm, seteditForm] = useState(false);
  const [addBus, setaddBus] = useState(false)

  const [companyNameEdit, setcompanyNameEdit] = useState("");
  const [companyEmailEdit, setcompanyEmailEdit] = useState("");
  const [companyNumberEdit, setcompanyNumberEdit] = useState("");
  const [companyAddressEdit, setcompanyAddressEdit] = useState("");

  const [busModel, setbusModel] = useState("");
  const [plateNumber, setplateNumber] = useState("")
  const [busCapacity, setbusCapacity] = useState("")
  const [busAssignedTo, setbusAssignedTo] = useState("none");

  const [tripDestination, settripDestination] = useState("");
  const [tripDay, settripDay] = useState("");
  const [tripTime, settripTime] = useState("")
  const [tripInterval, settripInterval] = useState("")

  const [selectedRouteSelection, setselectedRouteSelection] = useState({
    routeID: "none",
    routeName: "....",
    stationTotal: "....",
    dateAdded: "...."
  })

  const driverslist = useSelector(state => state.driverslist)
  const routesselectionlist = useSelector(state => state.routesselectionlist)
  const assignedroutes = useSelector(state => state.assignedroutes)
  const buslist = useSelector(state => state.buslist)
  const tripscheduleslist = useSelector(state => state.tripscheduleslist)
  const livebuslist = useSelector(state => state.livebuslist)

  useEffect(() => {
    // console.log(params["companyID"])
    fetchCompanyData();
    setDefaultEditValues();
    initDriversList()
    initRoutesSelectionList()
    initAssignedRoutes()
    initBusList()

    return () => {
      dispatch({ type: SET_COMPANY_RECORD, companyrecord: companyRecordState })
      dispatch({ type: SET_DRIVERS_LIST, driverslist: [] })
      dispatch({type: SET_BUS_LIST, buslist: []})
      dispatch({ type: SET_TRIP_SCHEDULES_LIST, tripscheduleslist: [] })
    }
  }, [companyID]);

  useEffect(() => {
    setDefaultEditValues()
  }, [companyrecord])

  const setDefaultBusForm = () => {
    setbusModel("")
    setplateNumber("")
    setbusCapacity("")
    setbusAssignedTo("none")
  }

  const setDefaultEditValues = () => {
    setcompanyNameEdit(companyrecord.companydata.companyName);
    setcompanyEmailEdit(companyrecord.companydata.email);
    setcompanyNumberEdit(companyrecord.companydata.companyNumber);
    setcompanyAddressEdit(companyrecord.companydata.companyAddress);
  }

  useEffect(() => {
    initTripSchedules()

    return () => {
      dispatch({ type: SET_TRIP_SCHEDULES_LIST, tripscheduleslist: [] })
    }
  },[assignedroutes, companyID])

  const initTripSchedules = () => {
    var assignedRouteIDfromListing = assignedroutes[0]?.routeID
    if(assignedroutes.length > 0){
      Axios.get(`${URL}/admin/getTripSchedules/${companyID}/${assignedRouteIDfromListing}`, {
        headers: {
          "x-access-token": localStorage.getItem("token")
        }
      }).then((response) => {
        if(response.data.status){
          // alert("OK")
          dispatch({ type: SET_TRIP_SCHEDULES_LIST, tripscheduleslist: response.data.result })
        }
        else{
          //response false
        }
      }).catch((err) => {
        console.log(err)
      })
    }
  }

  const initDriversList = () => {
    Axios.get(`${URL}/admin/driverList/${companyID}`, {
      headers:{
        "x-access-token": localStorage.getItem("token")
      }
    }).then((response) => {
      // console.log(response.data.result)
      if(response.data.status){
        dispatch({ type: SET_DRIVERS_LIST, driverslist: response.data.result })
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  const fetchCompanyData = () => {
    Axios.get(`${URL}/admin/allcompanydata/${companyID}`, {
      headers:{
        "x-access-token": localStorage.getItem("token")
      }
    }).then((response) => {
      // console.log(response.data.result)
      dispatch({ type: SET_COMPANY_RECORD, companyrecord: response.data.result })
    }).catch((err) => {
      console.log(err);
    })
  }

  const updateCompanyStatus = (cmpAdID, sts) => {
    Axios.post(`${URL}/admin/updatecompanystatus`, {
        companyAdminID: cmpAdID,
        status: sts
    },{
        headers:{
            "x-access-token": localStorage.getItem("token")
        }
    }).then((response) => {
        if(response.data.status){
            fetchCompanyData();
            // alertPrompt(true, `${cmpAdID} account has been ${sts? "Activated" : "Deactivated"}`)
            // console.log(response.data.result);
        }
        else{
            // alertPrompt(false, `${sts? "Activation" : "Deactivation"} of ${cmpAdID} account failed`)
            // console.log(response.data.result);
        }
    }).catch((err) => {
        // alertPrompt(false, `Update Request Error`)
        console.log(err);
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

  const updateCompanyData = () => {
    if(companyNameEdit != "" && companyEmailEdit != "" && companyNumberEdit != "" && companyAddressEdit != ""){
      Axios.post(`${URL}/admin/updateCompanyData`, {
        companyID: companyID,
        companyName: companyNameEdit,
        companyNumber: companyNumberEdit,
        companyEmail: companyEmailEdit,
        companyAddress: companyAddressEdit
      },{
        headers:{
          "x-access-token": localStorage.getItem("token")
        }
      }).then((response) => {
        if(response.data.status){
          alertPrompt(true, response.data.result.message);
          fetchCompanyData();
          setDefaultEditValues();
          seteditForm(false);
        }
        else{
          fetchCompanyData();
          setDefaultEditValues();
          alertPrompt(false, response.data.result.message);
        }
      }).catch((err) => {
        alertPrompt(false, "Unable to establish connection for update!");
        console.log(err);
      })
    }
    else{
      alertPrompt(false, "Please fill up all fields")
    }
  }

  const redirectToMessages = (compadID) => {
    navigate(`/home/messages/${compadID}`)
  }

  const redirectToCompAdDet = (compadID) => {
    navigate(`/home/camanagement/companyAdminDetails/${compadID}`)
  }

  const updateDriverStatus = (id, status) => {
    if(status === true){
      if(assignedroutes.length == 0){
        alert("Assign a route for the company first")
      }
      else{
        if(buslist.filter((bsl, i) => bsl.driverID == id).length == 1){
          Axios.post(`${URL}/admin/updateDriverStatus`, {
            driverID: id,
            status: status
          },
          {
            headers:{
              "x-access-token": localStorage.getItem("token")
            }
          }).then((response) => {
            // console.log(response.data.result)
            if(response.data.status){
              initDriversList()
            }
          }).catch((err) => {
            console.log(err);
          })
        }
        else{
          alert("Please assign a bus first for the driver")
        }
      }
    }
    else{
      Axios.post(`${URL}/admin/updateDriverStatus`, {
        driverID: id,
        status: status
      },
      {
        headers:{
          "x-access-token": localStorage.getItem("token")
        }
      }).then((response) => {
        // console.log(response.data.result)
        if(response.data.status){
          initDriversList()
        }
      }).catch((err) => {
        console.log(err);
      })
    }
  }

  const initRoutesSelectionList = () => {
    Axios.get(`${URL}/admin/availableRoutes`, {
      headers: {
        "x-access-token": localStorage.getItem('token')
      }
    }).then((response) => {
      if(response.data.status){
        // console.log(response.data.result)
        dispatch({ type: SET_ROUTES_SELECTION_LIST, routesselectionlist: response.data.result })
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  const initAssignedRoutes = () => {
    Axios.get(`${URL}/admin/assignedRoutes/${companyID}`, {
      headers: {
        "x-access-token": localStorage.getItem('token')
      }
    }).then((response) => {
      if(response.data.status){
        // console.log(response.data.result)
        dispatch({ type: SET_ASSIGNED_ROUTES, assignedroutes: response.data.result })
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  const asignRoutetoCompany = () => {
    if(selectedRouteSelection.routeID == "none"){
      alert("Please select a route")
    }
    else{
      if(assignedroutes.length > 0){
        alert("Company already have Assigned Route");
      }
      else{
        Axios.post(`${URL}/admin/assignRoute`, {
          routeID: selectedRouteSelection.routeID,
          companyID: companyID
        },{
          headers:{
            "x-access-token": localStorage.getItem("token")
          }
        }).then((response) => {
          if(response.data.status){
            initAssignedRoutes()
            setselectedRouteSelection({
              routeID: "....",
              routeName: "....",
              stationTotal: "....",
              dateAdded: "...."
            })
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    }
  }

  const addBusProcess = () => {
    if(buslist.filter((bsl, i) => bsl.driverID == busAssignedTo).length == 1){
      alert(`A bus were already assigned to ${busAssignedTo}`)
    }
    else{
      Axios.post(`${URL}/admin/addBus`, {
        companyID: companyID,
        driverID: busAssignedTo,
        busModel: busModel,
        plateNumber: plateNumber,
        capacity: busCapacity
      },{
        headers:{
          "x-access-token": localStorage.getItem("token")
        }
      }).then((response) => {
        if(response.data.status){
          setDefaultBusForm()
          setaddBus(false)
          alertPrompt(true, response.data.message)
          initBusList()
        }
        else{
          alertPrompt(false, response.data.message)
        }
      }).catch((err) => {
        console.log(err);
      })
    }
  }

  const initBusList = () => {
    Axios.get(`${URL}/admin/getBusList/${companyID}`, {
      headers:{
        "x-access-token": localStorage.getItem("token")
      }
    }).then((response) => {
      if(response.data.status){
        dispatch({type: SET_BUS_LIST, buslist: response.data.result})
      }
    }).catch((err) => {
      console.log(err)
    })
  }

  const deleteAssignedRoute = (companyID, routeID) => {
    if(window.confirm("Do you want to unassign this route from the company?")){
      Axios.post(`${URL}/admin/deleteAssignedRoute`, {
        companyID: companyID,
        routeID: routeID
      },{
        headers:{
          "x-access-token": localStorage.getItem("token")
        }
      }).then((response) => {
        if(response.data.status){
          alert(response.data.message)
        }
        else{
          alert(response.data.message)
        }
        initAssignedRoutes()
        initDriversList()
      }).catch((err) => {
        console.log(err)
      })
    }
  }

  const deleteBus = (busID, driverID) => {
    if(window.confirm("Do you want to delete this bus?")){
      Axios.post(`${URL}/admin/deleteBus`, {
        busID: busID,
        driverID: driverID
      },{
        headers:{
          "x-access-token": localStorage.getItem("token")
        }
      }).then((response) => {
        if(response.data.status){
          alert(response.data.message)
        }
        else{
          alert(response.data.message)
        }
        initBusList()
        initDriversList()
      }).catch((err) => {
        console.log(err)
      })
    }
  }

  const deleteDriver = (driverIDprop) => {
    // alert(driverIDprop)
    if(window.confirm("Do you want to delete this driver's account?")){
      if(buslist.filter((bsl, i) => bsl.driverID == driverIDprop).length > 0){
        alert(`Please delete a bus assigned to this driver before deleting the driver's account`)
      }
      else{
        Axios.post(`${URL}/admin/deleteDriver`,{
          driverID: driverIDprop
        },{
          headers:{
            "x-access-token": localStorage.getItem("token")
          }
        }).then((response) => {
          if(response.data.status){
            alert(response.data.message)
            initDriversList()
          }
          else{
            alert(response.data.message)
          }
        }).catch((err) => {
          console.log(err)
        })
      }
    }
  }

  const deleteCompany = () => {
    if(window.confirm("Do you want to delete the company? Please note that this is irreversible.")){
      Axios.get(`${URL}/admin/deleteCompany/${companyID}`,{
        headers:{
          "x-access-token": localStorage.getItem('token')
        }
      }).then((response) => {
        if(response.data.status){
          alert(response.data.message)
          navigate("/home/camanagement")
        }
        else{
          alert(response.data.message)
        }
      })
    }
  }

  const formatCompanyData = () => {
    if(window.confirm("Do you want to clear company data? Please note that this will delete all company records only.")){
      Axios.get(`${URL}/admin/deleteCompanyRecords/${companyID}`,{
        headers:{
          "x-access-token": localStorage.getItem('token')
        }
      }).then((response) => {
        if(response.data.status){
          alert(response.data.message)
          fetchCompanyData();
          setDefaultEditValues();
          initDriversList()
          initRoutesSelectionList()
          initAssignedRoutes()
          initBusList()
        }
        else{
          alert(response.data.message)
        }
      })
    }
  }

  function isInt(n) {
    // console.log(n % 1 === 0)
    return n % 1 === 0;
  }

  const clearTripForm = () => {
    settripDestination("")
    settripDay("")
    settripTime("")
    settripInterval("")
  }

  const saveTripSchedule = () => {
    var assignedRouteIDfromListing = assignedroutes[0]?.routeID
    if(assignedroutes.length > 0 && companyID != null && tripDestination != "" && tripDay != "" && tripTime != "" && tripInterval != ""){
      Axios.post(`${URL}/admin/saveTripSchedule`,{
        routeID: assignedRouteIDfromListing,
        companyID: companyID,
        tripDestination: tripDestination,
        tripDay: tripDay,
        tripTime: tripTime,
        tripInterval: tripInterval
      },{
        headers:{
          "x-access-token": localStorage.getItem("token")
        }
      }).then((response) => {
        if(response.data.status){
          clearTripForm()
          initTripSchedules()
        }
        else{
          //failed saving trip schedule
        }
      }).catch((err) => {
        console.log(err)
      })
    }
    else{
      alert("Trip Schedule data is incomplete!")
    }
  }

  const deleteTripSchedule = (tripIDprop) => {
    Axios.get(`${URL}/admin/deleteTripSchedule/${tripIDprop}`, {
      headers:{
        "x-access-token": localStorage.getItem("token")
      }
    }).then((response) => {
      if(response.data.status){
        //alert(response.data.message)
        initTripSchedules()
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  return (
    <div id='div_addcompany'>
      <nav id='nav_addcompany'>
        <li>
          <div id='div_addcompany_navigations'>
            <button id='btn_backicon' onClick={() => { 
              navigate(-1) 
            }} ><BackIcon style={{ fontSize: "35px", color: "white" }} /></button>
            <p id='label_addcompany'>Company Details</p>
          </div>
        </li>
        <li>
          <nav id='nav_details_page'>
            <li>
              <nav id='nav_header_details'>
                <li>
                  <div>
                      <img src={DefaultIconComp} id='img_header_details' />
                  </div>
                </li>
                <li id='li_header_middle_filler'>
                  <div id='div_header_labels'>
                    <p className='p_header_labels'>{companyrecord.companydata.companyName}</p>
                    <p className='p_header_labels'>{companyrecord.companydata.email}</p>
                  </div>
                </li>
                <li>
                  <div id='div_header_contacts'>
                    <button title='Delete Company' onClick={() => { deleteCompany() }} className='btn_header_companydata'><DeleteIcon /></button>
                    <button title='Clear Company Data' onClick={() => { formatCompanyData() }} className='btn_header_companydata'><DeleteSweepIcon /></button>
                    <button title='Edit Details' onClick={() => { seteditForm(!editForm); setDefaultEditValues(); }} className='btn_header_companydata'><EditIcon /></button>
                    <button title='Email' className='btn_header_companydata' onClick={() => { window.location.href = `mailto:${companyrecord.companydata.email}` }} ><MailIcon /></button>
                  </div>
                </li>
              </nav>
            </li>
            <li>
              <nav id='nav_information_section'>
                <li className='li_information_section'>
                  <nav id='nav_informations_company'>
                    <li>
                      <p className='label_informations_company'>Informations</p>
                    </li>
                    <li className='li_holder_data'>
                      <div id='div_data_information_holder'>
                        <table id='tbl_data_information'>
                          <tbody>
                            <tr className='tr_data'>
                              <th className='th_table_information'>Company ID: </th>
                              <td className='td_table_information'>{companyrecord.companydata.companyID}</td>
                            </tr>
                            <tr className='tr_data'>
                              <th className='th_table_information'>LTO Reg No.: </th>
                              <td className='td_table_information'>{companyrecord.companydata.companyID == ""? "" : companyrecord.companydata.ltoregno? companyrecord.companydata.ltoregno : "Pre-registered Company"}</td>
                            </tr>
                            <tr className='tr_data'>
                              <th className='th_table_information'>Address: </th>
                              <td className='td_table_information'>{companyrecord.companydata.companyAddress}</td>
                            </tr>
                            <tr className='tr_data'>
                              <th className='th_table_information'>Number: </th>
                              <td className='td_table_information'>{companyrecord.companydata.companyNumber}</td>
                            </tr>
                          </tbody>
                        </table>
                      </div>
                    </li>
                  </nav>
                </li>
                <li className='li_information_section'>
                  <nav id='nav_informations_company'>
                    <li>
                      <p className='label_informations_company'>Basic Reports</p>
                    </li>
                    <li className='li_holder_data'>
                      <div id='div_data_information_holder'>
                      <table id='tbl_data_information'>
                          <tbody>
                            <tr className='tr_data'>
                              <th className='th_table_information'>Active Drivers: </th>
                              <td className='td_table_information'>{livebuslist.filter((lb, i) => lb.companyID == companyID).length} driver/s</td>
                            </tr>
                            {/* <tr className='tr_data'>
                              <th className='th_table_information'>Active Drivers: </th>
                              <td className='td_table_information'>none</td>
                            </tr> */}
                          </tbody>
                        </table>
                      </div>
                    </li>
                  </nav>
                </li>
              </nav>
            </li>
          </nav>
        </li>
        <li>
          <motion.nav
          animate={{
            padding: editForm? "10px" : "0px",
            height: editForm? "auto" : "0px"
          }}
          id='nav_details_page_edit'>
            <li>
              <div id='div_adminslist'>
                <p className='label_informations_company'>Edit Info</p>
              </div>
            </li>
            <li>
              <div id='div_inputsedit'>
                <div id='div_editinputs'>
                  <div id='div_inputholder'>
                    <div className='div_inputcontainers'>
                      <p className='p_label_inputsedit'>Company Name</p>
                      <input type='text' onChange={(e) => { setcompanyNameEdit(e.target.value) }} value={companyNameEdit} name='companyName' id='companyName' placeholder='Company Name' className='inputsedit' />
                    </div>
                    <div className='div_inputcontainers'>
                      <p className='p_label_inputsedit'>Email</p>
                      <input type='text' onChange={(e) => { setcompanyEmailEdit(e.target.value) }} value={companyEmailEdit} name='companyEmail' id='companyEmail' placeholder='Email' className='inputsedit' />
                    </div>
                    <div className='div_inputcontainers'>
                      <p className='p_label_inputsedit'>Number</p>
                      <input type='text' onChange={(e) => { setcompanyNumberEdit(e.target.value) }} value={companyNumberEdit} name='companyNumber' id='companyNumber' placeholder='Number' className='inputsedit' />
                    </div>
                    <div className='div_inputcontainers'>
                      <p className='p_label_inputsedit'>Address</p>
                      <textarea onChange={(e) => { setcompanyAddressEdit(e.target.value) }} value={companyAddressEdit} placeholder='Input Company Address here' id='address_textarea'></textarea>
                    </div>
                  </div>
                  <div id='div_btns'>
                    <button className='btn_edit_navs' onClick={() => { updateCompanyData() }}>Save</button>
                    <button className='btn_edit_navs' onClick={() => { seteditForm(!editForm); setDefaultEditValues(); }}>Cancel</button>
                  </div>
                </div>
              </div>
            </li>
          </motion.nav>
        </li>
        {/* <li>
          <nav id='nav_details_page'>
            <li>
              <div id='div_adminslist'>
                <p className='label_informations_company'>Admins List</p>
              </div>
            </li>
            <li>
              <div className='div_lists'>
                <table className='tbl_lists'>
                  <tbody>
                    <tr>
                      <th className='th_adminlist'>Admin ID</th>
                      <th className='th_adminlist'>Full Name</th>
                      <th className='th_adminlist'>Email</th>
                      <th className='th_adminlist'>Status</th>
                      <th className='th_adminlist'>Navigations</th>
                    </tr>
                    {companyrecord.adminlist.map((records, i) => {
                      return(
                        <tr key={i}>
                          <td className='td_adminlist' onClick={() => { redirectToCompAdDet(records.companyAdminID) }}>{records.companyAdminID}</td>
                          <td className='td_adminlist' onClick={() => { redirectToCompAdDet(records.companyAdminID) }}>{records.companyAdmin.firstname} {records.companyAdmin.lastname}</td>
                          <td className='td_adminlist'><a className='link_conf_lists' href={`mailto:${records.email}`}>{records.email}</a></td>
                          <motion.td
                          animate={{
                            color: records.status? "green" : "red"
                          }} 
                          className='td_adminlist'>{records.status? "Activated" : "Deactivated"}</motion.td>
                          <td>
                            <button onClick={() => {
                              updateCompanyStatus(records.companyAdminID, records.status? false : true)
                            }}
                            className='btns_list'>{records.status? <UncheckIcon style={{fontSize: "15px"}} /> : <CheckIcon style={{fontSize: "15px"}} />}</button>
                            <button className='btns_list' onClick={() => { redirectToMessages(records.companyAdminID) }}><MessageIcon style={{fontSize: "15px"}} /></button>
                            <button className='btns_list' onClick={() => { redirectToCompAdDet(records.companyAdminID) }}><InfoIcon style={{fontSize: "15px"}} /></button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </li>
          </nav>
        </li> */}
        <li>
          <nav id='nav_details_page'>
            <li>
              <div id='div_adminslist'>
                <p className='label_informations_company'>Drivers List</p>
              </div>
            </li>
            <li>
            <div className='div_lists'>
                <table className='tbl_lists'>
                  <tbody>
                    <tr>
                      <th className='th_adminlist'>Driver ID</th>
                      <th className='th_adminlist'>Full Name</th>
                      <th className='th_adminlist'>License ID</th>
                      <th className='th_adminlist'>Status</th>
                      <th className='th_adminlist'>Navigations</th>
                    </tr>
                    {driverslist.map((records, i) => {
                      return(
                        <tr key={i}>
                          <td className='td_adminlist' onClick={() => {  }}>{records.userID}</td>
                          <td className='td_adminlist' onClick={() => {  }}>{records.firstName} {records.middleName == "N/A"? "" : records.middleName} {records.lastName}</td>
                          <td className='td_adminlist'>{records.dlicense}</td>
                          <motion.td
                          animate={{
                            color: records.status? "green" : "red"
                          }} 
                          className='td_adminlist'>{records.status? "Activated" : "Deactivated"}</motion.td>
                          <td>
                            <button onClick={() => {
                              updateDriverStatus(records.userID, !records.status)
                            }}
                            className='btns_list'>{records.status? <UncheckIcon style={{fontSize: "15px"}} /> : <CheckIcon style={{fontSize: "15px"}} />}</button>
                            <button className='btns_list' onClick={() => { deleteDriver(records.userID) }}><DeleteIcon style={{fontSize: "15px"}} /></button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </li>
          </nav>
        </li>
        <li>
          <nav id='nav_details_page'>
            <li id='li_buslist'>
              <div id='div_adminslist'>
                <p className='label_informations_company'>Bus List</p>
              </div>
              <div id='div_livebus_add_button_container'>
                <button id='btn_add_bus' onClick={() => { setaddBus(true) }}><AddIcon style={{fontSize: "15px"}} /></button>
              </div>
            </li>
            <li>
            <div className='div_lists'>
                <table className='tbl_lists'>
                  <tbody>
                    <tr>
                      <th className='th_adminlist'>Bus ID / Assigned</th>
                      <th className='th_adminlist'>Model</th>
                      <th className='th_adminlist'>Plate No.</th>
                      <th className='th_adminlist'>Capacity</th>
                      <th className='th_adminlist'>Navigations</th>
                    </tr>
                    {buslist.map((records, i) => {
                      return(
                        <tr key={i}>
                          <td className='td_adminlist' onClick={() => {  }}>{records.busID} / {records.driverID}</td>
                          <td className='td_adminlist' onClick={() => {  }}>{records.busModel}</td>
                          <td className='td_adminlist'>{records.plateNumber}</td>
                          <td className='td_adminlist'>{records.capacity}</td>
                          <td>
                            <button className='btns_list' onClick={() => { deleteBus(records.busID, records.driverID) }}><DeleteIcon style={{fontSize: "15px"}} /></button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </li>
          </nav>
        </li>
        <li>
          <motion.nav
            animate={{
              padding: addBus? "10px" : "0px",
              height: addBus? "auto" : "0px"
            }}
            id='nav_details_page_edit'>
              <li>
                <div id='div_adminslist'>
                  <p className='label_informations_company'>Add Bus</p>
                </div>
              </li>
              <li>
                <div id='div_inputsedit'>
                  <div id='div_editinputs'>
                    <div id='div_inputholder'>
                      <div className='div_inputcontainers'>
                        <p className='p_label_inputsedit'>Model</p>
                        <input type='text' onChange={(e) => { setbusModel(e.target.value) }} value={busModel} name='companyName' id='companyName' placeholder='Bus Model' className='inputsedit' />
                      </div>
                      <div className='div_inputcontainers'>
                        <p className='p_label_inputsedit'>Plate No.</p>
                        <input type='text' onChange={(e) => { setplateNumber(e.target.value) }} value={plateNumber} name='companyEmail' id='companyEmail' placeholder='Plate Number' className='inputsedit' />
                      </div>
                      <div className='div_inputcontainers'>
                        <p className='p_label_inputsedit'>Capacity</p>
                        <input type='text' onChange={(e) => { setbusCapacity(e.target.value) }} value={busCapacity} name='companyNumber' id='companyNumber' placeholder='Bus Capacity' className='inputsedit' />
                      </div>
                      <div className='div_inputcontainers'>
                        <p className='p_label_inputsedit'>Assign To</p>
                        <select id='select_routeAssign' className='inputsedit' value={busAssignedTo} onChange={(e) => { setbusAssignedTo(e.target.value) }}>
                          <option value="none" defaultChecked>---Select a Driver---</option>
                          {driverslist.map((drvs, i) => {
                            return(
                              <option key={drvs.userID} value={drvs.userID}>{drvs.firstName} {drvs.middleName == "N/A"? "" : drvs.middleName} {drvs.lastName}</option>
                            )
                          })}
                        </select>
                      </div>
                    </div>
                    <div id='div_btns'>
                      <button className='btn_edit_navs' onClick={() => { addBusProcess() }}>Save</button>
                      <button className='btn_edit_navs' onClick={() => { setaddBus(false); setDefaultBusForm() }}>Cancel</button>
                    </div>
                  </div>
                </div>
              </li>
            </motion.nav>
        </li>
        <li>
          <nav id='nav_details_page'>
            <li>
              <div id='div_adminslist'>
                <p className='label_informations_tripschedules'>
                  <span className='label_informations_tripschedules_sub'>Trip Schedules</span>
                  <span className='label_informations_tripschedules_sub'>(This will reflect with other companies assigned in same route)</span>
                </p>
              </div>
            </li>
            <li>
            <div className='div_lists'>
                <table className='tbl_lists'>
                  <tbody>
                    <tr>
                      <th className='th_adminlist'>Trip</th>
                      <th className='th_adminlist'>Day</th>
                      <th className='th_adminlist'>Time</th>
                      <th className='th_adminlist'>Interval</th>
                      <th className='th_adminlist'>Navigations</th>
                    </tr>
                    {/* Time Interval Input */}
                    <tr>
                      <td>
                        <select id='select_dayTripAssign' value={tripDestination} onChange={(e) => { settripDestination(e.target.value) }}>
                          <option defaultChecked value={""}>---Select a Trip---</option>
                          {assignedroutes.length != 0? (
                            <>
                              <option value={`${routesselectionlist.filter((rt, i) => rt.routeID == assignedroutes[0].routeID)[0]?.stationList[0]?.stationName} - ${routesselectionlist.filter((rt, i) => rt.routeID == assignedroutes[0].routeID)[0]?.stationList[isInt(routesselectionlist.filter((rt, i) => rt.routeID == assignedroutes[0].routeID)[0]?.stationList.length/2)? (routesselectionlist.filter((rt, i) => rt.routeID == assignedroutes[0].routeID)[0]?.stationList.length/2 - 1) : Math.round(routesselectionlist.filter((rt, i) => rt.routeID == assignedroutes[0].routeID)[0]?.stationList.length/2 + 2)]?.stationName}`}>{routesselectionlist.filter((rt, i) => rt.routeID == assignedroutes[0].routeID)[0]?.stationList[0]?.stationName} - {routesselectionlist.filter((rt, i) => rt.routeID == assignedroutes[0].routeID)[0]?.stationList[isInt(routesselectionlist.filter((rt, i) => rt.routeID == assignedroutes[0].routeID)[0]?.stationList.length/2)? (routesselectionlist.filter((rt, i) => rt.routeID == assignedroutes[0].routeID)[0]?.stationList.length/2 - 1) : Math.round(routesselectionlist.filter((rt, i) => rt.routeID == assignedroutes[0].routeID)[0]?.stationList.length/2 + 2)]?.stationName}</option>
                              <option value={`${routesselectionlist.filter((rt, i) => rt.routeID == assignedroutes[0].routeID)[0]?.stationList[isInt(routesselectionlist.filter((rt, i) => rt.routeID == assignedroutes[0].routeID)[0]?.stationList.length/2)? (routesselectionlist.filter((rt, i) => rt.routeID == assignedroutes[0].routeID)[0]?.stationList.length/2 - 1) : Math.round(routesselectionlist.filter((rt, i) => rt.routeID == assignedroutes[0].routeID)[0]?.stationList.length/2 + 2)]?.stationName} - ${routesselectionlist.filter((rt, i) => rt.routeID == assignedroutes[0].routeID)[0]?.stationList[0]?.stationName}`}>{routesselectionlist.filter((rt, i) => rt.routeID == assignedroutes[0].routeID)[0]?.stationList[isInt(routesselectionlist.filter((rt, i) => rt.routeID == assignedroutes[0].routeID)[0]?.stationList.length/2)? (routesselectionlist.filter((rt, i) => rt.routeID == assignedroutes[0].routeID)[0]?.stationList.length/2 - 1) : Math.round(routesselectionlist.filter((rt, i) => rt.routeID == assignedroutes[0].routeID)[0]?.stationList.length/2 + 2)]?.stationName} - {routesselectionlist.filter((rt, i) => rt.routeID == assignedroutes[0].routeID)[0]?.stationList[0]?.stationName}</option>
                            </>
                          ) : null}
                        </select>
                      </td>
                      <td>
                        <select id='select_dayTripAssign' value={tripDay} onChange={(e) => { settripDay(e.target.value) }}>
                          <option defaultChecked value={""}>---Select a Day---</option>
                          <option value="Monday">Monday</option>
                          <option value="Tuesday">Tuesday</option>
                          <option value="Wednesday">Wednesday</option>
                          <option value="Thursday">Thursday</option>
                          <option value="Friday">Friday</option>
                          <option value="Saturday">Saturday</option>
                          <option value="Sunday">Sunday</option>
                        </select>
                      </td>
                      <td>
                        <input type='text' value={tripTime} onChange={(e) => { settripTime(e.target.value) }} className='input_tripAssign' placeholder='ex: 6:00 AM - 12:30 PM' />
                      </td>
                      <td>
                        <input type='text' value={tripInterval} onChange={(e) => { settripInterval(e.target.value) }} className='input_tripAssign' placeholder='ex: 30 minutes' />
                      </td>
                      <td>
                        <button onClick={() => {
                          saveTripSchedule()
                        }}
                        className='btns_list'><CheckIcon style={{fontSize: "15px"}} /></button>
                        <button className='btns_list' onClick={() => {
                          clearTripForm()
                        }}><UncheckIcon style={{fontSize: "15px"}} /></button>
                      </td>
                    </tr>
                    {/* Time Interval Data */}
                    {tripscheduleslist.map((tsl, i) => {
                      return(
                        <tr key={i}>
                            <td className='td_tripschedulelist' onClick={() => {  }}>{tsl.tripDestination}</td>
                            <td className='td_tripschedulelist' onClick={() => {  }}>{tsl.tripDay}</td>
                            <td className='td_tripschedulelist'>{tsl.tripTime}</td>
                            <td className='td_tripschedulelist'>{tsl.tripInterval}</td>
                            <td>
                              <button className='btns_list' onClick={() => { 
                                  deleteTripSchedule(tsl.tripID)
                               }}><DeleteIcon style={{fontSize: "15px"}} /></button>
                            </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            </li>
          </nav>
        </li>
        <li>
          <nav id='nav_details_page'>
            <li>
              <div id='div_adminslist'>
                <p className='label_informations_company'>Route</p>
              </div>
            </li>
            <li>
            <div className='div_lists'>
                <table className='tbl_lists'>
                  <tbody>
                    <tr>
                      <th className='th_adminlist'>Route ID</th>
                      <th className='th_adminlist'>Route Name</th>
                      <th className='th_adminlist'>Number of Stations</th>
                      <th className='th_adminlist'>Date Added</th>
                      <th className='th_adminlist'>Navigations</th>
                    </tr>
                    {assignedroutes.length == 1? null : (
                    <tr>
                      <td className='td_adminlist' onClick={() => {  }}>
                        <select id='select_routeAssign' value={selectedRouteSelection.routeID} onChange={(e) => {
                          // alert(e.target.value)
                          routesselectionlist.map((rt) => {
                            if(e.target.value == "none"){
                              setselectedRouteSelection({
                                routeID: "none",
                                routeName: "....",
                                stationTotal: "....",
                                dateAdded: "...."
                              })
                            }
                            else{
                              if(rt.routeID == e.target.value){
                                setselectedRouteSelection({
                                  routeID: e.target.value,
                                  routeName: rt.routeName,
                                  stationTotal: rt.stationList.length,
                                  dateAdded: rt.dateAdded
                                })
                              }
                            }
                          })
                        }}>
                          <option value="none" defaultChecked>---Select a Route---</option>
                          {routesselectionlist.map((rts, i) => {
                            return(
                              <option key={i} value={rts.routeID}>{rts.routeID} - {rts.routeName}</option>
                            )
                          })}
                        </select>
                      </td>
                      <td className='td_adminlist' onClick={() => {  }}>{selectedRouteSelection.routeName}</td>
                      <td className='td_adminlist'>{selectedRouteSelection.stationTotal}</td>
                      <motion.td
                      className='td_adminlist'>{selectedRouteSelection.dateAdded}</motion.td>
                      <td>
                        <button onClick={() => {
                          asignRoutetoCompany()
                        }}
                        className='btns_list'><CheckIcon style={{fontSize: "15px"}} /></button>
                        <button className='btns_list' onClick={() => {  }}><UncheckIcon style={{fontSize: "15px"}} /></button>
                      </td>
                    </tr>
                    )}
                    {routesselectionlist.map((rts, i) => 
                        assignedroutes.map((records, i) => {
                          if(records.routeID == rts.routeID){
                            return(
                              <tr key={i}>
                                <td className='td_adminlist' onClick={() => {  }}>{rts.routeID}</td>
                                <td className='td_adminlist' onClick={() => {  }}>{rts.routeName}</td>
                                <td className='td_adminlist'>{rts.stationList.length}</td>
                                <td className='td_adminlist'>{records.dateAssigned}</td>
                                <td>
                                  <button className='btns_list' onClick={() => { deleteAssignedRoute(records.companyID, rts.routeID) }}><DeleteIcon style={{fontSize: "15px"}} /></button>
                                </td>
                              </tr>
                            )
                          }
                        })
                    )}
                  </tbody>
                </table>
              </div>
            </li>
          </nav>
        </li>
      </nav>
    </div>
  )
}

export default CompDetails