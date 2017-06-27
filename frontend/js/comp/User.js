import React from 'react'
import PropTypes from 'prop-types'

const User = ({ onClick, user, count }) => (
    <div
        className="user-entry clickable"
        onClick={() => onClick && onClick(user)}
    >
        {user}
        <div className="right">{count}</div>
    </div>
)

export const userPropTypes = {
    onClick: PropTypes.func,
    count: PropTypes.number,
    user: PropTypes.string.isRequired
};

User.propTypes = userPropTypes;

export default User;