import { createStore, combineReducers } from 'redux';
import { setalert, setcompadmindetails, setcompanydetails, setcompanylist, setcompanyrecord, setcompanyreglist, setmapmode, userAuth } from '../actions';

const combiner = combineReducers({
    authdetails: userAuth,
    companylist: setcompanylist,
    companyreglist: setcompanyreglist,
    alert: setalert,
    companydetails: setcompanydetails,
    companyrecord: setcompanyrecord,
    compadmindetails: setcompadmindetails,
    mapmode: setmapmode
})

const store = createStore(combiner);

export default store;