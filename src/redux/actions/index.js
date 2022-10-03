import { SET_AUTH, SET_COMPANY_LIST, SET_COMPANY_REG_LIST } from "../types";

const userAuthState = {
    userID: "",
    fullname: "",
    email: "",
    status: false
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