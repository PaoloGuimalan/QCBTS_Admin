import React, { useRef, useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import '../../../styles/subcomponents/DriverReport.css'
import BackIcon from '@material-ui/icons/KeyboardArrowLeft'
import Axios from 'axios'
import { URL } from '../../../json/urlconfig'
import { useReactToPrint } from 'react-to-print'
import { Bar } from 'react-chartjs-2';
import { useScreenshot, createFileName } from 'use-react-screenshot'

function DriverReport() {

  const params = useParams()
  const driverID = params["driverID"]
  const navigate = useNavigate()

  const driverReportDataDefault = {
    userID: "",
    companyID: "",
    userType: "",
    firstName: "",
    middleName: "",
    lastName: "",
    mobileNumber: null,
    email: "",
    dlicense: "",
    age: null,
    dateRegistered: "",
    timeRegistered: "",
    status: null,
    locationSharing: null,
    driveractivities: [],
    route: {
        routeID: "",
        routeName: "",
        dateAdded: "",
        addedBy: "",
        companyID: "",
        privacy: null,
        status: null,
        stationList: []
    },
    company: {
        companyID: "",
        companyName: "",
        companyAddress: "",
        companyNumber: "",
        email: "",
        dateRegistered: "",
        preview: "",
    }
  }

  const [driverReportDataState, setdriverReportDataState] = useState(driverReportDataDefault)
  const [labels, setlabels] = useState([])
  const [countsSorted, setcountsSorted] = useState([])
  const [sortedDates, setsortedDates] = useState([])
  var counts = [];
  var dateSorts = [];

  const [dateSelected, setdateSelected] = useState("none")
  const [dateSelectedGraph, setdateSelectedGraph] = useState("none")
  const [loadingGraph, setloadingGraph] = useState(true)

  const componentRef = useRef()
  const [image, takeScreenshot] = useScreenshot({
    type: "image/png",
    quality: 1.0
  })

  function PrintElemWindow(elem){
    var mywindow = window.open('', 'PRINT', 'height=500,width=700');
    var styles = "<style  type='text/css' media='print'>@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap'); #div_driverreport_main{ /* background-color: white; */ background-color: #e0e0e0; display: flex; flex-direction: column; width: 100%; height: 100%; overflow-y: auto; font-family: 'Roboto', sans-serif; } #nav_addcompany{ display: flex; background-color: transparent; flex-direction: column; overflow-y: auto; padding-bottom: 20px; } #div_addcompany_navigations{ background-color: transparent; display: flex; padding: 10px; gap: 5px; align-items: center; } #btn_backicon{ width: 40px; cursor: pointer; background-color: transparent; border: solid 0px black; } #label_company_details{ font-size: 15px; font-weight: bold; color: #404040; margin-top: 12px; } .flexed_div{ display: flex; flex: 1; } #btn_print{ background-color: #426BFC; height: 30px; width: 120px; border-radius: 10px; border: none; color: white; font-size: 13px; cursor: pointer; } #div_generated_report{ background-color: green; width: 100%; }</style>"

    mywindow.document.write('<html><head><title>' + document.title  + '</title>');
    mywindow.document.write(styles);
    mywindow.document.write('</head><body >');
    // mywindow.document.write('<h1>' + document.title  + '</h1>');
    mywindow.document.write(document.getElementById(elem).innerHTML);
    // mywindow.document.write(elem);
    mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    // mywindow.print();
    setTimeout(function(){mywindow.print();},1000);
    // mywindow.close();

    return true;
  }

//   const PrintElem = useReactToPrint({
//     content: () => componentRef.current,
//     print: async (printIframe) => {
//         // Do whatever you want here, including asynchronous work
//         // await generateAndSavePDF(printIframe);
//         console.log(printIframe.ifra)
//         // PrintElemWindow(printIframe.innerHTML)
//     }
//   })

  useEffect(() => {
    // initDriverReportData()
  },[])

  useEffect(() => {
    initDriverReportData()
  },[dateSelectedGraph])

  const initDriverReportData = () => {
    setloadingGraph(true)
    Axios.get(`${URL}/admin/getDriverReportData/${driverID}`, {
        headers:{
            "x-access-token": localStorage.getItem("token")
        }
    }).then((response) => {
        if(response.data.status){
            // console.log(response.data.result[0])
            setdriverReportDataState(response.data.result[0])
            // setlabels(response.data.result[0].route?.stationList.map((st, i) => st.stationID))
            // console.log(counts)
            sortGraphData(dateSelectedGraph, response)
            response.data.result[0]?.driveractivities.map((da, i) => da.dateCommited.dateRecorded).forEach(function (x) { dateSorts[x] = (dateSorts[x] || 0) + 1; })
            setsortedDates(Object.keys(dateSorts))
            // console.log(Object.keys(dateSorts))
        }
    }).catch((err) => {
        console.log(err)
    })
  }

  const sortGraphData = (dateSortProp, response) => {
    if(dateSortProp == "none"){
        response.data.result[0]?.driveractivities.map((da, i) => da.action.stationID).forEach(function (x) { counts[x] = (counts[x] || 0) + 1; })
        setlabels(Object.keys(counts))
        setcountsSorted(Object.values(counts))
        setloadingGraph(false)
    }
    else{
        response.data.result[0]?.driveractivities.filter((daf, i) => daf.dateCommited.dateRecorded == dateSelectedGraph).map((da, i) => da.action.stationID).forEach(function (x) { counts[x] = (counts[x] || 0) + 1; })
        setlabels(Object.keys(counts))
        setcountsSorted(Object.values(counts))
        setloadingGraph(false)
    }
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      }
    },
  };

//   const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

  const data = {
    labels,
    datasets: [
      {
        label: 'Times passed',
        data: countsSorted,
        backgroundColor: 'blue',
      },
      // {
      //   label: 'Drivers',
      //   data: dataPoints.map((dt, i) => dt.y),
      //   backgroundColor: 'orange',
      // }
    ],
  };

  const printElem = (elem) => {
    document.querySelectorAll(".li_home").forEach((a, i) => {
      if(i == 0){
        a.style.width = "0px"
      }
      else{
        a.style.width = "100%"
      }
    })

    setTimeout(() => {
      takeScreenshot(componentRef.current).then(download)
    },1000)
  }

  const download = (image, { name = `${driverID} Report`, extension = "png" } = {}) => {
    const a = document.createElement("a");
    a.href = image;
    a.download = createFileName(extension, name);
    a.click();

    setTimeout(() => {
      document.querySelectorAll(".li_home").forEach((a, i) => {
        if(i == 0){
          a.style.width = "350px"
        }
        else{
          a.style.width = "calc(100% - 350px)"
        }
      })
    },1000)
  };
    
  return (
    <div id='div_driverreport_main'>
       <nav id='nav_addcompany'>
        <li>
          <div id='div_addcompany_navigations'>
            <button id='btn_backicon' onClick={() => { 
              navigate(-1) 
            }} ><BackIcon style={{ fontSize: "35px", color: "#404040" }} /></button>
            <p id='label_company_details'>Driver Report</p>
            <div className='flexed_div'></div>
            <button id='btn_print' onClick={() => { 
            //   navigate(-1) 
                printElem("div_generated_report")
            }} >Print</button>
          </div>
        </li>
        <li>
            <div id='div_generated_report' ref={componentRef}>
                <p id='p_driver_generated_report_label'>Driver Report</p>
                <div id='div_driver_info_header'>
                    {driverReportDataState.userID == ""? (
                      <p className='p_driver_info_header'>...</p>
                    ) : (
                      <p className='p_driver_info_header'>{driverReportDataState.firstName} {driverReportDataState.middleName == "N/A" || driverReportDataState.middleName == ""? "" : driverReportDataState.middleName} {driverReportDataState.lastName} ({driverReportDataState.userID})</p>
                    )}
                    <p className='p_driver_info_header'>{driverReportDataState.route?.routeName}</p>
                    <p className='p_driver_info_header'>{driverReportDataState.company.companyName}</p>
                </div>
                <div id='div_driver_info_header'>
                    <div id='div_driver_reports_header'>
                        <div id='div_driver_reports_header_labels'>
                            <p className='p_driver_info_header'>Reports</p>
                            <p className='p_driver_info_header_last'>Time of Arrival and Departure</p>
                        </div>
                        <div id='div_driver_reports_header_filter'>
                            <p className='p_driver_info_header_last'>Show</p>
                            <select id='select_driver_info_date_sort' value={dateSelected} onChange={(e) => { setdateSelected(e.target.value) }}>
                                <option value="none" defaultChecked>All</option>
                                {sortedDates.map((sd, i) => {
                                    return(
                                        <option key={i} value={sd}>{sd}</option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>
                    <table id='tbl_trip_reports'>
                        <tbody>
                            <tr>
                                <th className='th_trip_reports'>Bus Stop ID</th>
                                <th className='th_trip_reports'>Bus Stop</th>
                                <th className='th_trip_reports'>Approach</th>
                                <th className='th_trip_reports'>Time</th>
                                <th className='th_trip_reports'>Address</th>
                                <th className='th_trip_reports'>Longitude</th>
                                <th className='th_trip_reports'>Latitude</th>
                            </tr>
                            {dateSelected == "none"? (
                                driverReportDataState.driveractivities?.map((da, i) => {
                                    return(
                                        <tr key={i}>
                                            <td className='td_trip_reports'>{da.action.stationID}</td>
                                            <td className='td_trip_reports'>{da.action.stationName}</td>
                                            <td className='td_trip_reports'>{da.action.actionType}</td>
                                            <td className='td_trip_reports'>{da.dateCommited.dateRecorded}<br />{da.dateCommited.timeRecorded}</td>
                                            <td className='td_trip_reports'>{da.action.address}</td>
                                            <td className='td_trip_reports'>{da.action.longitude}</td>
                                            <td className='td_trip_reports'>{da.action.latitude}</td>
                                        </tr>
                                    )
                                })
                            ) : (
                                driverReportDataState.driveractivities?.filter((daf, i) => daf.dateCommited.dateRecorded == dateSelected).map((da, i) => {
                                    return(
                                        <tr key={i}>
                                            <td className='td_trip_reports'>{da.action.stationID}</td>
                                            <td className='td_trip_reports'>{da.action.stationName}</td>
                                            <td className='td_trip_reports'>{da.action.actionType}</td>
                                            <td className='td_trip_reports'>{da.dateCommited.dateRecorded}<br />{da.dateCommited.timeRecorded}</td>
                                            <td className='td_trip_reports'>{da.action.address}</td>
                                            <td className='td_trip_reports'>{da.action.longitude}</td>
                                            <td className='td_trip_reports'>{da.action.latitude}</td>
                                        </tr>
                                    )
                                })
                            )}
                        </tbody>
                    </table>
                </div>
                <div id='div_driver_info_header'>
                    <div id='div_driver_reports_header'>
                        <div id='div_driver_reports_header_labels'>
                            <p className='p_driver_info_header'>Bus Stop</p>
                            <p className='p_driver_info_header_last'>No. of times passed in bus stop</p>
                        </div>
                        <div id='div_driver_reports_header_filter'>
                            <p className='p_driver_info_header_last'>Show</p>
                            <select id='select_driver_info_date_sort' value={dateSelectedGraph} onChange={(e) => { setdateSelectedGraph(e.target.value) }}>
                                <option value="none" defaultChecked>All</option>
                                {sortedDates.map((sd, i) => {
                                    return(
                                        <option key={i} value={sd}>{sd}</option>
                                    )
                                })}
                            </select>
                        </div>
                    </div>
                    <div id='div_bar_graph_container'>
                        {loadingGraph? (
                          <p className='p_graph_loader_label'>Loading Graph</p>
                        ) : (
                          <Bar options={options} data={data} style={{height: "100%"}} />
                        )}
                    </div>
                </div>
            </div>
        </li>
      </nav>
    </div>
  )
}

export default DriverReport