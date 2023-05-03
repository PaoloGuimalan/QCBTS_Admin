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
      }
  }

  const [companyReportState, setcompanyReportState] = useState(companyReportDefault)

  const initCompanyReport = () => {
    Axios.get(`${URL}/admin/getCompanyReport/${companyID}`, {
        headers:{
            "x-access-token": localStorage.getItem("token")
        }
    }).then((response) => {
        if(response.data.status){
            //save state
            setcompanyReportState(response.data.result[0])
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
            </div>
        </li>
      </nav>
    </div>
  )
}

export default CompanyReport