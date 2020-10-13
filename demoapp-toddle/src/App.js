import React, { Component } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';

import IndexBoard from './containers/IndexBoard.jsx';
import NavHeader from './components/NavHeader.jsx';

class App extends Component {
    state = {
        data: null,
    };

    render() {
        return (
            <Router>
                <div className='App'>
                    <NavHeader />
                    <Switch>
                        <Route path='/' exact component={Home} />
                        <Route path='/board' exact component={IndexBoard} />
                    </Switch>
                </div>
            </Router>
        );
    }
}

const Home = () => (
    <div>
        <center>
            <div className='my-4'>
                <h1>Home Page</h1>
                <div className='my-4'>
                    <h4>Navigate to /board</h4>
                </div>
            </div>
        </center>
    </div>
);

export default App;
