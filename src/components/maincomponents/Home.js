import React, { useState, useEffect } from 'react'
import MainIndex from './MainIndex'
import MainIndexx from './MainIndexx'
import '../../styles/maincompstyles/Home.css'
import IconImg from '../../resources/Track.png';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { SET_AUTH } from '../../redux/types';
import { motion } from 'framer-motion'
import SubHome from '../subcomponents/home/Index';
import SubMap from '../subcomponents/mapmanagement/Index'
import SubCAManagement from '../subcomponents/caManagement/Index'
import AddCompany from '../subcomponents/caManagement/AddCompany';
import CompDetails from '../subcomponents/caManagement/CompDetails';
import CompAdDetails from '../subcomponents/caManagement/CompAdDetails';
import Messages from '../subcomponents/messages/Messages';

function Home() {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const UrlLocation = useLocation();

  const [pathid, setpathid] = useState("");

  useEffect(() => {
    // console.log(UrlLocation.pathname.split("/")[2]);
    setpathid(UrlLocation.pathname.split("/")[2] == undefined? "" : UrlLocation.pathname.split("/")[2])
  }, [UrlLocation]);

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
                  borderWidth: pathid == ""? 0 : 0,
                  backgroundColor: pathid == ""? "#ffbf00" : "transparent",
                  color: pathid == ""? "#2b4273" : "white",
                  textAlign: pathid == ""? "center" : "left",
                  fontWeight: pathid == ""? "bold" : "normal",
                  boxShadow: pathid == ""? "0px 0px 5px black" : "0px 0px 0px black"
                }} transition={{
                  delay: 0,
                  duration: 0
                }} whileHover={{
                  boxShadow: "0px 0px 5px black",
                  transition:{
                    delay: 0,
                    duration: 0
                  }
                }} onClick={() => { goToModule("/home/") }} className='btn_navigations'>Home</motion.button>
                <motion.button animate={{
                  borderWidth: pathid == "messages"? 0 : 0,
                  backgroundColor: pathid == "messages"? "#ffbf00" : "transparent",
                  color: pathid == "messages"? "#2b4273" : "white",
                  textAlign: pathid == "messages"? "center" : "left",
                  fontWeight: pathid == "messages"? "bold" : "normal",
                  boxShadow: pathid == "messages"? "0px 0px 5px black" : "0px 0px 0px black"
                }} transition={{
                  delay: 0,
                  duration: 0
                }} whileHover={{
                  boxShadow: "0px 0px 5px black",
                  transition:{
                    delay: 0,
                    duration: 0
                  }
                }} onClick={() => { goToModule("/home/messages/") }} className='btn_navigations'>Messages</motion.button>
                <motion.button animate={{
                  borderWidth: pathid == "map"? 0 : 0,
                  backgroundColor: pathid == "map"? "#ffbf00" : "transparent",
                  color: pathid == "map"? "#2b4273" : "white",
                  textAlign: pathid == "map"? "center" : "left",
                  fontWeight: pathid == "map"? "bold" : "normal",
                  boxShadow: pathid == "map"? "0px 0px 5px black" : "0px 0px 0px black"
                }} transition={{
                  delay: 0,
                  duration: 0
                }} whileHover={{
                  boxShadow: "0px 0px 5px black",
                  transition:{
                    delay: 0,
                    duration: 0
                  }
                }} onClick={() => { goToModule("/home/map") }} className='btn_navigations'>Map Management</motion.button>
                <motion.button animate={{
                  borderWidth: pathid == "camanagement"? 0 : 0,
                  backgroundColor: pathid == "camanagement"? "#ffbf00" : "transparent",
                  color: pathid == "camanagement"? "#2b4273" : "white",
                  textAlign: pathid == "camanagement"? "center" : "left",
                  fontWeight: pathid == "camanagement"? "bold" : "normal",
                  boxShadow: pathid == "camanagement"? "0px 0px 5px black" : "0px 0px 0px black"
                }} transition={{
                  delay: 0,
                  duration: 0
                }} whileHover={{
                  boxShadow: "0px 0px 5px black",
                  transition:{
                    delay: 0,
                    duration: 0
                  }
                }} onClick={() => { goToModule("/home/camanagement") }} className='btn_navigations'>CA Management</motion.button>
                <motion.button animate={{
                  borderWidth: pathid == "damanagement"? 0 : 0,
                  backgroundColor: pathid == "damanagement"? "#ffbf00" : "transparent",
                  color: pathid == "damanagement"? "#2b4273" : "white",
                  textAlign: pathid == "damanagement"? "center" : "left",
                  fontWeight: pathid == "damanagement"? "bold" : "normal",
                  boxShadow: pathid == "damanagement"? "0px 0px 5px black" : "0px 0px 0px black"
                }} transition={{
                  delay: 0,
                  duration: 0
                }} whileHover={{
                  boxShadow: "0px 0px 5px black",
                  transition:{
                    delay: 0,
                    duration: 0
                  }
                }} onClick={() => { goToModule("/home/damanagement") }} className='btn_navigations'>DA Management</motion.button>
                <button onClick={() => { logout() }} className='btn_logout'>Logout</button>
              </div>
            </li>
            <li className='li_home'>
              <Routes>
                <Route path='/' element={<SubHome />} />
                <Route path='/map' element={<SubMap />} />
                <Route path='/camanagement' element={<SubCAManagement />} />
                <Route path='/camanagement/addcompany' element={<AddCompany />} />
                <Route path='/camanagement/companyDetails/:companyID' element={<CompDetails />} />
                <Route path='/camanagement/companyAdminDetails/:companyAdID' element={<CompAdDetails />} />
                <Route path='/messages/*' element={<Messages />} />
              </Routes>
            </li>
          </nav>
        </div>
    </div>
  )
}

export default Home