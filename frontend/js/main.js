import React from 'react'
import ReactDOM from 'react-dom'

import { Provider } from 'react-redux'

import App from './comp/App.js'

ReactDOM.render(
    //<Provider>
        <App />,
    //</Provider>,
    document.getElementById('react-root')
);

