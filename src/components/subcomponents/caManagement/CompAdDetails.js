import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import '../../../styles/subcomponents/CompAdDetails.css'
import BackIcon from '@material-ui/icons/KeyboardArrowLeft'

function CompAdDetails() {

  const params = useParams()
  const navigate = useNavigate()

  const companyAdID = params["companyAdID"];

  return (
    <div id='div_addcompany'>
      <nav id='nav_addcompany'>
        <li>
          <div id='div_addcompany_navigations'>
            <button id='btn_backicon' onClick={() => { navigate("/home/camanagement") }} ><BackIcon style={{ fontSize: "35px", color: "white" }} /></button>
            <p id='label_addcompany'>Company Admin Details</p>
          </div>
        </li>
        <li>
          <nav id='nav_details_page'>
            <li>
              <p>{companyAdID}</p>
            </li>
            <li>
              <p>Hello</p>
            </li>
          </nav>
        </li>
      </nav>
    </div>
  )
}

export default CompAdDetails