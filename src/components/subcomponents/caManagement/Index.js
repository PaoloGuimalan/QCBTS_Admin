import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import DefaultImg from '../../../resources/defaultimg.png'
import '../../../styles/subcomponents/CaManagement.css';
import BellIcon from '@material-ui/icons/Notifications'
import MessagesIcon from '@material-ui/icons/Message'
import SearchIcon from '@material-ui/icons/Search'
import { useNavigate } from 'react-router-dom';
import Axios from 'axios';
import { URL } from '../../../json/urlconfig'
import { SET_ALERT, SET_COMPANY_LIST } from '../../../redux/types';
import { motion } from 'framer-motion'
import DefaultIconComp from '../../../resources/defaultcompany.png'

function Index() {

  const auth = useSelector(state => state.authdetails);
  const companylist = useSelector(state => state.companylist);
  const dispatch = useDispatch();

  const navigate = useNavigate();

  const goToModule = (path) => {
    navigate(path)
  }

  useEffect(() => {
    // fetchCompanyList()
    fetchCompanyRegList()
  }, [])

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

  const fetchCompanyRegList = () => {
    Axios.get(`${URL}/admin/getCompanyListDA`, {
      headers:{
        "x-access-token": localStorage.getItem("token")
      }
    }).then((response) => {
      if(response.data.status){
        // dispatch({ type: SET_DA_COMPANY_LIST, dacompanylist: response.data.result })
        dispatch({type: SET_COMPANY_LIST, companylist: response.data.result});
        // console.log(response.data.result)
      }
      else{
        console.log(response.data.result.message)
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  const fetchCompanyList = () => {
    Axios.get(`${URL}/admin/companylist`, {
        headers:{
            "x-access-token": localStorage.getItem("token")
        }
    }).then((response) => {
        if(response.data.status){
            // console.log(response.data)
            dispatch({type: SET_COMPANY_LIST, companylist: response.data.result});
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
            fetchCompanyList();
            alertPrompt(true, `${cmpAdID} account has been ${sts? "Activated" : "Deactivated"}`)
            // console.log(response.data.result);
        }
        else{
            alertPrompt(false, `${sts? "Activation" : "Deactivation"} of ${cmpAdID} account failed`)
            // console.log(response.data.result);
        }
    }).catch((err) => {
        alertPrompt(false, `Update Request Error`)
        console.log(err);
    })
  }

  const redirectToCompDet = (compID) => {
    // alert(compID);
    navigate(`/home/camanagement/companyDetails/${compID}`)
  }

  const redirectToCompAdDet = (compAdID) => {
    // alert(compAdID);
    navigate(`/home/camanagement/companyAdminDetails/${compAdID}`)
  }

  return (
    <div id='div_camanagement'>
        <nav id='nav_camanagement'>
            <li>
                <nav id='header_nav_camanagement'>
                    <li className='li_header_nav'>
                        <div id='div_header'>
                            <img src={DefaultImg} id='admin_img_default' />
                            <div id='div_admin_info'>
                                <p className='label_admin_info'>{auth.fullname}</p>
                                <p className='label_admin_info'>Admin</p>
                            </div>
                        </div>
                    </li>
                    <li className='li_header_nav'>
                        <div id='notifbar_div'>
                            {/* <button onClick={() => { goToModule("/home/messages/ca") }} className='btn_notifbar'><MessagesIcon style={{fontSize: "30px", color: "white"}} /></button> */}
                            <button onClick={() => { goToModule("/home/notifications") }} className='btn_notifbar'><BellIcon style={{fontSize: "30px", color: "white"}} /></button>
                        </div>
                    </li>
                </nav>
            </li>
            <li>
                <nav id='nav_table_intro'>
                    <li className='li_table_intro'>
                        <div id='div_table_intro'>
                            <p className='label_table_intro'>Operator/Company Account</p>
                            <p className='label_table_intro'>Manage Account here</p>
                        </div>
                    </li>
                    <li className='li_table_intro'>
                        <button onClick={() => { goToModule("/home/camanagement/addcompany") }} id='add_account_btn'>ADD COMPANY</button>
                    </li>
                </nav>
            </li>
            <li id='li_list_section'>
                <nav id='nav_list_section'>
                    <li>
                        <div id='div_searchbar'>
                            <input type='text' id='search_input' name='search_input' placeholder='Search'/>
                            <button id='btn_search'><SearchIcon /></button>
                        </div>
                    </li>
                    <li id='li_company_list'>
                        <div id='div_table_holder'>
                            <table id='table_company_list'>
                                <tbody>
                                    <tr id='tr_header_company_list'>
                                        <th className='th_header_company_list'></th>
                                        <th className='th_header_company_list'>Company Name</th>
                                        <th className='th_header_company_list'>Company ID</th>
                                        <th className='th_header_company_list'>Address</th>
                                        <th className='th_header_company_list'>Email</th>
                                        <th className='th_header_company_list'>Date Registered</th>
                                    </tr>
                                    {companylist.map((data, i) => {
                                        // return(
                                        //     <tr key={i} id='tr_body_company_list'>
                                        //         <td className='td_data_company_list'>
                                        //             <motion.div
                                        //             animate={{
                                        //                 backgroundColor: data.status? "lime" : "red"
                                        //             }}
                                        //             className='div_status_icon'>&nbsp;</motion.div>
                                        //             {/* <img src={data.preview == "" || "none"? DefaultIconComp : data.preview} id='selected_company_img' /> */}
                                        //         </td>
                                        //         <td className='td_data_company_list'><p className='p_linker' onClick={() => { redirectToCompDet(data.companyID) }} >{data.companyName}</p></td>
                                        //         <td className='td_data_company_list'>
                                        //             <p className='p_linker' onClick={() => { redirectToCompDet(data.companyID) }} >{data.companyID}</p>
                                        //             <p className='p_linker' onClick={() => { redirectToCompAdDet(data.companyAdminID) }}>{data.companyAdminID}</p>
                                        //         </td>
                                        //         <td className='td_data_company_list'>
                                        //             <p className='p_linker' onClick={() => { redirectToCompAdDet(data.companyAdminID) }}>{data.companyAdmin.firstname} {data.companyAdmin.lastname}</p>
                                        //         </td>
                                        //         <td className='td_data_company_list'>
                                        //             <a className='link_conf' href={`mailto:${data.email}`}>{data.email}</a>
                                        //         </td>
                                        //         <td className='td_data_company_list'>
                                        //             <motion.p animate={{
                                        //                 color: data.status? "lime" : "red"
                                        //             }} className='p_status_label'>{data.status? "Activated" : "Deactivated"}</motion.p>
                                        //             <motion.button onClick={() => {
                                        //                 updateCompanyStatus(data.companyAdminID, data.status? false : true);
                                        //             }} animate={{
                                        //                 backgroundColor: data.status? "red" : "lime"
                                        //             }} id='btn_activation'>{data.status? "Deactivate?" : "Activate?"}</motion.button>
                                        //         </td>
                                        //     </tr>
                                        // )
                                        return(
                                            <tr key={i} id='tr_body_company_list'>
                                                <td className='td_data_company_list'>
                                                    <motion.div
                                                    animate={{
                                                        // backgroundColor: data.status? "lime" : "red"
                                                        backgroundColor: "lime"
                                                    }}
                                                    className='div_status_icon'>&nbsp;</motion.div>
                                                    {/* <img src={data.preview == "" || "none"? DefaultIconComp : data.preview} id='selected_company_img' /> */}
                                                </td>
                                                <td className='td_data_company_list'><p className='p_linker' onClick={() => { redirectToCompDet(data.companyID) }} >{data.companyName}</p></td>
                                                <td className='td_data_company_list'>
                                                    <p className='p_linker' onClick={() => { redirectToCompDet(data.companyID) }} >{data.companyID}</p>
                                                    {/* <p className='p_linker' onClick={() => { redirectToCompAdDet(data.companyAdminID) }}>{data.companyAdminID}</p> */}
                                                </td>
                                                {/* <td className='td_data_company_list'>
                                                    <p className='p_linker' onClick={() => { redirectToCompAdDet(data.companyAdminID) }}>{data.companyAdmin.firstname} {data.companyAdmin.lastname}</p>
                                                </td> */}
                                                <td className='td_data_company_list'>
                                                    <p className='p_linker' >{data.companyAddress}</p>
                                                </td>
                                                <td className='td_data_company_list'>
                                                    <a className='link_conf' href={`mailto:${data.email}`}>{data.email}</a>
                                                </td>
                                                <td className='td_data_company_list'>
                                                    <p className='p_linker' >{data.dateRegistered}</p>
                                                </td>
                                                {/* <td className='td_data_company_list'>
                                                    <motion.p animate={{
                                                        color: data.status? "lime" : "red"
                                                    }} className='p_status_label'>{data.status? "Activated" : "Deactivated"}</motion.p>
                                                    <motion.button onClick={() => {
                                                        updateCompanyStatus(data.companyAdminID, data.status? false : true);
                                                    }} animate={{
                                                        backgroundColor: data.status? "red" : "lime"
                                                    }} id='btn_activation'>{data.status? "Deactivate?" : "Activate?"}</motion.button>
                                                </td> */}
                                            </tr>
                                        )
                                    })}
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

export default Index