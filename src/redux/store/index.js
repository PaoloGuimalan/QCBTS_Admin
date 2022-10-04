import { createStore, combineReducers } from 'redux';
import { setalert, setcompanylist, setcompanyreglist, userAuth } from '../actions';

const combiner = combineReducers({
    authdetails: userAuth,
    companylist: setcompanylist,
    companyreglist: setcompanyreglist,
    alert: setalert
})

const store = createStore(combiner);

export default store;