import { createStore, combineReducers } from 'redux';
import { setalert, setassignedroutes, setbuslist, setbusstopinfo, setbusstopslist, setcentermap, setcompadmindetails, setcompanydetails, setcompanylist, setcompanyrecord, setcompanyreglist, setconversationdata, setconversationlist, setdacompanylist, setdadriverlist, setdriverslist, setlivebuslist, setmapmode, setpostslist, setpublicroutelist, setroutelist, setroutemakerlist, setroutepath, setroutesselectionlist, setroutestatusloader, setsavedroutepath, setselectedarea, setselectedareainput, setselectedconvID, setselecteddetails, setselectedmarker, setselectedtype, userAuth } from '../actions';

const combiner = combineReducers({
    authdetails: userAuth,
    companylist: setcompanylist,
    companyreglist: setcompanyreglist,
    alert: setalert,
    companydetails: setcompanydetails,
    companyrecord: setcompanyrecord,
    compadmindetails: setcompadmindetails,
    mapmode: setmapmode,
    selectedarea: setselectedarea,
    selectedareainput: setselectedareainput,
    busstopslist: setbusstopslist,
    centermap: setcentermap,
    selectedmarker: setselectedmarker,
    selecteddetails: setselecteddetails,
    conversationlist: setconversationlist,
    conversationdata: setconversationdata,
    selectedconvID: setselectedconvID,
    selectedtype: setselectedtype,
    dacompanylist: setdacompanylist,
    dadriverlist: setdadriverlist,
    routestatusloader: setroutestatusloader,
    routelist: setroutelist,
    publicroutelist: setpublicroutelist,
    routemakerlist: setroutemakerlist,
    savedroutepath: setsavedroutepath,
    busstopinfo: setbusstopinfo,
    routepath: setroutepath,
    postslist: setpostslist,
    driverslist: setdriverslist,
    routesselectionlist: setroutesselectionlist,
    assignedroutes: setassignedroutes,
    livebuslist: setlivebuslist,
    buslist: setbuslist
})

const store = createStore(combiner);

export default store;