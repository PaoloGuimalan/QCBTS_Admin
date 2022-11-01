import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import TestIcon from '@material-ui/icons/Home'
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import MainIndex from './components/maincomponents/MainIndex';
import Login from './components/authcomponents/Login';
import Home from './components/maincomponents/Home';
import { useDispatch, useSelector } from 'react-redux';
import { SET_ALERT, SET_AUTH } from './redux/types';
import Axios from 'axios'
import { URL } from './json/urlconfig'
import { motion } from 'framer-motion';

function App() {
  
  const UrlLocation = useLocation();
  const navigate = useNavigate();

  const auth = useSelector(state => state.authdetails);
  const alert = useSelector(state => state.alert);
  const token = localStorage.getItem("token");
  const dispatch = useDispatch();

  useEffect(() => {
    if(token == "" || token == null){
      dispatch({type: SET_AUTH, auth: {
          userID: "",
          fullname: "",
          email: "",
          status: false
      }})
    }
    else{
      verifyAuthToken()
    }
  }, []);

  const verifyAuthToken = () => {
    Axios.get(`${URL}/auth/admin/jwtchecker`, {
      headers:{
        "x-access-token": localStorage.getItem("token")
      }
    }).then((response) => {
      // console.log(response);
      if(response.data.status){
        dispatch({type: SET_AUTH, auth: {
            userID: response.data.result.adminID,
            fullname: `${response.data.result.firstname} ${response.data.result.middlename} ${response.data.result.lastname}`,
            email: response.data.result.email,
            status: true
        }})
      }
      else{
        dispatch({type: SET_AUTH, auth: {
            userID: "",
            fullname: "",
            email: "",
            status: false
        }})
        alertPrompt(false, response.data.result.message)
      }
    }).catch((err) => {
      alertPrompt(false, `Network Error!`)
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
    <div className="App">
      <motion.div
      animate={{
        right: alert.trigger? "10px" : "-270px",
        backgroundColor: alert.status? "green" : "red"
      }}
      transition={{
        duration: 0.5
      }}
      id='alert_div'>
        <p>{alert.message}</p>
      </motion.div>
      <Routes>
        <Route path='/login' element={auth.status == null? null : auth.status? <Navigate to='/home' /> : <Login />} />
        <Route path='/home/*' element={auth.status == null? null : auth.status? <Home /> : <Navigate to='/login' />} />
        <Route path='/' element={auth.status == null? null : auth.status? <Navigate to='/home' /> : <Navigate to='/login' />} />
      </Routes>
    </div>
  );
}

export default App;
