import React, { useState, useEffect, useRef } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Axios from 'axios';
import { URL } from '../../../json/urlconfig'
import { motion } from 'framer-motion'
import { Route, Routes, useLocation, useNavigate, useParams } from 'react-router-dom';
import '../../../styles/subcomponents/Conversation.css'
import DefaultIconMessage from '../../../resources/defaultimg.png';
import MoreIcon from '@material-ui/icons/MoreHoriz'
import { SET_CONVERSATION_DATA, SET_CONVERSATION_LIST } from '../../../redux/types';
import { conversationDataState } from '../../../redux/actions';
import ImageIcon from '@material-ui/icons/Image'
import SendIcon from '@material-ui/icons/Send'

function Conversation({filterType}) {

  const conversationID = useParams().conversationID;
  const authdetails = useSelector(state => state.authdetails);
  const conversationdata = useSelector(state => state.conversationdata);
  const dispatch = useDispatch();

  const [content, setcontent] = useState("");
  const scrollHeightDiv = useRef(null);

  // const CancelToken = Axios.CancelToken;
  // let cancelAxios = [];
  let cancelAxios;
  
  useEffect(() => {
    dispatch({ type: SET_CONVERSATION_DATA, conversationdata: conversationDataState })
    initConversation()
    setcontent("")
    
    // source.cancel()
    return () => {
      // alert(conversationID)
      cancelAxios.cancel();
      // cancelAxios.map((ctoken) => {
      //   ctoken();
      // })
    }
  },[conversationID])

  useEffect(() => {

    // alert(conversationID)

    return () => {
      // dispatch({ type: SET_CONVERSATION_DATA, conversationdata: conversationDataState })
    }

  },[])

  const subscribeMessages = () => {
    // initConversation()
    if(typeof cancelAxios != typeof undefined){
      cancelAxios.cancel()
    }
    else{
      cancelAxios = Axios.CancelToken.source()
      Axios.get(`${URL}/messages/subscribeMessagesConvo`, {
        headers:{
          "x-access-token": localStorage.getItem("token"),
          "Access-Control-Allow-Origin": "*"
        },
        cancelToken: cancelAxios.token
      }).then((response) => {
        if(response.data.status){
          //run init commands
          cancelAxios = undefined
          initMessagesList()
        }
        else{
          //also run init commands
          // cancelAxios()
          // subscribeMessages()
          initMessagesList()
        }
      }).catch((err) => {
        // cancelAxios()
        // subscribeMessages()
        if(err.message != 'canceled'){
          cancelAxios = undefined;
          initMessagesList()
        }
        // console.log(err)
      })
    }
  }

  const initConversation = () => {
    Axios.get(`${URL}/messages/initConversation/${conversationID}`,{
      headers:{
        "x-access-token": localStorage.getItem("token")
      }
    }).then((response) => {
      if(response.data.status){
        cancelAxios = undefined
        if(typeof cancelAxios != typeof undefined){
          cancelAxios.cancel()
          subscribeMessages()
        }
        else{
          subscribeMessages()
        }
        dispatch({ type: SET_CONVERSATION_DATA, conversationdata: response.data.result })
        scrollToBottom()
        // console.log(response.data.result)
      }
      else{
        console.log(response.data.result.message)
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  const initMessagesList = () => {
    Axios.get(`${URL}/messages/initMessagesList/systemadmins/${filterType}`, {
      headers:{
        "x-access-token": localStorage.getItem("token")
      }
    }).then((response) => {
      if(response.data.status){
        // console.log("alert")
        initConversation()
        dispatch({ type: SET_CONVERSATION_LIST, conversationlist: response.data.result })
      }
      else{
        console.log(response.data.result)
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  const sendMessage = () => {
    if(content.trim().length == 0){
      alert("Empty")
    }
    else{
      // alert("Okay")
      Axios.post(`${URL}/messages/sendMessage`,{
        conversationID: conversationID,
        content: content,
        contentType: "text",
        toID: conversationdata.userDetails.userID,
        toType: filterType,
        filterType: filterType
      },{
        headers:{
          "x-access-token": localStorage.getItem("token")
        }
      }).then((response) => {
        if(response.data.status){
          //success
          setcontent("")
          // initMessagesList()
        }
        else{
          console.log(response.data.result.message)
        }
      }).catch((err) => {
        console.log(err);
      })
    }
  }

  useEffect(() => {
    // console.log(scrollHeightDiv.current)
    scrollToBottom()
  },[conversationID])

  const scrollToBottom = () => {
    scrollHeightDiv.current.scrollTo(0, scrollHeightDiv.current.scrollHeight)
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
        <div id='div_messages_series' ref={scrollHeightDiv}>
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
                      duration: 0.3
                    }
                  }}
                  key={i} className='p_chats_content'>{msg.content}</motion.p>
                )
              })}
            </div>
        </div>
        <div id='div_messages_actions'>
            <div id='div_actions_input'>
              <input type='text' id='sendMessageInput' name='sendMessageInput' placeholder="Type a message here ..." value={content} onChange={(e) => { setcontent(e.target.value) }} />
              <button className='btn_navs_input'><ImageIcon /></button>
              <button className='btn_navs_input' onClick={() => { sendMessage() }} ><SendIcon /></button>
            </div>
        </div>
    </div>
  )
}

export default Conversation