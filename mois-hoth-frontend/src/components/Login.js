import React, {Component} from 'react';
import logo from "../img/logo.png";
import '../css/Login.css';
import API_Calls from "../js/apiCalls";

import FbLogin from './FbLogin'

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleLoginChange = this.handleLoginChange.bind(this);
    }

    login = (user) => {
        console.log("USER LOGGED IN:");
        console.log(user);

        this.props.onLogin(user)
    };

    handleSubmit(event) {

        //{"id":12785567,"accountId":345678912,"active":true,"name":"Kamil","sure_name":"Nemyl","mail":"abbc@a.cz","password":"heslo"}

        API_Calls.userAuthenticate(this.state.email, this.state.password)
            .then(users => {
                if (users.length > 0 && users[0].active) {
                    this.login(users[0]);
                }
                else {
                    console.log("WRONG EMAIL OR PASSWORD!!")
                }
            });

        event.preventDefault();
    }

    handleLoginChange(event) {
        this.setState({email: event.target.value})
    }

    handlePasswordChange(event) {
        this.setState({password: event.target.value})
    }

    render() {
        return (
            <form className="form-signin" onSubmit={this.handleSubmit}>
                <img className="App-logo mb-3" src={logo} alt="logo"/>
                <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
                <label htmlFor="inputEmail" className="sr-only">Email address</label>
                <input value={this.state.email} onChange={this.handleLoginChange} type="email" id="inputEmail"
                       className="form-control" placeholder="Email address" required/>
                <label htmlFor="inputPassword" className="sr-only">Password</label>
                <input value={this.state.password} onChange={this.handlePasswordChange} type="password"
                       id="inputPassword" className="form-control" placeholder="Password" required/>
                <button className="btn btn-lg btn-primary btn-block mb-5" type="submit">Sign in</button>
                <FbLogin onLogin={this.login}/>
            </form>
        );
    }

}

