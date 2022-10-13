import React, { useState, useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import Axios from 'axios';
import { URL } from '../../../json/urlconfig'
import { motion } from 'framer-motion'
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import '../../../styles/subcomponents/Conversation.css'

function Conversation() {
  return (
    <div id='div_conversation_indv_main'>
        <div id='div_conversation_header'>
            <p>Name</p>
        </div>
        <div id='div_messages_series'>
            <h1>Hello Hi1</h1>
            <h1>Hello Hi</h1>
            <h1>Hello Hi</h1>
            <h1>Hello Hi</h1>
            <h1>Hello Hi</h1>
            <h1>Hello Hi</h1>
            <h1>Hello Hi</h1>
            <h1>Hello Hi</h1>
            <h1>Hello Hi</h1>
            <h1>Hello Hi2</h1>
        </div>
        <div id='div_messages_actions'>
            <p>Actions</p>
        </div>
    </div>
  )
}

export default Conversation