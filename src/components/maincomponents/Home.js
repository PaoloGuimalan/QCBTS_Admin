import React, { useState, useEffect } from 'react'
import MainIndex from './MainIndex'
import MainIndexx from './MainIndexx'
import '../../styles/maincompstyles/Home.css'
import IconImg from '../../resources/Track.png';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { SET_AUTH } from '../../redux/types';
import { motion } from 'framer-motion'
import SubHome from '../subcomponents/home';
import SubMap from '../subcomponents/mapmanagement'

function Home() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const UrlLocation = useLocation();

  const [pathid, setpathid] = useState("");

  const goToModule = (path) => {
    navigate(path);
    setpathid(path.split("/")[2]);
  }

  const logout = () => {
    localStorage.removeItem("token");
    dispatch({type: SET_AUTH, auth: {
        userID: "",
        fullname: "",
        email: "",
        status: false
    }})
  }

  return (
    <div id='maindivhome'>
        <div id='homemapdiv'>
          <nav id='home_nav'>
            <li className='li_home'>
              <img src={IconImg} id='img_icon_home' />
              <div id='div_navigations'>
                <motion.button animate={{
                  borderWidth: pathid == ""? 1 : 0,
                  backgroundColor: pathid == ""? "#ffbf00" : "transparent"
                }} transition={{
                  delay: 0
                }} onClick={() => { goToModule("/home/") }} className='btn_navigations'>Home</motion.button>
                <motion.button animate={{
                  borderWidth: pathid == "map"? 1 : 0,
                  backgroundColor: pathid == "map"? "#ffbf00" : "transparent"
                }} transition={{
                  delay: 0
                }} onClick={() => { goToModule("/home/map") }} className='btn_navigations'>Map Management</motion.button>
                <motion.button animate={{
                  borderWidth: pathid == "camanagement"? 1 : 0,
                  backgroundColor: pathid == "camanagement"? "#ffbf00" : "transparent"
                }} transition={{
                  delay: 0
                }} onClick={() => { goToModule("/home/camanagement") }} className='btn_navigations'>CA Management</motion.button>
                <motion.button animate={{
                  borderWidth: pathid == "damanagement"? 1 : 0,
                  backgroundColor: pathid == "damanagement"? "#ffbf00" : "transparent"
                }} transition={{
                  delay: 0
                }} onClick={() => { goToModule("/home/damanagement") }} className='btn_navigations'>DA Management</motion.button>
                <button onClick={() => { logout() }} className='btn_logout'>Logout</button>
              </div>
            </li>
            <li className='li_home'>
              <Routes>
                <Route path='/' element={<SubHome />} />
                <Route path='/map' element={<SubMap />} />
              </Routes>
            </li>
          </nav>
        </div>
    </div>
  )
}

export default Home