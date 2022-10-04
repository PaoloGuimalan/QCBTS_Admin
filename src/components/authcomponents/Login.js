import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import '../../styles/authcompstyles/Login.css';
import IconImg from '../../resources/Track.png';
import { useDispatch, useSelector } from 'react-redux';
import { SET_ALERT, SET_AUTH } from '../../redux/types';
import { URL } from '../../json/urlconfig'
import Axios from 'axios'

function Login() {

  const navigate = useNavigate()
  
  const auth = useSelector(state => state.authdetails);
  const dispatch = useDispatch();

  const [adminID, setadminID] = useState("");
  const [password, setpassword] = useState("");

  const loginverifier = () => {
    // navigate("/home")
    Axios.post(`${URL}/auth/loginadmin`, {
        adminID: adminID,
        password: password
    }).then((response) => {
        // console.log(response.data)
        if(response.data.status){
            localStorage.setItem("token", response.data.result.token)
            dispatch({type: SET_AUTH, auth: {
                userID: response.data.result.adminID,
                fullname: `${response.data.result.firstname} ${response.data.result.middlename} ${response.data.result.lastname}`,
                email: response.data.result.email,
                status: true
            }})
            alertPrompt(true, "You have been Logged In!");
        }
        else{
            alertPrompt(false, "No Account Matched!");
        }
    }).catch((err) => {
        alertPrompt(false, "Unable to connect to server!");
        console.log(err);
    })
  }

  const alertPrompt = (statusPrompt, messagePrompt) => {
    dispatch({ type: SET_ALERT, alert: {
        trigger: true,
        status: statusPrompt,
        message: messagePrompt
    } })
    setTimeout(() => {
        dispatch({ type: SET_ALERT, alert: {
            trigger: false,
            status: statusPrompt,
            message: messagePrompt
        } })
    }, 3000)
    setTimeout(() => {
        dispatch({ type: SET_ALERT, alert: {
            trigger: false,
            status: false,
            message: "..."
        } })
    }, 4000)
  }

  return (
    <div id='divmain_login'>
        <nav id='navlogin'>
            <li className='li_login'>
                <img src={IconImg} id='img_icon' />
                <p id='login_label'>Admin</p>
                <input type='text' value={adminID} onChange={(e) => { setadminID(e.target.value) }} id='adminID' name='adminID' placeholder='Admin ID' className='login_input' />
                <input type='password' value={password} onChange={(e) => { setpassword(e.target.value) }} id='password' name='password' placeholder='Password' className='login_input' />
                <button id='btn_login' onClick={() => { loginverifier() }}>Sign In</button>
            </li>
            <li className='li_login'>
                <p id='label_title'>BUS TRACK</p>
                <p id='label_desctitle'>Quezon City Bus Tracking System</p>
            </li>
        </nav>
    </div>
  )
}

export default Login