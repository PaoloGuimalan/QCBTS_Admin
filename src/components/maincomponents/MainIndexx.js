import React, { useRef, useEffect, useState } from 'react'
import Axios from 'axios';

function MainIndexx() {

  const [messages, setmessages] = useState([]);
  const [otheruser, setotheruser] = useState("");
  const [username, setusername] = useState("");
  const [messageinp, setmessageinp] = useState("")

  useEffect(() => {
    
  },[])

  const subscribe = async () => {
    Axios.get(`http://localhost:3001/admin/subscribe/${username}`).then((response) => {
      if(response.data.status){
        setmessages(mvs => ([...mvs, response.data]))
        // console.log(response.data)
        subscribe()
        // console.log(messages)
        // console.log(...messages)
      }
      else{
        console.log(messages)
      }
    }).catch((err) => {
      console.log(err);
      subscribe();
    })
  }

  const sendmessagefnc = () => {
    Axios.post('http://localhost:3001/admin/sendmessage', {
      id: username,
      otherid: otheruser,
      message: messageinp
    }).then((response) => {
      if(response.data.status){
        setmessages(mvs => ([...mvs, {status: true, from: username, message: messageinp}]))
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  return (
    <div>
        <input name='username' id='username' placeholder='Username' onChange={(e) => { setusername(e.target.value) }} value={username} />
        <input name='otheruser' id='otheruser' placeholder='Other User' onChange={(e) => { setotheruser(e.target.value) }} value={otheruser} />
        <input name='message' id='message' placeholder='Message' onChange={(e) => { setmessageinp(e.target.value) }} value={messageinp} />
        <button onClick={() => {
          subscribe()
        }}>Subscribe</button>
        <button onClick={() => {
          sendmessagefnc()
        }} >Send</button>
        <br />
        <hr />
        <div>
          {messages.map((data, i) => {
            return(
              <div key={i} style={{display: "flex", justifyContent: "left", gap: "10px", maxWidth: "300px", marginLeft: "auto", marginRight: "auto"}}>
                <div style={{width: "100%"}}>
                  <p style={{padding: "2px", float: data.from == username? "right" : "left", backgroundColor: data.from == username? "blue" : "red", color: "white", minHeight: "30px", minWidth: "100px", justifyContent: "center", borderRadius: 5}}>{data.message}</p>
                </div>
              </div>
            )
          })}
        </div>
    </div>
  )
}

export default MainIndexx