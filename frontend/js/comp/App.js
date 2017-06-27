import React from 'react'

require('style.css');

import TokenListFiltered from './TokenListFiltered'
import MessageList from './MessageList'
import UserList from './UserList'
import { setMessageTokenFilter, setMessageUserFilter } from '../actions'


const App = ({ onTokenClick, onUserClick }) => {

    return (
        <div>
            <a href="https://github.com/defgsus/afd-chat">github</a>
            &nbsp;| <a href="https://linksunten.indymedia.org/de/system/files/data/2017/06/3098700935.txt">source</a>
            &nbsp;| <a href="http://www.spiegel.de/netzwelt/web/afd-leaks-psychogramm-einer-partei-im-sinkflug-kolumne-a-1153365.html">lobo</a>

            <h3 className="clickable">AFD - Chat Protokoll</h3>
            <div id="page-modules">
                <UserList onUserClick={onUserClick} />
                <TokenListFiltered onTokenClick={onTokenClick} />
                <MessageList onMessageClick={id => console.log("message", id)} />
            </div>
        </div>
    );
}



import { connect } from 'react-redux'

const mapStateToProps = state => ({
    mhhh: null
})

const mapDispatchToProps = dispatch => ({
    onTokenClick: id => { dispatch(setMessageTokenFilter(id)) },
    onUserClick: id => { dispatch(setMessageUserFilter(id)) }
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App)
