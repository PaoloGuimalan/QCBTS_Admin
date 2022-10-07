import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import '../../../styles/subcomponents/CompDetails.css'
import BackIcon from '@material-ui/icons/KeyboardArrowLeft'
import Axios from 'axios'
import { URL } from '../../../json/urlconfig'
import { useDispatch, useSelector } from 'react-redux'
import { SET_ALERT, SET_COMPANY_RECORD } from '../../../redux/types'
import { companyRecordState } from '../../../redux/actions'
import DefaultIconComp from '../../../resources/defaultcompany.png'
import MessageIcon from '@material-ui/icons/Message';
import MailIcon from '@material-ui/icons/Mail'
import CheckIcon from '@material-ui/icons/Check'
import UncheckIcon from '@material-ui/icons/Close'
import EditIcon from '@material-ui/icons/Edit'
import InfoIcon from '@material-ui/icons/Info'
import { motion } from 'framer-motion'

function CompDetails() {

  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const companyID = params["companyID"];

  const companyrecord = useSelector(state => state.companyrecord);
  const [editForm, seteditForm] = useState(false);

  const [companyNameEdit, setcompanyNameEdit] = useState("");
  const [companyEmailEdit, setcompanyEmailEdit] = useState("");
  const [companyNumberEdit, setcompanyNumberEdit] = useState("");
  const [companyAddressEdit, setcompanyAddressEdit] = useState("");

  useEffect(() => {
    // console.log(params["companyID"])
    fetchCompanyData();
    setDefaultEditValues();

    return () => {
      dispatch({ type: SET_COMPANY_RECORD, companyrecord: companyRecordState })
    }
  }, [companyID]);

  useEffect(() => {
    setDefaultEditValues()
  }, [companyrecord])

  const setDefaultEditValues = () => {
    setcompanyNameEdit(companyrecord.companydata.companyName);
    setcompanyEmailEdit(companyrecord.companydata.email);
    setcompanyNumberEdit(companyrecord.companydata.companyNumber);
    setcompanyAddressEdit(companyrecord.companydata.companyAddress);
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

  const redirectToMessages = (compadID) => {
    navigate(`/home/messages/${compadID}`)
  }

  const redirectToCompAdDet = (compadID) => {
    navigate(`/home/camanagement/companyAdminDetails/${compadID}`)
  }

  return (
    <div id='div_addcompany'>
      <nav id='nav_addcompany'>
        <li>
          <div id='div_addcompany_navigations'>
            <button id='btn_backicon' onClick={() => { navigate("/home/camanagement") }} ><BackIcon style={{ fontSize: "35px", color: "white" }} /></button>
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
                      <p className='label_informations_company'>Basic Analytics</p>
                    </li>
                    <li className='li_holder_data'>
                      <div id='div_data_information_holder'>
                      <table id='tbl_data_information'>
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
        <li>
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
        </li>
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
                      <th className='th_adminlist'>.....</th>
                      <th className='th_adminlist'>.....</th>
                      <th className='th_adminlist'>.....</th>
                      <th className='th_adminlist'>.....</th>
                      <th className='th_adminlist'>.....</th>
                    </tr>
                    {/* {companyrecord.adminlist.map((records, i) => {
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
                          </td>
                        </tr>
                      )
                    })} */}
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