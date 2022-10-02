import React from 'react'
import { useSelector } from 'react-redux';
import DefaultImg from '../../../resources/defaultimg.png'
import '../../../styles/subcomponents/CaManagement.css';
import BellIcon from '@material-ui/icons/Notifications'
import MessagesIcon from '@material-ui/icons/Message'
import SearchIcon from '@material-ui/icons/Search'
import { useNavigate } from 'react-router-dom';

function Index() {

  const auth = useSelector(state => state.authdetails);
  const navigate = useNavigate();

  const goToModule = (path) => {
    navigate(path)
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
                            <button onClick={() => { goToModule("/home/messages") }} className='btn_notifbar'><MessagesIcon style={{fontSize: "30px", color: "white"}} /></button>
                            <button onClick={() => { goToModule("/home/notifications") }} className='btn_notifbar'><BellIcon style={{fontSize: "30px", color: "white"}} /></button>
                        </div>
                    </li>
                </nav>
            </li>
            <li>
                <nav id='nav_table_intro'>
                    <li className='li_table_intro'>
                        <div id='div_table_intro'>
                            <p className='label_table_intro'>Operator/Company Admin Account</p>
                            <p className='label_table_intro'>Manage Account here</p>
                        </div>
                    </li>
                    <li className='li_table_intro'>
                        <button id='add_account_btn'>ADD ACCOUNT</button>
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
                                        <th className='th_header_company_list'>Contact Number</th>
                                        <th className='th_header_company_list'>Email</th>
                                        <th className='th_header_company_list'>Status</th>
                                    </tr>
                                    <tr id='tr_body_company_list'>
                                        <td>Hello</td>
                                        <td>Hello</td>
                                        <td>Hello</td>
                                        <td>Hello</td>
                                        <td>Hello</td>
                                        <td>Hello</td>
                                    </tr>
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