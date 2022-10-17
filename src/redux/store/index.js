import { createStore, combineReducers } from 'redux';
import { setalert, setbusstopslist, setcentermap, setcompadmindetails, setcompanydetails, setcompanylist, setcompanyrecord, setcompanyreglist, setconversationdata, setconversationlist, setmapmode, setselectedarea, setselectedareainput, setselectedconvID, setselecteddetails, setselectedmarker, setselectedtype, userAuth } from '../actions';

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
    selectedtype: setselectedtype
})

const store = createStore(combiner);

export default store;