import React from 'react'

require('style.css');

import TokenListFiltered from './TokenListFiltered'



class App extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div>
                <a href="https://github.com/defgsus/afd-chat">github</a>
                &nbsp;| <a href="https://linksunten.indymedia.org/de/system/files/data/2017/06/3098700935.txt">source</a>
                &nbsp;| <a href="http://www.spiegel.de/netzwelt/web/afd-leaks-psychogramm-einer-partei-im-sinkflug-kolumne-a-1153365.html">lobo</a>

                <h3 className="clickable">AFD - Chat Protokoll</h3>
                <TokenListFiltered onTokenClick={id => console.log(id)}/>
            </div>
        );
    }
}


export default App;