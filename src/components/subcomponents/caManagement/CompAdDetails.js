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

function CompAdDetails() {

  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const companyAdID = params["companyAdID"];
  const compadmindetails = useSelector(state => state.compadmindetails)

  const [editForm, seteditForm] = useState(false);

  useEffect(() => {
    fetchCompAdminData()

    return () => {
      dispatch({ type: SET_COMPADMIN_DETAILS, compadmindetails: compAdminDetailsState})
    }
  },[companyAdID])

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

  return (
    <div id='div_addcompany'>
      <nav id='nav_addcompany'>
        <li>
          <div id='div_addcompany_navigations'>
            <button id='btn_backicon' onClick={() => { navigate("/home/camanagement") }} ><BackIcon style={{ fontSize: "35px", color: "white" }} /></button>
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
                    <button title='Edit Details' onClick={() => { seteditForm(!editForm); }} className='btn_header_companydata'><EditIcon /></button>
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
                              <td className='td_table_information'>{
                              compadmindetails.compAdDetails.status == null? "" : 
                              compadmindetails.compAdDetails.status? "Active" : "Inactive"
                              }</td>
                            </tr>
                            <tr className='tr_data'>
                              <th className='th_table_information'>Date Registered: </th>
                              <td className='td_table_information'>{compadmindetails.compAdDetails.dateRegistered}</td>
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
      </nav>
    </div>
  )
}

export default CompAdDetails