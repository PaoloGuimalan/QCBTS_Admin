import React, { useRef, useState, useEffect } from 'react'
import '../../../styles/subcomponents/CompanyReport.css'
import { useNavigate, useParams } from 'react-router-dom'
import BackIcon from '@material-ui/icons/KeyboardArrowLeft'
import Axios from 'axios'
import { URL } from '../../../json/urlconfig'
import { useReactToPrint } from 'react-to-print'
import { Bar } from 'react-chartjs-2';
import { useScreenshot, createFileName } from 'use-react-screenshot'

function CompanyReport() {

  const navigate = useNavigate()
  const params = useParams()
  const companyID = params["companyID"]

  useEffect(() => {
    initCompanyReport()
  },[])

  const companyReportDefault = {
      companyID: "",
      companyName: "",
      companyAddress: "",
      companyNumber: "",
      email: "",
      dateRegistered: "",
      ltoregno: "",
      preview: "",
      route: {
        routeID: "",
        routeName: "",
        stationList: [],
        dateAdded: "",
        addedBy: "",
        companyID: "",
        privacy: null,
        status: null
      },
      tripschedules: [],
      drivers: [],
      buses: []
  }

  const [companyReportState, setcompanyReportState] = useState(companyReportDefault)
  const [dateSelected, setdateSelected] = useState("none")
  const [dateSelectedGraph, setdateSelectedGraph] = useState("none")
  const [averageTripPerDayTotal, setaverageTripPerDayTotal] = useState(0)
  const [labels, setlabels] = useState([])
  const [waitingcommutersdata, setwaitingcommutersdata] = useState([])
  const [waitingCommutersCount, setwaitingCommutersCount] = useState([])
  const [dateListingArray, setdateListingArray] = useState([])
  const atpd = []
  const wcc = []
  const finaldataforgraph = []
  const dateListing = []

  const [loadingGraph, setloadingGraph] = useState(true);
  const [image, takeScreenshot] = useScreenshot({
    type: "image/png",
    quality: 3.0
  })
  const printReportRef = useRef(null)

  function calculateAverage(array) {
    var total = 0;
    var count = 0;

    array.forEach(function(item, index) {
        total += item;
        count++;
    });

    return total / count;
}

useEffect(() => {
  initWaitingCommutersData(dateSelectedGraph)
},[labels, dateSelectedGraph])

  const initWaitingCommutersData = (sortStatus) => {
    // setloadingGraph(true)
    Axios.get(`${URL}/admin/getWaitingCommutersPerBusStop`, {
      headers:{
        "x-access-token": localStorage.getItem("token")
      }
    }).then((response) => {
      if(response.data.status){
        // console.log(response.data.result.map((uawc, i) => ({
        //   ...uawc,
        //   _id: uawc.action.split(" ")[4]
        // })))
        // setwaitingcommutersdata(response.data.result.map((uawc, i) => ({
        //   ...uawc,
        //   _id: uawc.action.split(" ")[4]
        // })))
        // console.log(labels.map((lbs, i) => ))
        if(sortStatus == "none"){
          response.data.result.map((da, i) => da.action.split(" ")[4]).forEach(function (x) { wcc[x] = (wcc[x] || 0) + 1; })
          response.data.result.map((da, i) => da.dateCommited.dateRecorded).forEach(function (x) { dateListing[x] = (dateListing[x] || 0) + 1; })
          setdateListingArray(Object.keys(dateListing))
          // console.log(response.data.result)
          setwaitingcommutersdata(wcc)
          labels?.map((lbs, i) => {
            if(waitingcommutersdata[lbs] == undefined){
              finaldataforgraph.push(
                {
                  _id: lbs,
                  count: 0
                })
            }
            else{
              finaldataforgraph.push({
                _id: lbs,
                count: waitingcommutersdata[lbs]
              })
            }
          })
          setwaitingCommutersCount(finaldataforgraph)
          // console.log(finaldataforgraph)
          // setwaitingcommutersdata(wcc)
          setloadingGraph(false)
        }
        else{
          response.data.result.filter((rdrf, i) => rdrf.dateCommited.dateRecorded == sortStatus).map((da, i) => da.action.split(" ")[4]).forEach(function (x) { wcc[x] = (wcc[x] || 0) + 1; })
          response.data.result.map((da, i) => da.dateCommited.dateRecorded).forEach(function (x) { dateListing[x] = (dateListing[x] || 0) + 1; })
          setdateListingArray(Object.keys(dateListing))
          // console.log(response.data.result)
          setwaitingcommutersdata(wcc)
          labels?.map((lbs, i) => {
            if(waitingcommutersdata[lbs] == undefined){
              finaldataforgraph.push(
                {
                  _id: lbs,
                  count: 0
                })
            }
            else{
              finaldataforgraph.push({
                _id: lbs,
                count: waitingcommutersdata[lbs]
              })
            }
          })
          setwaitingCommutersCount(finaldataforgraph)
          // console.log(finaldataforgraph)
          // setwaitingcommutersdata(wcc)
          setloadingGraph(false)
          }
      }
    }).catch((err) => {
      console.log(err)
    })
  }

  const initCompanyReport = () => {
    Axios.get(`${URL}/admin/getCompanyReport/${companyID}`, {
        headers:{
            "x-access-token": localStorage.getItem("token")
        }
    }).then((response) => {
        if(response.data.status){
            //save state
            setcompanyReportState(response.data.result[0])
            response.data.result[0].tripschedules.map((da, i) => da.tripDay).forEach(function (x) { atpd[x] = (atpd[x] || 0) + 1; })
            // console.log(calculateAverage(Object.values(atpd)))
            setaverageTripPerDayTotal(calculateAverage(Object.values(atpd)))
            setlabels(response.data.result[0]?.route?.stationList?.map((stlf, i) =>  stlf.stationID))
            // console.log(response.data.result[0]?.route?.stationList?.map((stlf, i) =>  stlf.stationID))
            // setloadingGraph(false)
        }
    }).catch((err) => {
        console.log(err)
    })
  }

  // const labels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];

  const data = {
    labels,
    datasets: [
      {
        label: 'Waiting Commuters',
        data: waitingCommutersCount.map((wccm, i) => wccm.count),
        backgroundColor: 'blue',
      },
      // {
      //   label: 'Drivers',
      //   data: dataPoints.map((dt, i) => dt.y),
      //   backgroundColor: 'orange',
      // }
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
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
      takeScreenshot(printReportRef.current).then(download)
    },1000)
  }

  const download = (image, { name = `${companyID} Report`, extension = "png" } = {}) => {
    const a = document.createElement("a");
    a.href = image;
    a.download = createFileName(extension, name);
    // a.click();

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

    PrintElemWindow(a)
  };

  function PrintElemWindow(elem){
    var mywindow = window.open('', 'PRINT', 'height=500,width=700');
    var styles = "<style  type='text/css' media='print'>@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@300&display=swap'); #div_driverreport_main{ /* background-color: white; */ background-color: #e0e0e0; display: flex; flex-direction: column; width: 100%; height: 100%; overflow-y: auto; font-family: 'Roboto', sans-serif; } #nav_addcompany{ display: flex; background-color: transparent; flex-direction: column; overflow-y: auto; padding-bottom: 20px; } #div_addcompany_navigations{ background-color: transparent; display: flex; padding: 10px; gap: 5px; align-items: center; } #btn_backicon{ width: 40px; cursor: pointer; background-color: transparent; border: solid 0px black; } #label_company_details{ font-size: 15px; font-weight: bold; color: #404040; margin-top: 12px; } .flexed_div{ display: flex; flex: 1; } #btn_print{ background-color: #426BFC; height: 30px; width: 120px; border-radius: 10px; border: none; color: white; font-size: 13px; cursor: pointer; } #div_generated_report{ background-color: green; width: 100%; }</style>"

    mywindow.document.write('<html><head><title>' + document.title  + '</title>');
    // mywindow.document.write(styles);
    mywindow.document.write('</head><body>');
    // mywindow.document.write('<h1>Hello World</h1>');
    mywindow.document.write(`<img src=${elem} style="width: 100%; margin-top: 0px; background-color: green;" />`);
    // mywindow.document.write(elem);
    // mywindow.document.write('</body></html>');

    mywindow.document.close(); // necessary for IE >= 10
    mywindow.focus(); // necessary for IE >= 10*/

    // mywindow.print();
    setTimeout(function(){mywindow.print();},1000);
    // mywindow.close();

    return true;
  }

  return (
    <div id='div_companyreport_main'>
      <nav id='nav_addcompany'>
        <li>
          <div id='div_addcompany_navigations'>
            <button id='btn_backicon' onClick={() => { 
              navigate(-1) 
            }} ><BackIcon style={{ fontSize: "35px", color: "#404040" }} /></button>
            <p id='label_company_details'>Company Report</p>
            <div className='flexed_div'></div>
            <button id='btn_print' onClick={() => { 
            //   navigate(-1) 
              printElem("div_generated_report")
            }} >Print</button>
          </div>
        </li>
        <li>
            <div id='div_generated_report' ref={printReportRef}>
                <p id='p_driver_generated_report_label'>Company Report</p>
                <div id='div_driver_info_header'>
                    {companyReportState.companyID == ""? (
                        <p className='p_driver_info_header'>...</p>
                    ) : (
                        <p className='p_driver_info_header'>{companyReportState.companyName}</p>
                    )}
                    <p className='p_driver_info_header'>{companyReportState.email}</p>
                    <p className='p_driver_info_header'>{companyReportState.route?.routeName}</p>
                </div>
                <div className='div_dd_content_containers'>
                    <div id='div_dd_aci_content_main'>
                        <p className='p_dd_container_labels'>Company Information</p>
                        <div id='div_dd_aci_container'>
                            <div className='div_dd_aci_per_data_container'>
                                <p className='p_dd_aci_data_labels'>Company ID</p>
                                <p className='p_dd_aci_data_content'>{companyReportState.companyID}</p>
                            </div>
                            <div className='div_dd_aci_per_data_container'>
                                <p className='p_dd_aci_data_labels'>Address</p>
                                <p className='p_dd_aci_data_content'>{companyReportState.companyAddress}</p>
                            </div>
                            <div className='div_dd_aci_per_data_container'>
                                <p className='p_dd_aci_data_labels'>LTO Reg No.</p>
                                <p className='p_dd_aci_data_content'>{companyReportState.ltoregno == ""? "..." : companyReportState.ltoregno? companyReportState.ltoregno : "Pre-registered Company"}</p>
                            </div>
                            <div className='div_dd_aci_per_data_container'>
                                <p className='p_dd_aci_data_labels'>Contact Number</p>
                                <p className='p_dd_aci_data_content'>{companyReportState.companyNumber}</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className='div_company_total_sections'>
                  <div className='div_company_graphs'>
                    <div id='div_driver_reports_header'>
                        <div id='div_driver_reports_header_labels'>
                            <p className='p_bar_graph_label'>No. of Waiting Commuters per Bus Stop</p>
                        </div>
                        <div id='div_driver_reports_header_filter'>
                            <p className='p_driver_info_header_last'>Show</p>
                            <select id='select_driver_info_date_sort' value={dateSelectedGraph} onChange={(e) => { 
                              setdateSelectedGraph(e.target.value)
                              initCompanyReport() 
                              initWaitingCommutersData(e.target.value)
                            }}>
                                <option value="none" defaultChecked>All</option>
                                {dateListingArray.map((dla, i) => {
                                  return(
                                    <option key={i} value={dla}>{dla}</option>
                                  )
                                })}
                            </select>
                        </div>
                    </div>
                    <div id='div_bar_graph_container'>
                      {loadingGraph? (
                        <p className='p_graph_loader_label'>Loading Graph</p>
                      ) : (
                      <Bar data={data} options={options} style={{height: "100%", width: "100%"}} />
                      )}
                    </div>
                  </div>
                  {/* <div className='div_company_graphs'>
                    <p>Hello World</p>
                  </div> */}
                </div>
                <div className='div_company_total_sections'>
                    <div className='div_company_total_indvs'>
                      <p className='p_company_total_data'>{companyReportState.drivers.length}</p>
                      <p className='p_company_total_labels'>No. of Drivers</p>
                    </div>
                    <div className='div_company_total_indvs'>
                      <p className='p_company_total_data'>{companyReportState.buses.length}</p>
                      <p className='p_company_total_labels'>No. of Buses</p>
                    </div>
                    <div className='div_company_total_indvs'>
                      <p className='p_company_total_data'>{(averageTripPerDayTotal.toFixed(1) * companyReportState.drivers.filter((crs, i) => crs.status == true).length).toFixed(1)}</p>
                      <p className='p_company_total_labels'>Average Trips per Day</p>
                    </div>
                </div>
                <div id='div_driver_info_header'>
                    <div id='div_driver_reports_header'>
                        <div id='div_driver_reports_header_labels'>
                            <p className='p_driver_info_header'>Trip Schedules</p>
                            <p className='p_driver_info_header_last'>Company's Route Trip Schedule</p>
                        </div>
                        <div id='div_driver_reports_header_filter'>
                            <p className='p_driver_info_header_last'>Show</p>
                            <select id='select_driver_info_date_sort' value={dateSelected} onChange={(e) => { setdateSelected(e.target.value) }}>
                                <option value="none" defaultChecked>All</option>
                                <option value="Monday">Monday</option>
                                <option value="Tuesday">Tuesday</option>
                                <option value="Wednesday">Wednesday</option>
                                <option value="Thursday">Thursday</option>
                                <option value="Friday">Friday</option>
                                <option value="Saturday">Saturday</option>
                                <option value="Sunday">Sunday</option>
                            </select>
                        </div>
                    </div>
                    <table id='tbl_trip_reports'>
                        <tbody>
                            <tr>
                                <th className='th_trip_sched_reports'>Trip</th>
                                <th className='th_trip_sched_reports'>Day</th>
                                <th className='th_trip_sched_reports'>Time</th>
                                <th className='th_trip_sched_reports'>Interval</th>
                            </tr>
                            {dateSelected == "none"? (
                              companyReportState.tripschedules?.map((cat, i) => {
                                return(
                                  <tr key={i}>
                                      <td className='td_trip_reports'>{cat.tripDestination}</td>
                                      <td className='td_trip_reports'>{cat.tripDay}</td>
                                      <td className='td_trip_reports'>{cat.tripTime}</td>
                                      <td className='td_trip_reports'>{cat.tripInterval}</td>
                                  </tr>
                                )
                              })
                            ) : (
                              companyReportState.tripschedules.filter((catf, i) => catf.tripDay == dateSelected).map((cat, i) => {
                                return(
                                  <tr key={i}>
                                      <td className='td_trip_reports'>{cat.tripDestination}</td>
                                      <td className='td_trip_reports'>{cat.tripDay}</td>
                                      <td className='td_trip_reports'>{cat.tripTime}</td>
                                      <td className='td_trip_reports'>{cat.tripInterval}</td>
                                  </tr>
                                )
                              })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </li>
      </nav>
    </div>
  )
}

export default CompanyReport