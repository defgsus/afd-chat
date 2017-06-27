import { combineReducers } from 'redux'


import {
    SET_TOKEN_FILTER,
    SET_MESSAGE_TOKEN_FILTER,
    SET_MESSAGE_USER_FILTER
 } from '../actions'


const tokenFilter = (state = '', action) => {
    switch (action.type) {
        case SET_TOKEN_FILTER:
            return action.value
        default:
            return state
    }
};

const messageTokenFilter = (state = 0, action) => {
    switch (action.type) {
        case SET_MESSAGE_TOKEN_FILTER:
            return action.value
        default:
            return state
    }
};

const messageUserFilter = (state = '', action) => {
    console.log(action);
    switch (action.type) {
        case SET_MESSAGE_USER_FILTER:
            return action.value
        default:
            return state
    }
};

const appReducer = combineReducers({
    tokenFilter,
    messageTokenFilter,
    messageUserFilter
});

export default appReducer