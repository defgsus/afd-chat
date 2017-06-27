import React from 'react'
import PropTypes from 'prop-types'
import Token from './Token'


const TokenList = ({ tokens, onTokenClick }) => (
    <div>
        {tokens.map(tok => (
            <Token key={tok.id} token={tok} onClick={() => onTokenClick && onTokenClick(tok.id)} />
        ))}
    </div>
)

TokenList.propTypes = {
    tokens: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
        }).isRequired
    ).isRequired,
    onTokenClick: PropTypes.func
}

export default TokenList
