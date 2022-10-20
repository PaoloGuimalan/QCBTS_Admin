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
import { SET_CONVERSATION_LIST, SET_SELECTED_CONVID } from '../../../redux/types';
import { conversationListState } from '../../../redux/actions';
import NewMessage from './NewMessage';
import SyncIcon from '@material-ui/icons/Sync';
import EmptyIcon from '@material-ui/icons/ChatBubbleOutline'

function ListContainer({filterType}) {

  const filterTypeVar = filterType;

  const conversationlist = useSelector(state => state.conversationlist)
  const authdetails = useSelector(state => state.authdetails);

  const params = useLocation()
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const [selectedMessageHead, setselectedMessageHead] = useState("");
  const [selectedConvSection, setselectedConvSection] = useState("co");

  const [loader, setloader] = useState(true);

  let cancelAxios;

  useEffect(() => {
    if(params.pathname.split("/")[5] != undefined){
      setselectedMessageHead(params.pathname.split("/")[5])
    }
    else{
      setselectedMessageHead("")
    }
    // console.log(params.pathname.split("/")[4])
  },[params])

  useEffect(() => {

    return () => {
      dispatch({ type: SET_CONVERSATION_LIST, conversationlist: conversationListState })
    }
  },[])

  // useEffect(() => {
  //   initMessagesList()
  // },[params])

  const subscribeMessages = () => {
    // initConversation()
    if(typeof cancelAxios != typeof undefined){
      cancelAxios.cancel()
    }
    else{
      cancelAxios = Axios.CancelToken.source()
      Axios.get(`${URL}/messages/subscribeMessages`, {
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
          // console.log(err)
        }
        // console.log(err)
      })
    }
  }

  const initMessagesList = () => {
    Axios.get(`${URL}/messages/initMessagesList/systemadmins/${filterType}`, {
      headers:{
        "x-access-token": localStorage.getItem("token")
      }
    }).then((response) => {
      if(response.data.status){
        // console.log("alert")
        cancelAxios = undefined
        if(typeof cancelAxios != typeof undefined){
          cancelAxios.cancel()
          subscribeMessages()
        }
        else{
          subscribeMessages()
        }
        dispatch({ type: SET_CONVERSATION_LIST, conversationlist: response.data.result })
        setloader(false)
      }
      else{
        console.log(response.data.result)
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  useEffect(() => {
    // dispatch({ type: SET_CONVERSATION_LIST, conversationlist: conversationListState })
    initMessagesList()
    setselectedConvSection(params.pathname.split("/")[3])
    // alert("Helllo")
    return () => {
      // alert(conversationID)
      setloader(true)
      dispatch({ type: SET_CONVERSATION_LIST, conversationlist: conversationListState })
      cancelAxios.cancel();
      // cancelAxios.map((ctoken) => {
      //   ctoken();
      // })
    }

  },[params.pathname.split("/")[3]])

  return (
    <div id='div_listcontainer_main'>
        <div id='div_messages_list'>
          <div id='div_header_messages_list'>
            <div id='div_header_label'>
              <p id='p_label_header'>Messages</p>
              <button id='btn_new_message' onClick={() => {
                navigate(`/home/messages/${selectedConvSection}/newmessage`)
              }}><NewMessageIcon style={{fontSize: "25px"}} /></button>
            </div>
            <div id='div_searchbox_holder'>
              <input type='text' name='search_box' id='search_box' placeholder='Search' />
            </div>
            <div id='div_messages_list_array_container'>
              {loader? (
                <div id='div_loader_container'>
                  <motion.div
                    id='div_loader'
                    animate={{
                      rotate: -360,
                      transition:{
                        repeat: Infinity,
                        duration: 1,
                        repeatDelay: 0
                      }
                    }}
                  >
                    <SyncIcon style={{fontSize: "35px", color: "white"}} />
                  </motion.div>
                </div>
              ) : (
                conversationlist.conversations.length == 0? (
                  <div id='div_empty_container'>
                    <div>
                      <EmptyIcon style={{fontSize: "70px", color: "	#C0C0C0"}} />
                      <p id='p_label_empty'>No Conversations yet</p>
                    </div>
                  </div>
                ) : (
                  conversationlist.conversations.map((cnvs, i) => {
                    if(cnvs.to.userType == filterType || cnvs.from.userTyoe == filterType){
                      return(
                        <Link key={i} to={`/home/messages/${selectedConvSection}/ex/${cnvs.conversationID}`} className='link_message_header'>
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
                          onClick={() => {
                            dispatch({ type: SET_SELECTED_CONVID, selectedconvID: cnvs.conversationID })
                          }}
                          className='div_indv_message_head'>
                            <img src={DefaultIconMessage} className='img_container_messages_list' />
                            <div className='div_info_message_head'>
                              {conversationlist.profiles.map((prfs, j) => {
                                return(
                                  cnvs.to.userID == prfs.userID || cnvs.from.userID == prfs.userID? (
                                    <p key={j} className='p_info_container_label'>{prfs.userDisplayName}</p>
                                  ) : null
                                )
                              })}
                              <p className='p_info_container'>{cnvs.from.userID == authdetails.userID? "you: " : ""}{cnvs.content}</p>
                            </div>
                          </motion.div>
                        </Link>
                      )
                    }
                  })
                )
              )}
            </div>
          </div>
        </div>
        <div id='div_conversation_section'>
          <Routes>
            <Route path='/' element={<DefaultDisplay />} />
            <Route path='/ex/:conversationID' element={<Conversation filterType={filterTypeVar} />} />
            <Route path='/newmessage' element={<NewMessage filterType={filterTypeVar} />} />
          </Routes>
        </div>
    </div>
  )
}

export default ListContainer