import React from 'react'
import PropTypes from 'prop-types'

import InfoField from './InfoField'
import { chat_tokens } from '../chat-tokens'
import { setTokenFilter, setTokenOffset } from '../actions'


const TokenListFiltered = ({
            tokens, tokenFilter, onFilterChange, onTokenClick, onOffsetChange,
            offset, perPage, numTokens, selectedToken }) => (
    <div className="token-list">
        <h5>{numTokens} tokens</h5>
        <input type="text" className="filter-input" placeholder="filter" value={tokenFilter}
               onChange={(e) => onFilterChange(e.target.value) }/>
        <div className="button" disabled={offset==0}
            onClick={() => { if (onOffsetChange) onOffsetChange(offset-perPage+1) }}>▲</div>
        <div onWheel={(e)=>{
            e.preventDefault();
            e.stopPropagation();
            if (onOffsetChange)
                onOffsetChange(offset+Math.max(-10,Math.min(10, e.deltaY*.1)));
        }}>
            {tokens.map(tok => (
                <InfoField
                    key={tok.id}
                    className="token"
                    onClick={onTokenClick}
                    clickValue={tok.id}
                    selected={selectedToken == tok.id}
                    values={[tok.name, tok.count]}
                    />
            ))}
        </div>
        <div className="button" disabled={offset+perPage >= numTokens}
             onClick={() => { if (onOffsetChange) onOffsetChange(offset+perPage-1) }}>▼</div>
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
    onTokenClick: PropTypes.func,
    onOffsetChange: PropTypes.func,
    offset: PropTypes.number.isRequired,
    perPage: PropTypes.number.isRequired,
    numTokens: PropTypes.number.isRequired,
    selectedToken: PropTypes.number
}



const getVisibleTokens = (tokens, filter) => {
    if (!filter)
        return tokens;
    return tokens.filter(tok => tok.name.includes(filter));
}

const mapStateToProps = state => {
    let perPage = state.perPage || 29;
    let tokens = getVisibleTokens(chat_tokens, state.tokenFilter);
    let offset = Math.max(0, Math.min(tokens.length - perPage, state.tokenOffset || 0));
    return {
        tokens: tokens.slice(offset, offset + perPage),
        tokenFilter: state.tokenFilter,
        offset: offset,
        perPage: perPage,
        numTokens: tokens.length,
        selectedToken: state.messageTokenFilter
    }
}

const mapDispatchToProps = dispatch => ({
    onFilterChange: id => { dispatch(setTokenFilter(id)) },
    onOffsetChange: i => { dispatch(setTokenOffset(i)) }
})

import { connect } from 'react-redux'

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(TokenListFiltered)
