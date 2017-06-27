import { combineReducers } from 'redux'


import { SET_TOKEN_FILTER } from '../actions'


const tokenFilter = (state = '', action) => {
    switch (action.type) {
        case SET_TOKEN_FILTER:
            return action.value
    default:
        return state
    }
};


const appReducer = combineReducers({
    tokenFilter,
});

export default appReducer