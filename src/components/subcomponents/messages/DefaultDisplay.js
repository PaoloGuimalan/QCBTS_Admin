import React from 'react'
import '../../../styles/subcomponents/DefaultDisplay.css'
import NoneIcon from '@material-ui/icons/FilterNone'

function DefaultDisplay() {
  return (
    <div id='div_default_display'>
        <NoneIcon style={{fontSize: "100px", color: "#1D3462"}}/>
        <p id='p_default_label'>Select a Conversation</p>
    </div>
  )
}

export default DefaultDisplay