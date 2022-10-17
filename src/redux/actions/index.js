import { SET_ALERT, SET_AUTH, SET_BUS_STOPS_LIST, SET_CENTER_MAP, SET_COMPADMIN_DETAILS, SET_COMPANY_DETAILS, SET_COMPANY_LIST, SET_COMPANY_RECORD, SET_COMPANY_REG_LIST, SET_CONVERSATION_DATA, SET_CONVERSATION_LIST, SET_MAP_MODE, SET_SELECTED_AREA, SET_SELECTED_AREA_INPUT, SET_SELECTED_CONVID, SET_SELECTED_DETAILS, SET_SELECTED_MARKER, SET_SELECTED_TYPE } from "../types";

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

export const selectedAreaState = {
    status: false,
    data: {
        fullAddress: "",
        coordinates: {
            lat: "",
            lng: ""
        }
    }
}

export const setselectedarea = (state = selectedAreaState, action) => {
    switch(action.type){
        case SET_SELECTED_AREA:
            return action.selectedarea;
        default:
            return state;
    }
}

export const selectedAreaInputState = {
    longitude: "",
    latitude: "",
    stationName: "",
    stationAddress: "",
}

export const setselectedareainput = (state = selectedAreaInputState, action) => {
    switch(action.type){
        case SET_SELECTED_AREA_INPUT:
            return action.selectedareainput;
        default:
            return state;
    }
}

export const setbusstopslist = (state = [], action) => {
    switch(action.type){
        case SET_BUS_STOPS_LIST:
            return action.busstopslist;
        default:
            return state;
    }
}

export const setcentermap = (state = { lat: 14.647296, lng: 121.061376 }, action) => {
    switch(action.type){
        case SET_CENTER_MAP:
            return action.centermap;
        default:
            return state;
    }
}

export const setselectedmarker = (state = null, action) => {
    switch(action.type){
        case SET_SELECTED_MARKER:
            return action.selectedmarker;
        default:
            return state;
    }
}

export const selectedDetailsState = {
    status: false,
    busStopID: "",
    data: {
        stationName: "",
        stationAddress: "",
        coordinates: {
            longitude: "",
            latitude: ""
        },
        dateAdded: "",
        addedBy: "",
        status: false
    }
}

export const setselecteddetails = (state = selectedDetailsState, action) => {
    switch(action.type){
        case SET_SELECTED_DETAILS:
            return action.selecteddetails;
        default:
            return state;
    }
}

export const conversationListState = {
    profiles: [],
    conversations: []
}

export const setconversationlist = (state = conversationListState, action) => {
    switch(action.type){
        case SET_CONVERSATION_LIST:
            return action.conversationlist;
        default:
            return state;
    }
}

export const conversationDataState = {
    userDetails: {
        preview: "none",
        userDisplayName: "",
        userID: "",
        userType: "",
    },
    conversation: []
}

export const setconversationdata = (state = conversationDataState, action) => {
    switch(action.type){
        case SET_CONVERSATION_DATA:
            return action.conversationdata;
        default:
            return state;
    }
}

export const setselectedconvID = (state = "", action) => {
    switch(action.type){
        case SET_SELECTED_CONVID:
            return action.selectedconvID;
        default:
            return state;
    }
}

export const setselectedtype = (state = "commuters", action) => {
    switch(action.type){
        case SET_SELECTED_TYPE:
            return action.selectedtype;
        default:
            return state;
    }
}