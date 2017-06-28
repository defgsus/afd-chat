import React from 'react'
import PropTypes from 'prop-types'
import InfoField from './InfoField'

import { setUserOffset } from '../actions'

import { chat_users } from '../chat-messages'


const UserList = ({
        users, numUsers, onUserClick, onOffsetChange, offset, perPage, selectedUser
                }) => {
    var title = numUsers+" users";
    return (
        <div className="user-list" onWheel={(e)=>{
            e.preventDefault();
            e.stopPropagation();
            if (onOffsetChange)
                onOffsetChange(offset+Math.max(-10,Math.min(10, e.deltaY*.1)));
        }} >
            <div className="list-header">
                <h5>{title}</h5>
                <div className="button" disabled={!selectedUser || selectedUser==""} onClick={() => { onUserClick(""); }}>x</div>
            </div>
            <div className="button" disabled={offset==0}
                onClick={() => { if (onOffsetChange) onOffsetChange(offset-perPage+1) }}>▲</div>
            <div>
                {users.map(user => (
                    <InfoField
                            key={user}
                            className="user-entry"
                            onClick={selectedUser != user[0] ? onUserClick : null}
                            clickValue={user[0]}
                            selected={selectedUser == user[0]}
                            values={user}
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
    selectedUser: PropTypes.string
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
        selectedUser: state.messageUserFilter
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
