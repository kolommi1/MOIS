import React, {Component} from 'react';
import logo from '../logo.svg';
import 'bootstrap/dist/css/bootstrap.css';
import '../css/App.css';
import Tabs from "./Tabs";
import CategoryJidlo from "./CategoryJidlo";
import CategoryObleceni from "./CategoryObleceni";
import CategoryCestovani from "./CategoryCestovani";
import CategoryHygiena from "./CategoryHygiena";
import CategoryBydleni from "./CategoryBydleni";
import Login from "./Login";

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            user: null,
        };
    }

    setUser = (newUser) => {
        this.setState({user: newUser});
        console.log(this.state.user);
    };

    render() {

        if (this.state.user == null) {
            return (
                <div className="App">
                    <Login onLogin={this.setUser}></Login>
                </div>
            );
        } else {
            return (
                <div className="App">
                    <header className="App-header">
                        <img src={logo} className="App-logo" alt="logo"/>

                        <Tabs>
                            <div name="Jídlo">
                                <CategoryJidlo></CategoryJidlo>
                            </div>
                            <div name="Oblečení">
                                <CategoryObleceni></CategoryObleceni>
                            </div>
                            <div name="Cestování">
                                <CategoryCestovani></CategoryCestovani>
                            </div>
                            <div name="Hygiena">
                                <CategoryHygiena></CategoryHygiena>
                            </div>
                            <div name="Bydlení">
                                <CategoryBydleni></CategoryBydleni>
                            </div>
                        </Tabs>

                    </header>

                    <p className={'muted'}>{this.state.user.email}</p>
                </div>
            );
        }
    }

}

export default App;
