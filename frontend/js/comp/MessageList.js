import React from 'react'
import PropTypes from 'prop-types'
import Message from './Message'
import { messagePropTypes } from './Message'

import { chat_messages } from '../chat-messages'


const MessageList = ({ messages, onMessageClick, tokenFilter, userFilter, offset, perPage }) => {
    return (
        <div className="message-list">
            <h5>{"messages by token '"+tokenFilter+"' by user '"+userFilter+"' offset="+offset}</h5>
            <div>
                {messages.map(msg => (
                    <Message key={msg[0]} onClick={() => onMessageClick && onMessageClick(msg[0])}
                        messageId={msg[0]}
                        date={msg[1]}
                        user={msg[2]}
                        text={msg[3]}
                    />
                ))}
            </div>
        </div>
    )
}

MessageList.propTypes = {
    messages: PropTypes.arrayOf(
        PropTypes.arrayOf(
            PropTypes.any
        )
    ).isRequired,
    onMessageClick: PropTypes.func,
    tokenFilter: PropTypes.number,
    userFilter: PropTypes.string,
    offset: PropTypes.number.isRequired,
    perPage: PropTypes.number.isRequired,
}

const filterChatMessagesByTokenId = (messages, id) => {
    if (!id)
        return messages;
    return messages.filter(m => m[4].includes(id))
}

const filterChatMessagesByUser = (messages, user) => {
    if (!user)
        return messages;
    return messages.filter(m => m[2] == user)
}

const mapStateToProps = (state) => {
    let offset = state.offset || 0;
    let perPage = state.perPage || 10;
    let tokenFilter = state.messageTokenFilter || 0;
    let userFilter = state.messageUserFilter || "";
    let messages = filterChatMessagesByTokenId(filterChatMessagesByUser(chat_messages, userFilter), tokenFilter);
    return {
        messages: messages.slice(offset, offset + perPage),
        tokenFilter: tokenFilter,
        userFilter: userFilter,
        offset: offset,
        perPage: perPage
    };
}

const mapDispatchToProps = dispatch => ({
    onOffsetChange: i => { dispatch(setMessageOffset(i)) }
})

import { connect } from 'react-redux'

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(MessageList)
