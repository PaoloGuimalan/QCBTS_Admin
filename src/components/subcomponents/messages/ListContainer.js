import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Axios from 'axios';
import { URL } from '../../../json/urlconfig'
import { motion } from 'framer-motion'
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import '../../../styles/subcomponents/ListContainer.css'
import Conversation from './Conversation';
import DefaultDisplay from './DefaultDisplay';
import NewMessageIcon from '@material-ui/icons/AddComment'
import DefaultIconMessage from '../../../resources/defaultimg.png';

function ListContainer({filterType}) {

  const filterTypeVar = filterType;
  const params = useLocation()

  const [selectedMessageHead, setselectedMessageHead] = useState("");

  useEffect(() => {
    if(params.pathname.split("/")[4] != undefined){
      setselectedMessageHead(params.pathname.split("/")[4])
    }
    else{
      setselectedMessageHead("")
    }
    // console.log(params.pathname.split("/")[4])
  },[params])

  return (
    <div id='div_listcontainer_main'>
        <div id='div_messages_list'>
          <div id='div_header_messages_list'>
            <div id='div_header_label'>
              <p id='p_label_header'>Messages</p>
              <button id='btn_new_message'><NewMessageIcon style={{fontSize: "25px"}} /></button>
            </div>
            <div id='div_searchbox_holder'>
              <input type='text' name='search_box' id='search_box' placeholder='Search' />
            </div>
            <div id='div_messages_list_array_container'>
              <Link to={`/home/messages/co/asdhasdkjh`} className='link_message_header'>
                <div className='div_indv_message_head'>
                  <img src={DefaultIconMessage} className='img_container_messages_list' />
                  <div className='div_info_message_head'>
                    <p className='p_info_container_label'>Hello</p>
                    <p className='p_info_container'>Hello</p>
                  </div>
                </div>
              </Link>
              <Link to={`/home/messages/co/1237912837`} className='link_message_header'>
                <div className='div_indv_message_head'>
                  <img src={DefaultIconMessage} className='img_container_messages_list' />
                  <div className='div_info_message_head'>
                    <p className='p_info_container_label'>Hello</p>
                    <p className='p_info_container'>Hello</p>
                  </div>
                </div>
              </Link>
            </div>
          </div>
        </div>
        <div id='div_conversation_section'>
          <Routes>
            <Route path='/' element={<DefaultDisplay />} />
            <Route path='/:conversationID' element={<Conversation />} />
          </Routes>
        </div>
    </div>
  )
}

export default ListContainer