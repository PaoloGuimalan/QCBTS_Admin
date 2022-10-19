import React, { useEffect, useState } from 'react'
import '../../../styles/subcomponents/Home.css'
import AdminIcon from '@material-ui/icons/SupervisorAccount'
import DefaultImg from '../../../resources/defaultimg.png'
import { useDispatch, useSelector } from 'react-redux'
import BellIcon from '@material-ui/icons/Notifications'
import MessagesIcon from '@material-ui/icons/Message'
import { useNavigate } from 'react-router-dom'
import MainIndex from '../../maincomponents/MainIndex'
import BusIcon from '@material-ui/icons/DirectionsBus'
import BuildingIcon from '@material-ui/icons/Business'
import PhoneIcon from '@material-ui/icons/PhoneAndroid'
import RegIcon from '@material-ui/icons/SignalCellular4Bar'
import UpIcon from '@material-ui/icons/TrendingUp'
import DownIcon from '@material-ui/icons/TrendingDown'

function Index() {

  const authdetails = useSelector(state => state.authdetails);

  const [date, setdate] = useState("");
  const [time, settime] = useState("");

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setdate(`${dateGetter()}`)
    settime(`${timeGetter()}`)

    const interval = setInterval(() => {
      setdate(`${dateGetter()}`)
      settime(`${timeGetter()}`)
    }, 10000);

    return () => {
      clearInterval(interval);
    }
  },[])

  function dateGetter(){
      var today = new Date();
      var dd = String(today.getDate()).padStart(2, '0');
      var mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
      var yyyy = today.getFullYear();

      return today = mm + '/' + dd + '/' + yyyy;
  }

  function timeGetter(){
      var today = new Date();
      var hour = String(today.getHours() % 12 || 12);
      var minutes = String(today.getMinutes() >= 9? today.getMinutes() : `0${today.getMinutes()}`)
      var seconds = String(today.getSeconds() >= 9? today.getSeconds() : `0${today.getSeconds()}`)
      var timeIndicator = hour >= 12? "am" : "pm"

      return today = `${hour}:${minutes} ${timeIndicator}`;
  }

  return (
    <div id='div_home_main'>
      <div id='div_home_header'>
        <div id='div_home_header_icon'>
          <AdminIcon style={{fontSize: "30px", color: "#4B4B4B"}} />
          <p>Home | Dashboard</p>
        </div>
        <div id='div_home_header_flexed'></div>
        <div id='div_home_header_date_time'>
          <p className='p_header_date_time_label'>{date}</p>
          <p className='p_header_date_time_label'>{time}</p>
        </div>
      </div>
      <div id='div_home_main_section'>
        <div id='div_main_section_inside_container'>
          <div id='div_header_admin_info'>
            <div id='div_admin_name_img'>
              <img id='img_admin' src={DefaultImg} />
              <div id='div_admin_info'>
                <p className='p_admin_info'>{authdetails.fullname}</p>
                <p className='p_admin_info'>System Admin</p>
              </div>
            </div>
            <div id='div_flexed_admin_info'></div>
            <div id='div_admin_info_navs'>
              <button className='btn_admin_info' onClick={() => {
                navigate("/home/messages/co")
              }}><MessagesIcon /></button>
              <button className='btn_admin_info' onClick={() => {
                navigate("/home/notifications")
              }}><BellIcon /></button>
            </div>
          </div>
          <div id='div_basic_analytics_container'>
            <div className='div_basic_analytics_indv'>
              <div className='div_basic_analytics_boxes_ind'>
                <div className='div_division_boxes_indv'>
                  <p className='p_data_indv_num'>0</p>
                  <p className='p_data_indv'>Active Bus</p>
                  <div className='div_data_status'>
                    <UpIcon style={{color: "green", fontSize: "40px"}}/>
                    <p className='p_data_inc'>+2</p>
                  </div>
                </div>
                <div className='div_division_boxes_indv'>
                  <BusIcon style={{fontSize: "35px", color: "#4B4B4B"}} />
                </div>
              </div>
              <div className='div_basic_analytics_boxes_ind'>
                <div className='div_division_boxes_indv'>
                  <p className='p_data_indv_num'>0</p>
                  <p className='p_data_indv'>No. of Bus Company</p>
                  <div className='div_data_status'>
                    <UpIcon style={{color: "green", fontSize: "40px"}}/>
                    <p className='p_data_inc'>0</p>
                  </div>
                </div>
                <div className='div_division_boxes_indv'>
                  <BuildingIcon style={{fontSize: "35px", color: "#4B4B4B"}} />
                </div>
              </div>
              <div className='div_basic_analytics_boxes_ind'>
                <div className='div_division_boxes_indv'>
                  <p className='p_data_indv_num'>0</p>
                  <p className='p_data_indv'>No. of App Users</p>
                  <div className='div_data_status'>
                    <DownIcon style={{color: "red", fontSize: "40px"}}/>
                    <p className='p_data_dec'>-4</p>
                  </div>
                </div>
                <div className='div_division_boxes_indv'>
                  <PhoneIcon style={{fontSize: "35px", color: "#4B4B4B"}} />
                </div>
              </div>
              <div className='div_basic_analytics_boxes_ind'>
                <div className='div_division_boxes_indv'>
                  <p className='p_data_indv_num'>0</p>
                  <p className='p_data_indv_bus'>No. of Bus Registered</p>
                  <div className='div_data_status'>
                    <UpIcon style={{color: "green", fontSize: "40px"}}/>
                    <p className='p_data_inc'>+10</p>
                  </div>
                </div>
                <div className='div_division_boxes_indv'>
                  <RegIcon style={{fontSize: "35px", color: "#4B4B4B"}} />
                </div>
              </div>
            </div>
            <div className='div_basic_analytics_indv'>
              <div id='div_basic_analytics_map_container'>
                <MainIndex />
              </div>
            </div>
          </div>
          <div id='div_advanced_analytics_container'>
            <div className='div_advanced_analytics_inside'>
              <div className='div_advanced_analytics_data'>
                <div id='div_label_analytics_data'>
                  <p>Recent Added Accounts</p>
                </div>
                <div id='div_recently_added_accounts_container'>
                  <table id='tbl_recently_added_accounts'>
                    <tbody>
                      <tr id='tr_tbl_header_holder'>
                        <th className='th_labels'>Name</th>
                        <th className='th_labels'>ID Number</th>
                        <th className='th_labels'>Email</th>
                        <th className='th_labels'>Number</th>
                        <th className='th_labels'>Role</th>
                        <th className='th_labels'>Status</th>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
            <div className='div_advanced_analytics_inside'>
              <div className='div_advanced_analytics_data'>
                <div id='div_label_analytics_data'>
                  <p>Monthly Active People</p>
                </div>
                <div id='div_recently_active_container'>
                  <select id='select_date_range'>
                    <option>Date Range</option>
                  </select>
                  <div id='div_recently_active_graph'>
                    <p>Graph Area</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Index