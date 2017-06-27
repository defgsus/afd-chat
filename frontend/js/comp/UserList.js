import React from 'react'
import PropTypes from 'prop-types'
import User from './User'

import { setUserOffset } from '../actions'

import { chat_users } from '../chat-messages'


const UserList = ({
    users, numUsers, onUserClick, onOffsetChange, offset, perPage }) => {
    var title = numUsers+" users";
    return (
        <div className="user-list" onWheel={(e)=>{
            e.preventDefault();
            e.stopPropagation();
            if (onOffsetChange)
                onOffsetChange(offset+Math.max(-10,Math.min(10, e.deltaY*.1)));
        }} >
            <h5>{title}</h5>
            <div className="button" disabled={offset==0}
                onClick={() => { if (onOffsetChange) onOffsetChange(offset-perPage+1) }}>▲</div>
            <div>
                {users.map(user => (
                    <User key={user} onClick={onUserClick}
                        user={user[0]}
                        count={user[1]}
                    />
                ))}
            </div>
            <div className="button" disabled={offset+perPage >= numUsers}
                 onClick={() => { if (onOffsetChange) onOffsetChange(offset+perPage-1) }}>▼</div>
        </div>
    )
}

UserList.propTypes = {
    users: PropTypes.array.isRequired,
    numUsers: PropTypes.number.isRequired,
    onUserClick: PropTypes.func,
    offset: PropTypes.number.isRequired,
    perPage: PropTypes.number.isRequired,
}


const mapStateToProps = (state) => {
    let perPage = state.perPage || 30;
    let users = chat_users;//state.users || [];
    let offset = Math.max(0, Math.min(users.length - perPage, state.userOffset || 0));
    return {
        users: users.slice(offset, offset + perPage),
        numUsers: users.length,
        offset: offset,
        perPage: perPage,
    };
}

const mapDispatchToProps = dispatch => ({
    onOffsetChange: i => { dispatch(setUserOffset(i)) },
});

import { connect } from 'react-redux'

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(UserList)
