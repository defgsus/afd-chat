import React from 'react'
import PropTypes from 'prop-types'

import { chat_tokens } from '../chat-tokens'
import { setTokenFilter } from '../actions'


const TokenListFiltered = ({ tokens, tokenFilter, onFilterChange, onTokenClick }) => (
    <div className="token-list">
        <input type="text" className="filter-input" placeholder="filter" value={tokenFilter}
               onChange={(e) => onFilterChange(e.target.value) }/>
        <TokenList tokens={tokens} onTokenClick={onTokenClick} />
    </div>
)

TokenListFiltered.propTypes = {
    tokens: PropTypes.arrayOf(
        PropTypes.shape({
            id: PropTypes.number.isRequired,
            name: PropTypes.string.isRequired,
        }).isRequired
    ).isRequired,
    tokenFilter: PropTypes.string,
    onFilterChange: PropTypes.func,
    onTokenClick: PropTypes.func
}




const getVisibleTokens = (tokens, filter) => {
    if (!filter)
        return tokens;
    return tokens.filter(tok => tok.name.includes(filter));
}

const mapStateToProps = state => ({
    tokens: getVisibleTokens(chat_tokens, state.tokenFilter),
    tokenFilter: state.tokenFilter
})

const mapDispatchToProps = dispatch => ({
    onFilterChange: id => { dispatch(setTokenFilter(id)) }
})

import { connect } from 'react-redux'
import TokenList from './TokenList'

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TokenListFiltered)
