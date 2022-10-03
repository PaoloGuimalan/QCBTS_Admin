import { createStore, combineReducers } from 'redux';
import { setcompanylist, userAuth } from '../actions';

const combiner = combineReducers({
    authdetails: userAuth,
    companylist: setcompanylist
})

const store = createStore(combiner);

export default store;