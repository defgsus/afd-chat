import React from 'react'
import PropTypes from 'prop-types'

const Token = ({ onClick, token }) => (
    <div
        className="token clickable"
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
    }),
};

Token.propTypes = tokenPropTypes;

export default Token;