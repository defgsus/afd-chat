import React from 'react'
import PropTypes from 'prop-types'

const Token = ({ onClick, token }) => (
    <div
        className="token clickable"
        data-token-id={token.id}
        onClick={() => onClick && onClick(token.id)}
    >
        {token.name}
        <div className="right">{token.count}</div>
    </div>
)

export const tokenPropTypes = {
    onClick: PropTypes.func,
    token: PropTypes.shape({
        id: PropTypes.number.isRequired,
        name: PropTypes.string.isRequired,
    }).isRequired,
};

Token.propTypes = tokenPropTypes;

export default Token;