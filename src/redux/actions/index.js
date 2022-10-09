import { SET_ALERT, SET_AUTH, SET_COMPADMIN_DETAILS, SET_COMPANY_DETAILS, SET_COMPANY_LIST, SET_COMPANY_RECORD, SET_COMPANY_REG_LIST, SET_MAP_MODE } from "../types";

const userAuthState = {
    userID: "",
    fullname: "",
    email: "",
    status: false
}

export const userAuth = (state = userAuthState, action) => {
    switch(action.type){
        case SET_AUTH:
            return action.auth;
        default:
            return state;
    }
}

export const setcompanylist = (state = [], action) => {
    switch(action.type){
        case SET_COMPANY_LIST:
            return action.companylist;
        default:
            return state;
    }
}

export const setcompanyreglist = (state = [], action) => {
    switch(action.type){
        case SET_COMPANY_REG_LIST:
            return action.companyreglist;
        default:
            return state;
    }
}

const alertState = {
    trigger: false,
    status: false,
    message: "..."
}

export const setalert = (state = alertState, action) => {
    switch(action.type){
        case SET_ALERT:
            return action.alert;
        default:
            return state;
    }
}

export const companydetailsState = {
    "companyID": "",
    "companyName": "",
    "companyAddress": "",
    "companyNumber": "",
    "email": "",
    "dateRegistered": "",
    "preview": ""
}

export const setcompanydetails = (state = companydetailsState, action) => {
    switch(action.type){
        case SET_COMPANY_DETAILS:
            return action.companydetails;
        default:
            return state;
    }
}

export const companyRecordState = {
    adminlist: [],
    companydata: {
        companyAddress: "",
        companyID: "",
        companyName: "",
        companyNumber: "",
        dateRegistered: "",
        email: "",
        preview: "none"
    }
}

export const setcompanyrecord = (state = companyRecordState, action) => {
    switch(action.type){
        case SET_COMPANY_RECORD:
            return action.companyrecord;
        default:
            return state;
    }
}

export const compAdminDetailsState = {
    compAdDetails: {
        companyAdmin: { firstname: '', lastname: '' }, 
        companyID: '',
        companyAdminID: '',
        companyName: '',
        status: null,
        dateRegistered: '',
        email: ''
      }
}

export const setcompadmindetails = (state = compAdminDetailsState, action) => {
    switch(action.type){
        case SET_COMPADMIN_DETAILS:
            return action.compadmindetails;
        default:
            return state;
    }
}

export const setmapmode = (state = "none", action) => {
    switch(action.type){
        case SET_MAP_MODE:
            return action.mapmode;
        default:
            return state;
    }
}