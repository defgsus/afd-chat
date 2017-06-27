import React from 'react'
import PropTypes from 'prop-types'

const Token = ({ onClick, token }) => (
    <div
        className="token clickable"
        data-token-id={token.id}
        onClick={() => onClick && onClick(token.id)}
    >
        {token.name}
    </div>
)

Token.propTypes = {
    onClick: PropTypes.func,
    token: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
    }).isRequired,
};


export default Token;