import { createStore, combineReducers } from 'redux';
import { userAuth } from '../actions';

const combiner = combineReducers({
    authdetails: userAuth
})

const store = createStore(combiner);

export default store;