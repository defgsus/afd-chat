import React from 'react'
import PropTypes from 'prop-types'

import { setMessageUserFilter } from '../actions'


const Message = ({ messageId, date, user, text, highlight, onUserClick }) => (
    <div className={highlight && "highlight"}>
        <div className="chat-message">
            <span className="chat-user clickable"
                  onClick={(e) => { e.preventDefault(); e.stopPropagation(); if (onUserClick) onUserClick(user); }}>
                {user}
            </span>
            <span className="chat-date">
                {new Date(date*1000).toISOString()}
            </span>
            <div className="chat-text" dangerouslySetInnerHTML={{__html: text}}></div>
        </div>
    </div>
)

export const messagePropTypes = {
    onClick: PropTypes.func,
    messageId: PropTypes.number,
    date: PropTypes.number,
    user: PropTypes.string,
    text: PropTypes.string,
    onUserClick: PropTypes.func
};

Message.propTypes = messagePropTypes;


const mapDispatchToProps = dispatch => ({
    onUserClick: user => { dispatch(setMessageUserFilter(user)) }
})

import { connect } from 'react-redux'

export default connect(
    null,
    mapDispatchToProps
)(Message)
