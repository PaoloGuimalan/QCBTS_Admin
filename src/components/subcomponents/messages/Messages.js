import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Axios from 'axios';
import { URL } from '../../../json/urlconfig'
import { motion } from 'framer-motion'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import '../../../styles/subcomponents/Messages.css'
import QAIcon from '@material-ui/icons/QuestionAnswer'
import DAIcon from '@material-ui/icons/DirectionsBus'
import CAIcon from '@material-ui/icons/Business'
import AdminIcon from '@material-ui/icons/SupervisorAccount'
import SelfIcon from '@material-ui/icons/Person'
import ListContainer from './ListContainer';


function Messages() {

  const navigate = useNavigate("")
  const params = useLocation();

  const [selectedNav, setselectedNav] = useState("");

  useEffect(() => {
    if(params.pathname.split("/")[3] == ""){
      navigate("/home/messages/co")
    }
  },[])

  useEffect(() => {
    setselectedNav(params.pathname.split("/")[3])
  },[params])

  return (
    <div id='div_messages_main'>
        <div id='div_navigations_section'>
            <motion.button
            animate={{
              backgroundColor: selectedNav == "co"? "#ffbf00" : "transparent"
            }}
            className='btn_navs_messages_main' onClick={() => {
              navigate("/home/messages/co")
            }}><QAIcon /></motion.button>
            <motion.button
            animate={{
              backgroundColor: selectedNav == "ca"? "#ffbf00" : "transparent"
            }}
            className='btn_navs_messages_main' onClick={() => {
              navigate("/home/messages/ca")
            }}><DAIcon /></motion.button>
            <motion.button
            animate={{
              backgroundColor: selectedNav == "da"? "#ffbf00" : "transparent"
            }}
            className='btn_navs_messages_main' onClick={() => {
              navigate("/home/messages/da")
            }}><CAIcon /></motion.button>
            <motion.button
            animate={{
              backgroundColor: selectedNav == "sa"? "#ffbf00" : "transparent"
            }}
            className='btn_navs_messages_main' onClick={() => {
              navigate("/home/messages/sa")
            }}><AdminIcon /></motion.button>
            <div id='flexed_div'></div>
            <button id='btn_message_account'><SelfIcon /></button>
        </div>
        <div id='div_conversation_list'>
            <Routes>
              <Route path='/co/*' element={<ListContainer filterType="commuters" />} />
              <Route path='/da/*' element={<ListContainer filterType="drivers" />} />
              <Route path='/ca/*' element={<ListContainer filterType="companyadmins" />} />
              <Route path='/sa/*' element={<ListContainer filterType="systemadmins" />} />
            </Routes>
        </div>
    </div>
  )
}

export default Messages