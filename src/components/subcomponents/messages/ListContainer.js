import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Axios from 'axios';
import { URL } from '../../../json/urlconfig'
import { motion } from 'framer-motion'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import '../../../styles/subcomponents/ListContainer.css'
import Conversation from './Conversation';
import DefaultDisplay from './DefaultDisplay';
import NewMessageIcon from '@material-ui/icons/AddComment'

function ListContainer({filterType}) {

  const filterTypeVar = filterType;

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