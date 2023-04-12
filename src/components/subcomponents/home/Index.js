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
import { EXT_URL, URL } from '../../../json/urlconfig'
import { SET_LIVE_BUST_LIST } from '../../../redux/types'
import Axios from 'axios'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
// import CanvasJSReact from '../../../libs/canvasjs-3.7.5/canvasjs.react';


// var CanvasJS = CanvasJSReact.CanvasJS;
// var CanvasJSChart = CanvasJSReact.CanvasJSChart;

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Index() {

  const authdetails = useSelector(state => state.authdetails);
  const livebuslist = useSelector(state => state.livebuslist)

  const [date, setdate] = useState("");
  const [time, settime] = useState("");

  const [countAppUsersTotal, setcountAppUsersTotal] = useState({
    commuter: 0,
    company: 0,
    buses: 0,
    recentlyAdded: []
  })

  const [dataPoints, setdataPoints] = useState(
    [
      { _id: 1, label: "Jan",  count: 0  },
      { _id: 2, label: "Feb", count: 0  },
      { _id: 3, label: "Mar", count: 0  },
      { _id: 4, label: "Apr",  count: 0  },
      { _id: 5, label: "May",  count: 0  },
      { _id: 6, label: "Jun",  count: 0  },
      { _id: 7, label: "Jul",  count: 0  },
      { _id: 8, label: "Aug",  count: 0  },
      { _id: 9, label: "Sep",  count: 0  },
      { _id: 10, label: "Oct",  count: 0  },
      { _id: 11, label: "Nov",  count: 0  },
      { _id: 12, label: "Dec",  count: 0  }
    ]
  )

  // const options = {
  //   theme: "light2",
  //   title: {
  //     // text: "Nifty 50 Index"
  //   },
  //   data: [
  //   // {
  //   //   type: "line",
  //   //   xValueFormatString: "MMM YYYY",
  //   //   yValueFormatString: "#,##0.00",
  //   //   dataPoints: dataPoints
  //   // },
  //   {
	// 		type: "column",
	// 		dataPoints: dataPoints
	// 	}]
  // }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      }
    },
  };
  
  const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
  
  const data = {
    labels,
    datasets: [
      {
        label: 'Commuters',
        data: dataPoints.map((dt, i) => dt.count),
        backgroundColor: 'blue',
      },
      // {
      //   label: 'Drivers',
      //   data: dataPoints.map((dt, i) => dt.y),
      //   backgroundColor: 'orange',
      // }
    ],
  };

  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    setdate(`${dateGetter()}`)
    settime(`${timeGetter()}`)
    // initBusLiveNumber()
    initCountAppUsers()
    initMonthlyActiveStatistics()

    const interval = setInterval(() => {
      setdate(`${dateGetter()}`)
      settime(`${timeGetter()}`)
    }, 10000);

    return () => {
      clearInterval(interval);
    }
  },[])

  useEffect(() => {
    // var interval = setInterval(() => {
    //     Axios.get(`${EXT_URL}/liveData`).then((response) => {
    //         var arrayData = Object.values(response.data)
    //         // var arrayDataLength = arrayData.filter((dt, i) => dt.userID == selectedlivebus.userID).length
    //         // console.log(arrayData)
    //         dispatch({type: SET_LIVE_BUST_LIST, livebuslist: arrayData})
    //         // console.log(arrayDataLength)
    //         // if(arrayDataLength == 0){
    //         //     if(status == 0){
    //         //         status += 1
    //         //         dispatch({ type: SET_SELECTED_LIVE_BUS, selectedlivebus: { userID: "", companyID: "" } })
    //         //         if(selectedlivebus.userID != ""){
    //         //             if(Platform.OS == "android"){
    //         //                 ToastAndroid.show("Bus went offline", ToastAndroid.SHORT)
    //         //             }
    //         //             else{
    //         //                 alert("Bus went offline")
    //         //             }
    //         //         }
    //         //         // console.log(status, arrayDataLength)
    //         //     }
    //         // }
    //     }).catch((err) => {
    //         console.log(err)
    //     })
    // },2000)

    // return () => {
    //     clearInterval(interval)
    //     // status = false;
    // }

    // initLiveData()
},[])

// const initLiveData = () => {
//   Axios.get(`${EXT_URL}/liveData`).then((response) => {
//     var arrayData = Object.values(response.data)
//     // var arrayDataLength = arrayData.filter((dt, i) => dt.userID == selectedlivebus.userID).length
//     // console.log(arrayData)
//     dispatch({type: SET_LIVE_BUST_LIST, livebuslist: arrayData})
//     setTimeout(() => {
//       initLiveData()
//     }, 2000)
//   }).catch((err) => {
//       console.log(err)
//       setTimeout(() => {
//         initLiveData()
//       }, 2000)
//   })
// }

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

  const initCountAppUsers = () => {
    Axios.get(`${URL}/admin/countUsers`, {
      headers:{
        "x-access-token": localStorage.getItem("token")
      }
    }).then((response) => {
      if(response.data.status){
        // console.log(response.data.result)
        setcountAppUsersTotal(response.data.result)
      }
    }).catch((err) => {
      console.log(err)
    })
  }

  const initMonthlyActiveStatistics = () => {
    Axios.get(`${URL}/admin/getMonthlyActiveStatistics`, {
      headers:{
        "x-access-token": localStorage.getItem("token")
      }
    }).then((response) => {
      if(response.data.status){
        // console.log(response.data.result)
        // setdataPoints(response.data.result)
        var arrayFinal = []
        labels.map((lb, i) => {
          if(response.data.result.some(item => item.label === lb)){
            // console.log(response.data.result.find(item => item.label === lb))
            arrayFinal.push(response.data.result.find(item => item.label === lb))
          }
          else{
            // console.log(lb, i + 1)
            arrayFinal.push({
              _id: i + 1,
              label: lb,
              count: 0
            })
          }
        })
        setdataPoints(arrayFinal)
      }
    }).catch((err) => {
      console.log(err)
    })
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
              {/* <button className='btn_admin_info' onClick={() => {
                navigate("/home/messages/co")
              }}><MessagesIcon /></button> */}
              <button className='btn_admin_info' onClick={() => {
                navigate("/home/notifications")
              }}><BellIcon /></button>
            </div>
          </div>
          <div id='div_basic_analytics_container'>
            <div className='div_basic_analytics_indv'>
              <div className='div_basic_analytics_boxes_ind'>
                <div className='div_division_boxes_indv'>
                  <p className='p_data_indv_num'>{livebuslist.length}</p>
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
                  <p className='p_data_indv_num'>{countAppUsersTotal.buses}</p>
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
              <div className='div_basic_analytics_boxes_ind'>
                <div className='div_division_boxes_indv'>
                  <p className='p_data_indv_num'>{countAppUsersTotal.commuter}</p>
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
                  <p className='p_data_indv_num'>{countAppUsersTotal.company}</p>
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
            </div>
            <div className='div_basic_analytics_indv'>
              <div id='div_basic_analytics_map_container' onClick={() => { navigate("/home/map") }}>
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
                        {/* <th className='th_labels'>Email</th>
                        <th className='th_labels'>Number</th> */}
                        <th className='th_labels'>Company</th>
                        <th className='th_labels'>Status</th>
                      </tr>
                      {countAppUsersTotal.recentlyAdded.filter((rac, i) => rac.dateRegistered.split("/")[0] == date.split("/")[0]).map((res, j) => {
                          return(
                            <tr key={res.userID} className='tr_tbl_data_holder'>
                              <td className='td_labels'>{res.firstName} {res.middleName == "N/A"? "" : res.middleName} {res.lastName}</td>
                              <td className='td_labels'>{res.userID}</td>
                              {/* <td className='td_labels'>{res.email}</td>
                              <td className='td_labels'>{res.mobileNumber}</td> */}
                              <td className='td_labels'>{res.companyID}</td>
                              <td className='td_labels'>{res.status? "Activated" : "Deactivated"}</td>
                            </tr>
                          )
                      })}
                    </tbody>
                  </table>
                  {countAppUsersTotal.recentlyAdded.filter((rac, i) => rac.dateRegistered.split("/")[0] == date.split("/")[0]).length == 0? (
                      <div id='div_nnaam_label'>
                        <p>No Newly Added Accounts this month</p>
                      </div>
                  ) : null}
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
                    <option>Select Year</option>
                  </select>
                  <div id='div_recently_active_graph'>
                    <Bar options={options} data={data} style={{height: "100%"}} />
                    {/* <CanvasJSChart options={options} /> */}
                    {/* <p>Graph Area</p> */}
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