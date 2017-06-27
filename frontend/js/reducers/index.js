import { combineReducers } from 'redux'


import {
    SET_TOKEN_FILTER,
    SET_MESSAGE_TOKEN_FILTER,
    SET_MESSAGE_USER_FILTER,
    SET_MESSAGE_OFFSET,
    SET_NUM_MESSAGE_CONTEXT,
    SET_USER_OFFSET,
    SET_TOKEN_OFFSET
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
    //console.log(action);
    switch (action.type) {
        case SET_MESSAGE_USER_FILTER:
            return action.value
        default:
            return state
    }
};

const messageOffset = (state = 0, action) => {
    switch (action.type) {
        case SET_MESSAGE_OFFSET:
            return action.value
        default:
            return state
    }
};

const numMessageContext = (state = 3, action) => {
    switch (action.type) {
        case SET_NUM_MESSAGE_CONTEXT:
            return action.value
        default:
            return state
    }
};

const userOffset = (state = 0, action) => {
    switch (action.type) {
        case SET_USER_OFFSET:
            return action.value
        default:
            return state
    }
};

const tokenOffset = (state = 0, action) => {
    switch (action.type) {
        case SET_TOKEN_OFFSET:
            return action.value
        default:
            return state
    }
};

const appReducer = combineReducers({
    tokenFilter,
    messageTokenFilter,
    messageUserFilter,
    messageOffset,
    numMessageContext,
    userOffset,
    tokenOffset
});

export default appReducer