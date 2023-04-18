import React from 'react'
import './../../styles/authcompstyles/Splash.css'
import IconImg from '../../resources/Track.png';
import LoadingIcon from '@material-ui/icons/Sync'
import { motion } from 'framer-motion';

function Splash() {
  return (
    <div id='div_splash_main'>
        <div>
            <img src={IconImg} id='img_icon' />
            <p id='p_splash_label'>Bus Track</p>
            <p id='p_splash_label_2'>Quezon City Bus Tracking System</p>
            <div id='div_loading_container'>
                <motion.div
                id='div_loadingIcon_rotate' 
                animate={{
                    rotate: -360
                }}
                transition={{
                    duration: 1,
                    repeat: Infinity
                }}
                >
                    <LoadingIcon style={{color: "#e0e0e0", fontSize: "30px"}} />
                </motion.div>
            </div>
        </div>
    </div>
  )
}

export default Splash