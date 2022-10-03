import { createStore, combineReducers } from 'redux';
import { setcompanylist, setcompanyreglist, userAuth } from '../actions';

const combiner = combineReducers({
    authdetails: userAuth,
    companylist: setcompanylist,
    companyreglist: setcompanyreglist
})

const store = createStore(combiner);

export default store;