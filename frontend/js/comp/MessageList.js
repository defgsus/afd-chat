import React from 'react'
import PropTypes from 'prop-types'
import Message from './Message'
import { messagePropTypes } from './Message'

import { setNumMessageContext, setMessageOffset } from '../actions'

import { chat_messages } from '../chat-messages'


const MessageList = ({
    messages, onMessageClick, onNumContextChange, onOffsetChange, tokenFilter, userFilter,
    highlights, numMessageContext, offset, perPage }) => {
    return (
        <div className="message-list" onWheel={(e)=>{
            e.preventDefault();
            e.stopPropagation();
            if (onOffsetChange)
                onOffsetChange(e.deltaY > 0 ? offset+1 : offset-1)
        }} >
            <h5>{"messages by token '"+tokenFilter+"' by user '"+userFilter+"' offset="+offset}</h5>
            <div>
                <input type="number" value={numMessageContext} onChange={(e) => {
                    if (onNumContextChange)
                        onNumContextChange(e.target.value);
                }}/>

            </div>
            <div>
                {messages.map((msg, i) => {
                    if (typeof(msg) == "string")
                        return <div key={"sep"+i} className="chat-separator">{msg}</div>;
                    else return (
                        <Message key={msg[0]} onClick={() => onMessageClick && onMessageClick(msg[0])}
                            messageId={msg[0]}
                            date={msg[1]}
                            user={msg[2]}
                            text={msg[3]}
                            highlight={highlights && highlights.has(msg[0])}
                        />
                    );
                })}
            </div>
        </div>
    )
}

MessageList.propTypes = {
    messages: PropTypes.arrayOf(
        PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.arrayOf(
                PropTypes.any
            )
        ])
    ).isRequired,
    onMessageClick: PropTypes.func,
    tokenFilter: PropTypes.number,
    userFilter: PropTypes.string,
    offset: PropTypes.number.isRequired,
    perPage: PropTypes.number.isRequired,
    hightlights: PropTypes.object
}

const filterChatMessagesByTokenId = (messages, id) => {
    if (!id)
        return messages;
    return messages.filter(m => m[4].includes(id));
}

const filterChatMessagesByUser = (messages, user) => {
    if (!user)
        return messages;
    return messages.filter(m => m[2] == user);
}

const expandMessages = (messages, num=3) => {
    var ret = {};
    var last_id = 0;
    for (let i in messages) {
        let msg = messages[i];
        if (msg[0] > last_id+1) {
            for (var j=Math.max(0, msg[0]-num); j < msg[0]; ++j)
                ret[j] = chat_messages[j];
        }
        ret[msg[0]] = msg;
        last_id = msg[0];
    }
    var retl = [];
    last_id = 0;
    for (let i in ret) {
        var msg = ret[i];
        if (msg[0] > last_id+1)
            retl.push("...");
        retl.push(msg);
        last_id = msg[0];
    }
    return retl;
}


const mapStateToProps = (state) => {
    let perPage = state.perPage || 10;
    let tokenFilter = state.messageTokenFilter || 0;
    let userFilter = state.messageUserFilter || "";
    var messages = filterChatMessagesByTokenId(filterChatMessagesByUser(chat_messages, userFilter), tokenFilter);
    var highlights = new Set();
    if ((tokenFilter || userFilter) && state.numMessageContext > 0)
        for (var i in messages)
            highlights.add(messages[i][0]);
    var messages = expandMessages(messages, state.numMessageContext);
    let offset = Math.max(0, Math.min(messages.length - perPage, state.messageOffset || 0));
    return {
        messages: messages.slice(offset, offset + perPage),
        tokenFilter: tokenFilter,
        userFilter: userFilter,
        offset: offset,
        perPage: perPage,
        highlights: highlights,
        numMessageContext: state.numMessageContext
    };
}

const mapDispatchToProps = dispatch => ({
    onOffsetChange: i => { dispatch(setMessageOffset(i)) },
    onNumContextChange: i => { dispatch(setNumMessageContext(i)) }
});

import { connect } from 'react-redux'

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MessageList)
