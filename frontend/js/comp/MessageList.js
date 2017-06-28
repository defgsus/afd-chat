import React from 'react'
import PropTypes from 'prop-types'
import Message from './Message'
import { messagePropTypes } from './Message'

import { setNumMessageContext, setMessageOffset } from '../actions'

import { chat_messages } from '../chat-messages'
import { idToToken } from '../chat-tokens'


const MessageList = ({
    messages, numMessages, numMatchingMessages, onMessageClick, onNumContextChange, onOffsetChange, tokenFilter, userFilter,
    highlights, numMessageContext, offset, perPage }) => {
    const doShowContextInput = (tokenFilter || userFilter) && numMessages > 0;
    let token = idToToken(tokenFilter);
    var title = numMatchingMessages + " messages";
    if (userFilter)
        title += " by user '"+userFilter+"'";
    if (tokenFilter)
        title += " containing '"+token+"'";
    //title += " offset="+offset;
    return (
        <div className="message-list" onWheel={(e)=>{
            e.preventDefault();
            e.stopPropagation();
            if (onOffsetChange)
                onOffsetChange(e.deltaY > 0 ? offset+1 : offset-1)
        }} >
            <h5>{title}</h5>
            { doShowContextInput && (<div>
                <label htmlFor="num-context-input">number messages in context</label>
                <input id="num-context-input" type="number" className="number-input"
                    value={numMessageContext} onChange={(e) => {
                        if (onNumContextChange)
                            onNumContextChange(e.target.value);
                }}/>
            </div>) }
            { offset > 0 && <div className="button"
                onClick={() => { if (onOffsetChange) onOffsetChange(offset-perPage+1) }}>▲</div> }
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
            { offset+perPage < numMessages && <div className="button"
                onClick={() => { if (onOffsetChange) onOffsetChange(offset+perPage-1) }}>▼</div> }
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
    numMessages: PropTypes.number,
    numMatchingMessages: PropTypes.number,
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
    num = Math.max(0, num);
    if (!num)
        return messages;
    var ret = {};
    var last_id = 0;
    for (let i in messages) {
        let msg = messages[i];
        if (msg[0] > last_id+1) {
            for (var j=Math.max(0, msg[0]-num); j < msg[0]; ++j)
                ret[j] = chat_messages[j];
            for (var j=msg[0]+1; j < Math.min(chat_messages.length, msg[0]+num+1); ++j)
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
    if (retl.length && chat_messages.length > last_id+1)
        retl.push("...");
    return retl;
}


var cache = {
    messages: [],
    highlights: new Set(),
    tokenFilter: null,
    userFilter: null,
    numContext: -1,
    numMatchingMessages: 0
}

const mapStateToProps = (state) => {
    let perPage = state.perPage || 10;
    let tokenFilter = state.messageTokenFilter || 0;
    let userFilter = state.messageUserFilter || "";
    var messages = cache.messages;
    var highlights = cache.highlights;
    if (userFilter != cache.userFilter
    || tokenFilter != cache.tokenFilter
    || state.numMessageContext != cache.numContext) {
        messages = filterChatMessagesByTokenId(filterChatMessagesByUser(chat_messages, userFilter), tokenFilter);
        highlights = new Set();
        if ((tokenFilter || userFilter) && state.numMessageContext > 0)
            for (var i in messages)
                highlights.add(messages[i][0]);
        cache.numMatchingMessages = messages.length;
        messages = expandMessages(messages, state.numMessageContext);
        cache.messages = messages;
        cache.highlights = highlights;
        cache.tokenFilter = tokenFilter;
        cache.userFilter = userFilter;
        cache.numContext = state.numMessageContext;
    }
    let offset = Math.max(0, Math.min(messages.length - perPage, state.messageOffset || 0));
    return {
        messages: messages.slice(offset, offset + perPage),
        numMessages: messages.length,
        numMatchingMessages: cache.numMatchingMessages,
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
