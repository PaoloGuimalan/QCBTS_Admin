import { createStore, combineReducers } from 'redux';
import { setalert, setcompanydetails, setcompanylist, setcompanyrecord, setcompanyreglist, userAuth } from '../actions';

const combiner = combineReducers({
    authdetails: userAuth,
    companylist: setcompanylist,
    companyreglist: setcompanyreglist,
    alert: setalert,
    companydetails: setcompanydetails,
    companyrecord: setcompanyrecord
})

const store = createStore(combiner);

export default store;