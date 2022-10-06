import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import '../../../styles/subcomponents/CompDetails.css'
import BackIcon from '@material-ui/icons/KeyboardArrowLeft'
import Axios from 'axios'
import { URL } from '../../../json/urlconfig'
import { useDispatch, useSelector } from 'react-redux'
import { SET_COMPANY_RECORD } from '../../../redux/types'
import { companyRecordState } from '../../../redux/actions'
import DefaultIconComp from '../../../resources/defaultcompany.png'
import MessageIcon from '@material-ui/icons/Message';
import MailIcon from '@material-ui/icons/Mail'

function CompDetails() {

  const params = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()

  const companyID = params["companyID"];

  const companyrecord = useSelector(state => state.companyrecord);

  useEffect(() => {
    // console.log(params["companyID"])
    fetchCompanyData()

    return () => {
      dispatch({ type: SET_COMPANY_RECORD, companyrecord: companyRecordState })
    }
  }, [companyID])

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
                    <button title='Message' className='btn_header_companydata'><MessageIcon /></button>
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
      </nav>
    </div>
  )
}

export default CompDetails