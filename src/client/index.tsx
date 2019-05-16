import * as React from 'react';
import * as ReactDOM from 'react-dom'
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

import App from './components/App'

function AppRouter() {
    return (
        <Router>
            <Route  exact path="/my/" component={App} />
        </Router>
    )
}

ReactDOM.render(
    <AppRouter />,
    document.getElementById('root')
)
