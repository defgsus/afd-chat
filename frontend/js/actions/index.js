

export const SET_TOKEN_FILTER = "SET_TOKEN_FILTER";
export const SET_MESSAGE_TOKEN_FILTER = "SET_MESSAGE_TOKEN_FILTER";
export const SET_MESSAGE_USER_FILTER = "SET_MESSAGE_USER_FILTER";
export const SET_MESSAGE_OFFSET = "SET_MESSAGE_OFFSET";
export const SET_NUM_MESSAGE_CONTEXT = "SET_NUM_MESSAGE_CONTEXT";


export const setTokenFilter = (value) => ({
    type: SET_TOKEN_FILTER,
    value: value
});

export const setMessageTokenFilter = (value) => ({
    type: SET_MESSAGE_TOKEN_FILTER,
    value: value
});

export const setMessageUserFilter = (value) => ({
    type: SET_MESSAGE_USER_FILTER,
    value: value
});

export const setMessageOffset = (value) => ({
    type: SET_MESSAGE_OFFSET,
    value: value
});

export const setNumMessageContext = (value) => ({
    type: SET_NUM_MESSAGE_CONTEXT,
    value: value
});
