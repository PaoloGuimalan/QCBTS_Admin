import React from 'react'
import '../../../styles/subcomponents/DriverDetails.css'
import { useParams } from 'react-router-dom'

function DriverDetails() {

  const params = useParams()
  const driverID = params["driverID"]

  return (
    <div id='div_driver_details'>DriverDetails: {driverID}</div>
  )
}

export default DriverDetails