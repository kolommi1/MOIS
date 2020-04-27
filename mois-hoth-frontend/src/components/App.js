import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Login from "./Login";
import '../css/App.css';
import auth from '../js/auth';

import MainPage from "./MainPage";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            currentUser: null
        };
    }

    onLogin = (newUser) => {
        console.log('Current User:');
        console.log(newUser);
        this.setState({currentUser: newUser});
    };

    onLogout = () => {
        auth.logout();
        this.setState({
            currentUser: null
        });
    };

    render() {
        if (this.state.currentUser) {
            return (
                <div className="App">
                    <MainPage user={this.state.currentUser} onLogout={this.onLogout}/>
                </div>
            );
        } else {
            return (
                <div className="App">
                    <Login onLogin={this.onLogin}/>
                </div>
            );
        }
    }
}

export default App;
