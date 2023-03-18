import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import '../../../styles/subcomponents/DAManagementMain.css'
import MessagesIcon from '@material-ui/icons/Message'
import SearchIcon from '@material-ui/icons/Search'
import BellIcon from '@material-ui/icons/Notifications'
import Axios from 'axios'
import { URL } from '../../../json/urlconfig'
import { useSelector, useDispatch } from 'react-redux'
import { SET_DA_COMPANY_LIST, SET_DA_DRIVER_LIST } from '../../../redux/types'
import InfoIcon from '@material-ui/icons/Info'
import RightIcon from '@material-ui/icons/KeyboardArrowRightTwoTone'
import DAIcon from '@material-ui/icons/DirectionsBus'
import ReloadListIcon from '@material-ui/icons/Refresh'

function Main() {

  const dacompanylist = useSelector(state => state.dacompanylist);
  const dadriverlist = useSelector(state => state.dadriverlist);
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [selectedDriversList, setselectedDriversList] = useState("All");

  useEffect(() => {
    fetchCompanyList()
    fetchAllDrivers()

    return () => {
      dispatch({ type: SET_DA_COMPANY_LIST, dacompanylist: [] })
      dispatch({type: SET_DA_DRIVER_LIST, dadriverlist: []})
    }
  },[])

  const fetchCompanyList = () => {
    Axios.get(`${URL}/admin/getCompanyListDA`, {
      headers:{
        "x-access-token": localStorage.getItem("token")
      }
    }).then((response) => {
      if(response.data.status){
        dispatch({ type: SET_DA_COMPANY_LIST, dacompanylist: response.data.result })
        // console.log(response.data.result)
      }
      else{
        console.log(response.data.result.message)
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  const fetchAllDrivers = () => {
    setselectedDriversList("All")
    Axios.get(`${URL}/admin/getAllDrivers`, {
      headers:{
        "x-access-token": localStorage.getItem("token")
      }
    }).then((response) => {
      if(response.data.status){
        dispatch({type: SET_DA_DRIVER_LIST, dadriverlist: response.data.result})
      }
      else{
        console.log(response.data.message)
      }
    }).catch((err) => {
      console.log(err)
    })
  }

  const getCompanyDriversList = (companyIDprop, companyName) => {
    setselectedDriversList(companyName)
    Axios.get(`${URL}/admin/driverList/${companyIDprop}`, {
      headers:{
        "x-access-token": localStorage.getItem("token")
      }
    }).then((response) => {
      // console.log(response.data.result)
      if(response.data.status){
        dispatch({type: SET_DA_DRIVER_LIST, dadriverlist: response.data.result})
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  return (
    <div id='div_da_main'>
        <div id='div_da_header'>
            <p id='p_da_header_label'><DAIcon /> Driver Account Management</p>
            <div id='flexed_div'></div>
            <div id='div_search_input'>
              <input type='text' id='searchbox' name='searchbox' placeholder='Search a Driver' />
              <button id='btn_search_driver'><SearchIcon /></button>
            </div>
            <div id='flexed_div'></div>
            <div id='notifbar_div_da'>
             {/* <button onClick={() => { navigate("/home/messages/da") }} className='btn_notifbar_da'><MessagesIcon style={{fontSize: "20px", color: "#4B4B4B"}} /></button> */}
             <button onClick={() => { navigate("/home/notifications") }} className='btn_notifbar_da'><BellIcon style={{fontSize: "20px", color: "#4B4B4B"}} /></button>
            </div>
        </div>
        <div id='div_da_main_container'>
            <div id='div_da_main_header'>
              <div id='div_header_handler'>
                <p className='p_header_label_cont'>Company / Operator & Drivers List</p>
                <p className='p_header_label_cont'>Manage Drivers here</p>
              </div>
            </div>
            <hr id='hr_divider'/>
            <div id='div_main_lists'>
              <div className='div_list_sections_container'>
                <p className='p_each_list_label'>Company / Operators</p>
                <div className='div_list_sections'>
                  <table className='tbl_lists'>
                    <tbody>
                      <tr>
                        <th className='tbl_th th_first'>Company ID</th>
                        <th className='tbl_th'>Company Name</th>
                        <th className='tbl_th th_last'>Navigations</th>
                      </tr>
                      {dacompanylist.map((data, i) => {
                        return(
                          <tr key={i} className='tr_indv'>
                            <td>{data.companyID}</td>
                            <td>{data.companyName}</td>
                            <td>
                              <button className='btn_company_list_navs' onClick={() => { navigate(`/home/camanagement/companyDetails/${data.companyID}`) }}><InfoIcon style={{ fontSize: "15px" }} /></button>
                              <button className='btn_company_list_navs' onClick={() => { getCompanyDriversList(data.companyID, data.companyName) }}><RightIcon style={{ fontSize: "15px" }} /></button>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
              <div className='div_list_sections_container'>
                <p onClick={() => { fetchAllDrivers() }} className='p_each_list_label'>Drivers From ({selectedDriversList})</p>
                <div className='div_list_sections'>
                  <table className='tbl_lists'>
                    <tbody>
                      <tr>
                        <th className='tbl_th2 th_first'>Driver ID</th>
                        <th className='tbl_th2'>Company Name</th>
                        <th className='tbl_th2'>Driver Name</th>
                        <th className='tbl_th2 th_last'>Navigations</th>
                      </tr>
                      {dadriverlist.map((dadrv, i) => {
                        return(
                          <tr key={i} className='tr_indv'>
                            <td>{dadrv.userID}</td>
                            {dacompanylist.map((cmp, i) => {
                              if(cmp.companyID == dadrv.companyID){
                                return(
                                  <td key={i}>{cmp.companyName}</td>
                                )
                              }
                            })}
                            <td>{dadrv.firstName} {dadrv.middleName != "N/A"? dadrv.middleName : ""} {dadrv.lastName}</td>
                            <td>...</td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
        </div>
    </div>
  )
}

export default Main