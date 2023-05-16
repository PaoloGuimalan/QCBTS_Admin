import { SET_ALERT, SET_ASSIGNED_ROUTES, SET_AUTH, SET_BUS_LIST, SET_BUS_STOPS_LIST, SET_BUS_STOP_INFO, SET_CENTER_MAP, SET_CHECKBOX_FILTER, SET_COMPADMIN_DETAILS, SET_COMPANY_DETAILS, SET_COMPANY_LIST, SET_COMPANY_RECORD, SET_COMPANY_REG_LIST, SET_CONVERSATION_DATA, SET_CONVERSATION_LIST, SET_DA_COMPANY_LIST, SET_DA_DRIVER_LIST, SET_DRIVERS_LIST, SET_FOCUS_ON_SELECTED_ROUTE, SET_LIVEMAP_ICON, SET_LIVE_BUST_LIST, SET_MAP_MODE, SET_MAP_OPTIONS, SET_POSTS_LIST, SET_PUBLIC_ROUTE_LIST, SET_ROUTES_SELECTION_LIST, SET_ROUTE_LIST, SET_ROUTE_MAKER_LIST, SET_ROUTE_PATH, SET_ROUTE_STATUS_LOADER, SET_SAVED_ROUTE_PATH, SET_SELECTED_AREA, SET_SELECTED_AREA_INPUT, SET_SELECTED_CONVID, SET_SELECTED_DETAILS, SET_SELECTED_LIVE_BUS, SET_SELECTED_MARKER, SET_SELECTED_TYPE, SET_SELECT_LAYOUT, SET_SYSTEM_ACTIVITIES_LIST, SET_TRIP_SCHEDULES_LIST, SET_USER_GUIDE } from "../types";

const userAuthState = {
    userID: "",
    fullname: "",
    email: "",
    status: null
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
        ltoregno: "",
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

export const setdacompanylist = (state = [], action) => {
    switch(action.type){
        case SET_DA_COMPANY_LIST:
            return action.dacompanylist;
        default:
            return state;
    }
}

export const setdadriverlist = (state = [], action) => {
    switch(action.type){
        case SET_DA_DRIVER_LIST:
            return action.dadriverlist;
        default:
            return state;
    }
}

export const routestatusloaderState = {
    loading: false,
    percent: 0,
}

export const setroutestatusloader = (state = routestatusloaderState, action) => {
    switch(action.type){
        case SET_ROUTE_STATUS_LOADER:
            return action.routestatusloader;
        default:
            return state;
    }
}

export const setroutelist = (state = [], action) => {
    switch(action.type){
        case SET_ROUTE_LIST:
            return action.routelist;
        default:
            return state;
    }
}

export const setpublicroutelist = (state = [], action) => {
    switch(action.type){
        case SET_PUBLIC_ROUTE_LIST:
            return action.publicroutelist;
        default:
            return state;
    }
}

export const savedroutepathState = {
    routeID: null,
    routeName: null,
    stationList: [],
    routePath: [],
    companyID: null,
    status: null
}

export const setsavedroutepath = (state = savedroutepathState, action) => {
    switch(action.type){
        case SET_SAVED_ROUTE_PATH:
            return action.savedroutepath;
        default:
            return state;
    }
}

export const setroutemakerlist = (state = [], action) => {
    switch(action.type){
        case SET_ROUTE_MAKER_LIST:
            return action.routemakerlist;
        default:
            return state;
    }
}

export const setbusstopinfo = (state = null, action) => {
    switch(action.type){
        case SET_BUS_STOP_INFO:
            return action.busstopinfo;
        default:
            return state;
    }
}

export const setroutepath = (state = [], action) => {
    switch(action.type){
        case SET_ROUTE_PATH:
            return action.routepath;
        default:
            return state;
    }
}

export const setpostslist = (state = [], action) => {
    switch(action.type){
        case SET_POSTS_LIST:
            return action.postslist;
        default:
            return state;
    }
}

export const setdriverslist = (state = [], action) => {
    switch(action.type){
        case SET_DRIVERS_LIST:
            return action.driverslist;
        default:
            return state;
    }
}

export const setroutesselectionlist = (state = [], action) => {
    switch(action.type){
        case SET_ROUTES_SELECTION_LIST:
            return action.routesselectionlist;
        default:
            return state;
    }
}

export const setassignedroutes = (state = [], action) => {
    switch(action.type){
        case SET_ASSIGNED_ROUTES:
            return action.assignedroutes;
        default:
            return state;
    }
}

export const setlivebuslist = (state = [], action) => {
    switch(action.type){
        case SET_LIVE_BUST_LIST:
            return action.livebuslist;
        default:
            return state;
    }
}

export const setbuslist = (state = [], action) => {
    switch(action.type){
        case SET_BUS_LIST:
            return action.buslist;
        default:
            return state;
    }
}

export const setselectedlivebus = (state = "", action) => {
    switch(action.type){
        case SET_SELECTED_LIVE_BUS:
            return action.selectedlivebus;
        default:
            return state;
    }
}

export const setsystemactivitieslist = (state = [], action) => {
    switch(action.type){
        case SET_SYSTEM_ACTIVITIES_LIST:
            return action.systemactivitieslist;
        default:
            return state;
    }
}

export const settripscheduleslist = (state = [], action) => {
    switch(action.type){
        case SET_TRIP_SCHEDULES_LIST:
            return action.tripscheduleslist;
        default:
            return state;
    }
}

export const setlivemapicon = (state = false, action) => {
    switch(action.type){
        case SET_LIVEMAP_ICON:
            return action.livemapicon;
        default:
            return state;
    }
}

export const setmapoptions = (state = false, action) => {
    switch(action.type){
        case SET_MAP_OPTIONS:
            return action.mapoptions;
        default:
            return state;
    }
}

export const setselectlayout = (state = 'satellite', action) => {
    switch(action.type){
        case SET_SELECT_LAYOUT:
            return action.selectlayout;
        default:
            return state;
    }
}

export const checkboxfilterstate = {
    activeBuses: true,
    openedStops: true,
    closedStops: true,
    routes: true,
    createroutepreview: true,
    selectedbusroutepreview: true
}

export const setcheckboxfilter = (state = checkboxfilterstate, action) => {
    switch(action.type){
        case SET_CHECKBOX_FILTER:
            return action.checkboxfilter;
        default:
            return state;
    }
}

export const setuserguide = (state = false, action) => {
    switch(action.type){
        case SET_USER_GUIDE:
            return action.userguide;
        default:
            return state;
    }
}

export const setfocusonselectedroute = (state = false, action) => {
    switch(action.type){
        case SET_FOCUS_ON_SELECTED_ROUTE:
            return action.focusonselectedroute;
        default:
            return state;
    }
}