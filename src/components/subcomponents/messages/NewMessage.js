import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Axios from 'axios';
import { URL } from '../../../json/urlconfig'
import { motion } from 'framer-motion'
import { Link, Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import '../../../styles/subcomponents/NewMessage.css'
import IconHeader from '@material-ui/icons/Forum'
import DefaultIconMessage from '../../../resources/defaultimg.png';
import ImageIcon from '@material-ui/icons/Image'
import SendIcon from '@material-ui/icons/Send'


function NewMessage({filterType}) {

  const [recipientlist, setrecipientlist] = useState([]);
  const [selectedrecipient, setselectedrecipient] = useState({
    userID: "",
    userDisplayName: "",
    preview: "none",
    userType: "",
  });
  const [content, setcontent] = useState("");
  const authdetails = useSelector(state => state.authdetails);

  const selectedrecipientState = {
    userID: "",
    userDisplayName: "",
    preview: "none",
    userType: "",
  }

  const navigate = useNavigate();

  useEffect(() => {
    initRecipientList()
  },[filterType])

  const initRecipientList = () => {
    Axios.get(`${URL}/messages/recipientlist/${
    filterType == "systemadmins"? "systemAdmin" : 
    filterType == "companyadmins"? "companyAdmin" : 
    filterType == "drivers"? "driver" : 
    filterType == "commuters"? "commuter" : ""}`, {
        headers:{
            "x-access-token": localStorage.getItem("token")
        }
    }).then((response) => {
        if(response.data.status){
            setrecipientlist(response.data.result)
        }
        else{
            console.log(response.data.result.message)
        }
    }).catch((err) => {
        console.log(err)
    })
  }

  const sendMessage = () => {
    if(content.trim().length == 0){
      alert("Empty")
    }
    else{
      // alert("Okay")
      if(selectedrecipient.userID != ""){
          Axios.post(`${URL}/messages/newMessage`,{
            content: content,
            contentType: "text",
            toID: selectedrecipient.userID,
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
              navigate(`/home/messages/${
                filterType == "systemadmins"? "sa" : 
                filterType == "companyadmins"? "ca" : 
                filterType == "drivers"? "da" : 
                filterType == "commuters"? "co" : ""
              }/ex/${response.data.result.conversationID}`)
            }
            else{
              console.log(response.data.result.message)
            }
          }).catch((err) => {
            console.log(err);
          })
      }
      else{
        alert("No Recipient!")
      }
    }
  }

  return (
    <div id='div_newmessage'>
        <div id='div_newmessage_header'>
            <IconHeader style={{fontSize: "120px", color: "white"}} />
            <p id='p_label_newmessage'>You are creating a new message for {
                filterType == "systemadmins"? "a System Admin" : 
                filterType == "companyadmins"? "a Company" : 
                filterType == "drivers"? "a Driver" : 
                filterType == "commuters"? "a Commuter" : ""
            }</p>
            <p id='p_note_newmessage'>{selectedrecipient.userID != ""? "Your Recipient" : "Please select a recipient"}</p>
            <motion.div
            animate={{
                height: selectedrecipient.userID != ""? "90px" : "0px",
                paddingTop: selectedrecipient.userID != ""? "5px" : "0px",
                paddingBottom: selectedrecipient.userID != ""? "5px" : "0px"
            }}
            id='div_recipient'>
                <img src={selectedrecipient.preview == "none"? DefaultIconMessage : selectedrecipient.preview} id='img_recipient' />
                <div>
                    <p className='p_sublabel_recipient'>{selectedrecipient.userDisplayName}</p>
                    <p className='p_sublabel_recipient'>{
                        selectedrecipient.userType == "systemAdmin"? "System Admin" : 
                        selectedrecipient.userType == "companyAdmin"? "Company" : 
                        selectedrecipient.userType == "driver"? "Driver" : 
                        selectedrecipient.userType == "commuter"? "Commuter" : ""
                    }</p>
                </div>
            </motion.div>
            <select id='select_recipient' onChange={(e) => {
                setselectedrecipient(JSON.parse(e.target.value))
                // console.log(JSON.parse(e.target.value))
            }}>
                <option value={JSON.stringify(selectedrecipientState)}>---Select a Recipient---</option>
                {recipientlist.map((rcps, i) => {
                    if(rcps.userID != authdetails.userID){
                        return(
                            <option key={i} value={JSON.stringify(rcps)}>{rcps.userDisplayName}</option>
                        )
                    }
                })}
            </select>
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

export default NewMessage