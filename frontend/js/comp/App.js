import React from 'react'

require('style.css');

import TokenListFiltered from './TokenListFiltered'
import MessageList from './MessageList'
import { setMessageTokenFilter } from '../actions'


const App = ({ onTokenClick }) => {

    return (
        <div>
            <a href="https://github.com/defgsus/afd-chat">github</a>
            &nbsp;| <a href="https://linksunten.indymedia.org/de/system/files/data/2017/06/3098700935.txt">source</a>
            &nbsp;| <a href="http://www.spiegel.de/netzwelt/web/afd-leaks-psychogramm-einer-partei-im-sinkflug-kolumne-a-1153365.html">lobo</a>

            <h3 className="clickable">AFD - Chat Protokoll</h3>
            <table>
                <tbody>
                    <tr>
                        <td> <TokenListFiltered onTokenClick={onTokenClick} /> </td>
                        <td> <MessageList onMessageClick={id => console.log("message", id)} /> </td>
                    </tr>
                </tbody>
            </table>
        </div>
    );
}



import { connect } from 'react-redux'

const mapStateToProps = state => ({
    mhhh: null
})

const mapDispatchToProps = dispatch => ({
    onTokenClick: id => { dispatch(setMessageTokenFilter(id)) }
})

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App)
