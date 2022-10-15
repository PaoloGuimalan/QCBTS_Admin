import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Axios from 'axios';
import { URL } from '../../../json/urlconfig'
import { motion } from 'framer-motion'
import { Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import '../../../styles/subcomponents/Conversation.css'
import DefaultIconMessage from '../../../resources/defaultimg.png';
import MoreIcon from '@material-ui/icons/MoreHoriz'
import { SET_CONVERSATION_DATA } from '../../../redux/types';
import { conversationDataState } from '../../../redux/actions';
import ImageIcon from '@material-ui/icons/Image'
import SendIcon from '@material-ui/icons/Send'

function Conversation() {

  const conversationID = useParams().conversationID;
  const authdetails = useSelector(state => state.authdetails);
  const conversationdata = useSelector(state => state.conversationdata);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch({ type: SET_CONVERSATION_DATA, conversationdata: conversationDataState })
    initConversation()
    // console.log(conversationID)
  },[conversationID])

  useEffect(() => {

    return () => {
      dispatch({ type: SET_CONVERSATION_DATA, conversationdata: conversationDataState })
    }

  },[])

  const initConversation = () => {
    Axios.get(`${URL}/messages/initConversation/${conversationID}`,{
      headers:{
        "x-access-token": localStorage.getItem("token")
      }
    }).then((response) => {
      if(response.data.status){
        dispatch({ type: SET_CONVERSATION_DATA, conversationdata: response.data.result })
        // console.log(response.data.result)
      }
      else{
        console.log(response.data.result.message)
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  return (
    <div id='div_conversation_indv_main'>
        <div id='div_conversation_header'>
            <img src={DefaultIconMessage} className='img_container_conversation' />
            <div>
              <p id='label_other_user_name'>{conversationdata.userDetails.userDisplayName}</p>
              <p id='label_other_user_type'>{
                conversationdata.userDetails.userType == "systemAdmin"? "System Admin" : 
                conversationdata.userDetails.userType == "companyAdmin"? "Company" : 
                conversationdata.userDetails.userType == "driver"? "Driver" : 
                conversationdata.userDetails.userType == "commuter"? "Commuter" : ""
              }</p>
            </div>
            <div id='div_flex_spacer'></div>
            <button id='btn_more_conv'><MoreIcon style={{fontSize: "25px"}} /></button>
        </div>
        <div id='div_messages_series'>
            <div id='div_userDetailsPrev'>
              <img id='img_userDetailsPrev' src={conversationdata.userDetails.preview == "none"? DefaultIconMessage : conversationdata.userDetails.preview} />
              <p className='p_label_userDetailsPrev'>{conversationdata.userDetails.userDisplayName}</p>
              <p className='p_label_userDetailsPrev'>{
                conversationdata.userDetails.userType == "systemAdmin"? "System Admin" : 
                conversationdata.userDetails.userType == "companyAdmin"? "Company" : 
                conversationdata.userDetails.userType == "driver"? "Driver" : 
                conversationdata.userDetails.userType == "commuter"? "Commuter" : ""
              }</p>
            </div>
            <div id='div_chats_messages_series'>
              {conversationdata.conversation.map((msg, i) => {
                return(
                  <motion.p
                  initial={{
                    scale: 0.1,
                    marginRight: msg.from.userID == authdetails.userID? "0px" : "auto",
                    marginLeft: msg.from.userID == authdetails.userID? "auto" : "0px",
                    backgroundColor: msg.from.userID == authdetails.userID? "#FFBF00" : "#1D3462",
                  }}
                  animate={{
                    scale: 1,
                    transition:{
                      duration: 0.4
                    }
                  }}
                  key={i} className='p_chats_content'>{msg.content}</motion.p>
                )
              })}
            </div>
        </div>
        <div id='div_messages_actions'>
            <div id='div_actions_input'>
              <input type='text' id='sendMessageInput' name='sendMessageInput' placeholder="Type a message here ..." />
              <button className='btn_navs_input'><ImageIcon /></button>
              <button className='btn_navs_input'><SendIcon /></button>
            </div>
        </div>
    </div>
  )
}

export default Conversation