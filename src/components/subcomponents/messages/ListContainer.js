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
import { SET_CONVERSATION_LIST } from '../../../redux/types';
import { conversationListState } from '../../../redux/actions';

function ListContainer({filterType}) {

  const filterTypeVar = filterType;

  const conversationlist = useSelector(state => state.conversationlist)
  const authdetails = useSelector(state => state.authdetails);

  const params = useLocation()
  const dispatch = useDispatch()

  const [selectedMessageHead, setselectedMessageHead] = useState("");
  const [selectedConvSection, setselectedConvSection] = useState("co");

  useEffect(() => {
    if(params.pathname.split("/")[4] != undefined){
      setselectedMessageHead(params.pathname.split("/")[4])
    }
    else{
      setselectedMessageHead("")
    }
    // console.log(params.pathname.split("/")[4])
  },[params])

  useEffect(() => {
    dispatch({ type: SET_CONVERSATION_LIST, conversationlist: conversationListState })
    initMessagesList()
    setselectedConvSection(params.pathname.split("/")[3])
    // alert("Helllo")
  },[params.pathname.split("/")[3]])

  useEffect(() => {

    return () => {
      dispatch({ type: SET_CONVERSATION_LIST, conversationlist: conversationListState })
    }
  },[])

  const initMessagesList = () => {
    Axios.get(`${URL}/messages/initMessagesList/${filterType}`, {
      headers:{
        "x-access-token": localStorage.getItem("token")
      }
    }).then((response) => {
      if(response.data.status){
        // console.log("alert")
        dispatch({ type: SET_CONVERSATION_LIST, conversationlist: response.data.result })
      }
      else{
        console.log(response.data.result)
      }
    }).catch((err) => {
      console.log(err);
    })
  }

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
              {conversationlist.conversations.map((cnvs, i) => {
                return(
                  <Link key={i} to={`/home/messages/${selectedConvSection}/${cnvs.conversationID}`} className='link_message_header'>
                    <motion.div
                    animate={{
                      backgroundColor: selectedMessageHead == cnvs.conversationID? "#1D3462" : "transparent",
                      boxShadow: selectedMessageHead == cnvs.conversationID? "0px 0px 2px black" : "0px 0px 0px black"
                    }}
                    whileHover={{
                      boxShadow: "0px 0px 2px black",
                      transition:{
                        duration: 0
                      }
                    }}
                    className='div_indv_message_head'>
                      <img src={DefaultIconMessage} className='img_container_messages_list' />
                      <div className='div_info_message_head'>
                        <p className='p_info_container_label'>{conversationlist.profiles[i].userDisplayName}</p>
                        <p className='p_info_container'>{cnvs.from.userID == authdetails.userID? "you: " : ""}{cnvs.content}</p>
                      </div>
                    </motion.div>
                  </Link>
                )
              })}
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