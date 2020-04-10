import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import Login from "./Login";
import '../css/App.css';

import MainPage from "./MainPage";

class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            user: null,
        };
    }

    setUser = (newUser) => {
        this.setState({user: newUser});
    };

    render() {

        //LOGIN - zatím zakomentovaný (je potřeba dodělat)
        /*if (this.state.user == null) {
            return (
                <div className="App">
                    <Login onLogin={this.setUser} />
                </div>
            );
        } else {*/
            return (
                <div className="App">
                    <MainPage/>
                </div>
            );
        //}
    }
}

export default App;
