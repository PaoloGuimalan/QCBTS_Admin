import { createStore, combineReducers } from 'redux';
import { setalert, setbusstopslist, setcentermap, setcompadmindetails, setcompanydetails, setcompanylist, setcompanyrecord, setcompanyreglist, setmapmode, setselectedarea, setselectedareainput, setselectedmarker, userAuth } from '../actions';

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
    selectedmarker: setselectedmarker
})

const store = createStore(combiner);

export default store;