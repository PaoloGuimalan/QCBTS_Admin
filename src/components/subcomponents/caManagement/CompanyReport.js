import React, { useRef, useState, useEffect } from 'react'
import '../../../styles/subcomponents/CompanyReport.css'
import { useNavigate, useParams } from 'react-router-dom'
import BackIcon from '@material-ui/icons/KeyboardArrowLeft'
import Axios from 'axios'
import { URL } from '../../../json/urlconfig'
import { useReactToPrint } from 'react-to-print'
import { Bar } from 'react-chartjs-2';

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
  const [averageTripPerDayTotal, setaverageTripPerDayTotal] = useState(0)
  const atpd = []

  function calculateAverage(array) {
    var total = 0;
    var count = 0;

    array.forEach(function(item, index) {
        total += item;
        count++;
    });

    return total / count;
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
        }
    }).catch((err) => {
        console.log(err)
    })
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
            }} >Print</button>
          </div>
        </li>
        <li>
            <div id='div_generated_report'>
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