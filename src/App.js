import React, { useState, useEffect } from 'react';
import logo from './logo.svg';
import './App.css';
import TestIcon from '@material-ui/icons/Home'
import { Routes, Route, useLocation, useNavigate, Navigate } from 'react-router-dom';
import MainIndex from './components/maincomponents/MainIndex';
import Login from './components/authcomponents/Login';
import Home from './components/maincomponents/Home';
import { useDispatch, useSelector } from 'react-redux';
import { SET_AUTH } from './redux/types';
import Axios from 'axios'
import { URL } from './json/urlconfig'

function App() {
  
  const UrlLocation = useLocation();
  const navigate = useNavigate();

  const auth = useSelector(state => state.authdetails);
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
    }).catch((err) => {
      console.log(err);
    })
  }

  return (
    <div className="App">
      <Routes>
        <Route path='/login' element={auth.status? <Navigate to='/home' /> : <Login />} />
        <Route path='/home/*' element={auth.status? <Home /> : <Navigate to='/login' />} />
        <Route path='/' element={auth.status? <Navigate to='/home' /> : <Navigate to='/login' />} />
      </Routes>
    </div>
  );
}

export default App;
