import React, { useState, useEffect } from 'react'
import '../../../styles/subcomponents/AddCompany.css'
import BackIcon from '@material-ui/icons/KeyboardArrowLeft'
import { useNavigate } from 'react-router-dom'
import DefaultIconComp from '../../../resources/defaultcompany.png'
import Axios from 'axios'
import { URL } from '../../../json/urlconfig'
import { useDispatch, useSelector } from 'react-redux'
import { SET_ALERT, SET_COMPANY_DETAILS, SET_COMPANY_REG_LIST } from '../../../redux/types'
import { companydetailsState } from '../../../redux/actions'
import { motion } from 'framer-motion';

function AddCompany() {

  const companyreglist = useSelector(state => state.companyreglist);
  const companydetails = useSelector(state => state.companydetails);
  const navigate = useNavigate();
  const dispatch = useDispatch()

  const [companyNameAC, setcompanyNameAC] = useState("");
  const [companyNumberAC, setcompanyNumberAC] = useState("");
  const [companyEmailAC, setcompanyEmailAC] = useState("");
  const [companyAddressAC, setcompanyAddressAC] = useState("");
  const [LTOregistrationNumber, setLTOregistrationNumber] = useState("")
  const [previewAC, setpreviewAC] = useState("none");

  const [companyIDACA, setcompanyIDACA] = useState(null);
  const [companyNameACA, setcompanyNameACA] = useState(null);
  const [companyEmailACA, setcompanyEmailACA] = useState("");
  const [password, setpassword] = useState("");
  const [firstname, setfirstname] = useState("");
  const [lastname, setlastname] = useState("");

  const [formswitch, setformswitch] = useState(true);

  useEffect(() => {
    fetchCompanyRegList()
  }, [])

  useEffect(() => {
    clearFields();
  }, [formswitch]);

  const clearFields = () => {
      //Add Company
      setcompanyNameAC("")
      setcompanyNumberAC("")
      setcompanyEmailAC("")
      setcompanyAddressAC("")
      setpreviewAC("none")
      //Add Admin
      setcompanyIDACA(null);
      setcompanyNameACA(null);
      setfirstname("");
      setlastname("");
      setcompanyEmailACA("");
      setpassword("");
      dispatch({ type: SET_COMPANY_DETAILS, companydetails: companydetailsState })
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

  const fetchCompanyRegList = () => {
    Axios.get(`${URL}/admin/companyreglist`, {
      headers:{
        "x-access-token": localStorage.getItem("token")
      }
    }).then((response) => {
      if(response.data.status){
        dispatch({ type: SET_COMPANY_REG_LIST, companyreglist: response.data.result })
      }
    }).catch((err) => {
      console.log(err);
    })
  }

  //MAKE DATA VALIDATION BEFORE SENDING TO SERVER

  const saveCompanyDetails = () => {
    if(companyNameAC == " " || companyNumberAC == " " || 
      companyEmailAC == " " || companyAddressAC == " " || 
      companyNameAC == "" || companyNumberAC == "" || 
      companyEmailAC == "" || companyAddressAC == "" || LTOregistrationNumber == ""){
      alertPrompt(false, `Please complete all fields`)
    }
    else{
      Axios.post(`${URL}/admin/createcompanyreg`, {
          companyName: companyNameAC,
          companyAddress: companyAddressAC,
          companyNumber: companyNumberAC,
          companyEmail: companyEmailAC,
          ltoregno: LTOregistrationNumber,
          preview: previewAC
      },{
        headers:{
          "x-access-token": localStorage.getItem("token")
        }
      }).then((response) => {
        if(response.data.status){
          setcompanyNameAC("")
          setcompanyNumberAC("")
          setcompanyEmailAC("")
          setcompanyAddressAC("")
          setLTOregistrationNumber("")
          setpreviewAC("none")
          fetchCompanyRegList()
          alertPrompt(true, `New Company/Operator has been Added`)
        }
        else{
          alertPrompt(false, `Cannot process New Company`)
        }
      }).catch((err) => {
        alertPrompt(false, `New Company Request failed`)
        console.log(err);
      })
    }
  }

  const saveCompanyAdmin = () => {
    if(companyIDACA == null || companyNameACA == null || companyEmailACA == " " || password == " " || 
    firstname == " " || lastname == " " || companyIDACA == "" || companyNameACA == "" || 
    companyEmailACA == "" || password == "" || firstname == "" || lastname == ""){
      alertPrompt(false, `Please complete all fields`)
    }
    else{
      Axios.post(`${URL}/admin/createcompanyadmin`, {
        companyID: companyIDACA,
        companyName: companyNameACA,
        firstname: firstname,
        lastname: lastname,
        email: companyEmailACA,
        password: password
      }, {
        headers:{
          "x-access-token": localStorage.getItem("token")
        }
      }).then((response) => {
        if(response.data.status){
          setcompanyIDACA(null);
          setcompanyNameACA(null);
          setfirstname("");
          setlastname("");
          setcompanyEmailACA("");
          setpassword("");
          alertPrompt(true, `New Admin has been Added`)
          dispatch({ type: SET_COMPANY_DETAILS, companydetails: companydetailsState })
        }
        else{
          alertPrompt(false, `New Admin failed to process`)
        }
      }).catch((err) => {
        alertPrompt(false, `New Admin Request failed`)
        console.log(err)
      })
    }
  }

  const fetchCompanyDetails = (compID) => {
    if(compID != null && compID != ""){
      Axios.get(`${URL}/admin/companydetails/${compID}`, {
        headers:{
          "x-access-token": localStorage.getItem("token")
        }
      }).then((response) => {
        if(response.data.status){
          // console.log(response.data.result)
          dispatch({ type: SET_COMPANY_DETAILS, companydetails: response.data.result })
        }
        else{
          alertPrompt(false, `Request Error!`)
        }
      }).catch((err) => {
        console.log(err);
        alertPrompt(false, `Unable to Fetch Request!`)
      })
    }
    else{
      dispatch({ type: SET_COMPANY_DETAILS, companydetails: companydetailsState })
    }
  }

  return (
    <div id='div_addcompany'>
      <nav id='nav_addcompany'>
        <li>
          <div id='div_addcompany_navigations'>
            <button id='btn_backicon' onClick={() => { navigate(-1) }} ><BackIcon style={{ fontSize: "35px", color: "white" }} /></button>
            <p id='label_addcompany'>Add / Register Details | {formswitch? "Add Company" : "Add Company Admin"}</p>
          </div>
        </li>
        <li>
          {formswitch? (
            <nav id='div_addcompany_details'>
              <li>
                <div id='div_img_holder'>
                  <img src={DefaultIconComp} id='default_company_img' />
                  <button id='btn_upload_img'>Upload</button>
                </div>
              </li>
              <li>
                <nav id='nav_company_inputs'>
                  <li>
                    <div id='company_name_holder'>
                      <p id='company_name_input_label'>Company Name</p>
                      <input type='text' onChange={(e) => { setcompanyNameAC(e.target.value) }} value={companyNameAC} id='companyNameInput' name='companyNameInput' placeholder="Company Name" />
                      <p className='subdetails_label'>LTO Registration No.</p>
                      <input type='text' id='companyEmailInput' onChange={(e) => { setLTOregistrationNumber(e.target.value) }} value={LTOregistrationNumber} name='companyEmailInput' placeholder="LTO Registration Number" />
                    </div>
                  </li>
                  <li>
                    <nav id='company_subdetails_nav'>
                      <li className='li_subdetails'>
                        <div id='div_subdetails'>
                          <p className='subdetails_label'>Company Number</p>
                          <input type='text' id='companyNumberInput' onChange={(e) => { setcompanyNumberAC(e.target.value) }} value={companyNumberAC} className='subdetailsinput' name='companyNumberInput' placeholder="Company Number" />
                          <p className='subdetails_label'>Address</p>
                          <textarea placeholder='Input Company Address here' onChange={(e) => { setcompanyAddressAC(e.target.value) }} value={companyAddressAC} id='address_textarea'></textarea>
                        </div>
                      </li>
                      <li className='li_subdetails'>
                        <div id='div_subdetails'>
                          <p className='subdetails_label'>Company Email</p>
                          <input type='text' id='companyEmailInput' onChange={(e) => { setcompanyEmailAC(e.target.value) }} value={companyEmailAC} name='companyEmailInput' placeholder="Company Email" />
                        </div>
                      </li>
                    </nav>
                  </li>
                  <li>
                    <div id='div_savebtn_holder'>
                      {/* <button id='btn_fmswitch_company' onClick={() => { setformswitch(false) }}>Add a Company Admin</button> */}
                      <button id='btn_save_company' onClick={() => { saveCompanyDetails() }}>Save Company</button>
                    </div>
                  </li>
                </nav>
              </li>
            </nav>
          ) : (
            <nav id='div_addcompany_details'>
              <li>
                  <motion.div
                  animate={{
                    minHeight: companydetails.companyID == ""? "0px" : "150px",
                    transition:{
                      delay: companydetails.companyID == ""? 1 : 0
                    }
                  }}
                  id='div_selected_company_preview'>
                    <motion.img
                    animate={{
                      width: companydetails.companyID == ""? "0%" : "100%",
                      height: companydetails.companyID == ""? "0%" : "100%",
                      transition:{
                        delay: companydetails.companyID == ""? 0 : 0.5,
                        duration: 1
                      }
                    }} 
                    src={companydetails.preview == "" || "none"? DefaultIconComp : companydetails.preview} id='selected_company_img' />
                    <div id='div_selected_company_data_holder'>
                      <p id='p_selected_company_companyName'>{companydetails.companyName}</p>
                      <p id='p_selected_company_companyAddress'>{companydetails.companyAddress}</p>
                    </div>
                  </motion.div>
              </li>
              <li>
                <nav id='nav_company_inputs'>
                  <li>
                    <div id='company_name_holder'>
                      <p id='company_name_input_label'>Select a Company</p>
                      <select type='text' onChange={(e) => { setcompanyNameACA(e.target.value.split(",")[0]); setcompanyIDACA(e.target.value.split(",")[1]); fetchCompanyDetails(e.target.value.split(",")[1]) }} value={[companyNameACA, companyIDACA]} id='companyNameInput' name='companyNameInput'>
                        <option value={[null, null]}>----Select a Company/Operator----</option>
                        {companyreglist.map((data, i) => {
                          return(
                            <option key={i} value={[data.companyName, data.companyID]}>{data.companyName}</option>
                          )
                        })}
                      </select>
                    </div>
                  </li>
                  <li>
                    <nav id='company_subdetails_nav'>
                      <li className='li_subdetails'>
                        <div id='div_subdetails'>
                          <p className='subdetails_label'>First Name</p>
                          <input type='text' id='companyNumberInput' onChange={(e) => { setfirstname(e.target.value) }} value={firstname} className='subdetailsinput' name='companyNumberInput' placeholder="ex: John" />
                          <p className='subdetails_label'>Email</p>
                          <input type='text' id='companyNumberInput' onChange={(e) => { setcompanyEmailACA(e.target.value) }} value={companyEmailACA} className='subdetailsinput' name='companyNumberInput' placeholder="ex: moore@gmail.com" />
                        </div>
                      </li>
                      <li className='li_subdetails'>
                        <div id='div_subdetails'>
                          <p className='subdetails_label'>Last Name</p>
                          <input type='text' id='companyEmailInput' onChange={(e) => { setlastname(e.target.value) }} value={lastname} name='companyEmailInput' placeholder="ex: Moore" />
                          <p className='subdetails_label'>Password</p>
                          <input type='text' id='companyEmailInput' onChange={(e) => { setpassword(e.target.value) }} value={password} name='companyEmailInput' placeholder="Admin Password" />
                        </div>
                      </li>
                    </nav>
                  </li>
                  <li>
                    <div id='div_savebtn_holder'>
                      <button id='btn_fmswitch_company' onClick={() => { setformswitch(true) }}>Register a Company</button>
                      <button id='btn_save_company' onClick={() => { saveCompanyAdmin() }}>Save Admin</button>
                    </div>
                  </li>
                </nav>
              </li>
            </nav>
          )}
        </li>
      </nav>
    </div>
  )
}

export default AddCompany