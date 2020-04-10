import React, { Component } from 'react';
import '../css/Login.css';
import API_Calls from "../js/apiCalls";

import Facebook from './Facebook'

export default class Login extends Component {
    constructor(props){
        super(props);
        this.state = {
            email: '',
            password: ''
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleLoginChange = this.handleLoginChange.bind(this);
    }

    handleSubmit(event){

        let result = API_Calls.getAllPayments();

        var user = {
            isLoggedIn: true,
            email: this.state.email
        };

        this.props.onLogin(user);
        event.preventDefault();
    }

    handleLoginChange(event){
        this.setState({email: event.target.value})
    }

    handlePasswordChange(event){
        this.setState({password: event.target.value})
    }

    render() {
        return (
            <form className="form-signin" onSubmit={this.handleSubmit} >
                <img className="mb-4" src="https://getbootstrap.com/docs/4.4/assets/brand/bootstrap-solid.svg" alt="" width="72" height="72"/>
                <h1 className="h3 mb-3 font-weight-normal">Please sign in</h1>
                <label htmlFor="inputEmail" className="sr-only">Email address</label>
                <input value={this.state.email} onChange={this.handleLoginChange} type="email" id="inputEmail" className="form-control" placeholder="Email address" required/>
                <label htmlFor="inputPassword" className="sr-only">Password</label>
                <input value={this.state.password} onChange={this.handlePasswordChange} type="password" id="inputPassword" className="form-control" placeholder="Password" required/>
                <button className="btn btn-lg btn-primary btn-block mb-5" type="submit">Sign in</button>
                <Facebook onLogin={this.props.onLogin}/>
            </form>
        );
    }

}

