import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import '../../../styles/subcomponents/CompAdDetails.css'
import BackIcon from '@material-ui/icons/KeyboardArrowLeft'
import DefaultIconComp from '../../../resources/defaultimg.png'
// import DefaultIconComp from '../../../resources/defaultcompany.png'
import MessageIcon from '@material-ui/icons/Message';
import MailIcon from '@material-ui/icons/Mail'
import CheckIcon from '@material-ui/icons/Check'
import UncheckIcon from '@material-ui/icons/Close'
import EditIcon from '@material-ui/icons/Edit'
import InfoIcon from '@material-ui/icons/Info'
import Axios from 'axios'
import { URL } from '../../../json/urlconfig'
import { useDispatch, useSelector } from 'react-redux'
import { SET_COMPADMIN_DETAILS } from '../../../redux/types'
import { compAdminDetailsState } from '../../../redux/actions'
import { motion } from 'framer-motion'

function CompAdDetails() {

  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const companyAdID = params["companyAdID"];
  const compadmindetails = useSelector(state => state.compadmindetails)

  const [editForm, seteditForm] = useState(false);

  const [firstNameEdit, setfirstNameEdit] = useState("");
  const [lastNameEdit, setlastNameEdit] = useState("");
  const [emailEdit, setemailEdit] = useState("");

  useEffect(() => {
    fetchCompAdminData()
    setDefaultEditValues()

    return () => {
      dispatch({ type: SET_COMPADMIN_DETAILS, compadmindetails: compAdminDetailsState})
    }
  },[companyAdID])

  useEffect(() => {
    setDefaultEditValues()
  }, [compadmindetails])

  const fetchCompAdminData = () => {
    Axios.get(`${URL}/admin/getCompanyAdminData/${companyAdID}`, {
      headers:{
        "x-access-token": localStorage.getItem("token")
      }
    }).then((response) => {
      if(response.data.status){
        // console.log(response.data.result);
        dispatch({ type: SET_COMPADMIN_DETAILS, compadmindetails: {
          compAdDetails: response.data.result
        } })
      }
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
            fetchCompAdminData();
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

  const setDefaultEditValues = () => {
    setfirstNameEdit(compadmindetails.compAdDetails.companyAdmin.firstname);
    setlastNameEdit(compadmindetails.compAdDetails.companyAdmin.lastname);
    setemailEdit(compadmindetails.compAdDetails.email);
  }

  const updateCompAdminDetails = () => {
    if(firstNameEdit != "" && lastNameEdit != "" && emailEdit != ""){
      Axios.post(`${URL}/admin/updateCompanyAdminData`, {
        companyAdminID: companyAdID,
        firstName: firstNameEdit,
        lastName: lastNameEdit,
        email: emailEdit
      },{
        headers:{
          "x-access-token": localStorage.getItem("token")
        }
      }).then((response) => {
        if(response.data.status){
          fetchCompAdminData()
          seteditForm(!editForm)
        }
        else{
          console.log(response.data.result.message)
        }
      }).catch((err) => {
        console.log(err)
      })
    }
    else{
      console.log("Please fill up all fields")
    }
  }

  return (
    <div id='div_addcompany'>
      <nav id='nav_addcompany'>
        <li>
          <div id='div_addcompany_navigations'>
            <button id='btn_backicon' onClick={() => { navigate(-1) }} ><BackIcon style={{ fontSize: "35px", color: "white" }} /></button>
            <p id='label_addcompany'>Company Admin Details</p>
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
                    <p className='p_header_labels'>{compadmindetails.compAdDetails.companyAdmin.firstname} {compadmindetails.compAdDetails.companyAdmin.lastname}</p>
                    <p className='p_header_labels'>{compadmindetails.compAdDetails.email}</p>
                  </div>
                </li>
                <li>
                  <div id='div_header_contacts'>
                    <button title='Edit Details' onClick={() => { seteditForm(!editForm); setDefaultEditValues(); }} className='btn_header_companydata'><EditIcon /></button>
                    <button title='Email' className='btn_header_companydata' onClick={() => { window.location.href = `mailto:${compadmindetails.compAdDetails.email}` }} ><MailIcon /></button>
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
                              <td className='td_table_information'>{compadmindetails.compAdDetails.companyID}</td>
                            </tr>
                            <tr className='tr_data'>
                              <th className='th_table_information'>Admin ID: </th>
                              <td className='td_table_information'>{compadmindetails.compAdDetails.companyAdminID}</td>
                            </tr>
                            <tr className='tr_data'>
                              <th className='th_table_information'>Company Assigned: </th>
                              <td className='td_table_information'>{compadmindetails.compAdDetails.companyName}</td>
                            </tr>
                            <tr className='tr_data'>
                              <th className='th_table_information'>Status: </th>
                              <motion.td
                              animate={{
                                fontWeight: "bold",
                                color: compadmindetails.compAdDetails.status? "lime" : "red"
                              }}
                              className='td_table_information'>{
                              compadmindetails.compAdDetails.status == null? "" : 
                              compadmindetails.compAdDetails.status? "Active" : "Inactive"
                              }</motion.td>
                            </tr>
                            <tr className='tr_data'>
                              <th className='th_table_information'>Date Registered: </th>
                              <td className='td_table_information'>{compadmindetails.compAdDetails.dateRegistered}</td>
                            </tr>
                            <tr className='tr_data'>
                              <th className='th_table_information'>
                                <motion.button
                                onClick={() => {
                                  updateCompanyStatus(compadmindetails.compAdDetails.companyAdminID, compadmindetails.compAdDetails.status? false : true)
                                }}
                                animate={{
                                  backgroundColor: compadmindetails.compAdDetails.status == null? "grey" : 
                                  compadmindetails.compAdDetails.status? "red" : "lime"
                                }} 
                                id='status_btn'>{
                                compadmindetails.compAdDetails.status == null? "" : 
                                compadmindetails.compAdDetails.status? "Deactivate" : "Activate"
                                }</motion.button>
                              </th>
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
                      <p className='label_informations_company'>Activity History</p>
                    </li>
                    <li className='li_holder_data'>
                      <div id='div_history_information_holder'>
                        {/* <table id='tbl_data_information'>
                          <tbody>
                            <tr className='tr_data'>
                              <th className='th_table_information'>Active Admins: </th>
                              <td className='td_table_information'>none</td>
                            </tr>
                            <tr className='tr_data'>
                              <th className='th_table_information'>Active Drivers: </th>
                              <td className='td_table_information'>none</td>
                            </tr>
                          </tbody>
                        </table> */}
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
                      <p className='p_label_inputsedit'>Full Name</p>
                      <input type='text' onChange={(e) => { setfirstNameEdit(e.target.value) }} value={firstNameEdit} name='firstNameAdmin' id='firstNameAdmin' placeholder='First Name' className='inputsedit' />
                      <input type='text' onChange={(e) => { setlastNameEdit(e.target.value) }} value={lastNameEdit} name='lastNameAdmin' id='lastNameAdmin' placeholder='Last Name' className='inputsedit' />
                    </div>
                    <div className='div_inputcontainers'>
                      <p className='p_label_inputsedit'>Email</p>
                      <input type='text' onChange={(e) => { setemailEdit(e.target.value) }} value={emailEdit} name='companyEmail' id='companyEmail' placeholder='Email' className='inputsedit' />
                    </div>
                    <div className='div_inputcontainers div_inputcontainers_centered'>
                      <button id='change_paswword_btn'>Change Password</button>
                    </div>
                  </div>
                  <div id='div_btns'>
                    <button className='btn_edit_navs' onClick={() => { updateCompAdminDetails() }}>Save</button>
                    <button className='btn_edit_navs' onClick={() => { seteditForm(!editForm); setDefaultEditValues(); }}>Cancel</button>
                  </div>
                </div>
              </div>
            </li>
          </motion.nav>
        </li>
      </nav>
    </div>
  )
}

export default CompAdDetails