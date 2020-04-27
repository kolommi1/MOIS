import React, {Component} from 'react';
import logo from "../img/logo.png";
import '../css/Login.css';
import API_Calls from "../js/apiCalls";
import auth from '../js/auth';

import FbLogin from './FbLogin'
import Alert from './Alert'

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            readyToRender: false,
            email: '',
            password: ''
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);
        this.handleLoginChange = this.handleLoginChange.bind(this);

        this.alert = React.createRef();
    }

    componentDidMount() {
        let token = auth.getToken();
        if (token) {
            API_Calls.getCurrentUser().then(user => {
                if (user) {
                    this.props.onLogin(user);
                } else {
                    this.setState({readyToRender: true});
                }
            }).catch((e) => {
                console.log('ERROR:' + e.message);
                auth.logout();
                this.setState({readyToRender: true});
            });
        } else {
            this.setState({readyToRender: true});
        }
    }

    login = (user) => {
        console.log("USER LOGGED IN:");
        console.log(user);

        this.props.onLogin(user);
    };

    handleSubmit(event) {
        API_Calls.userAuthenticate(this.state.email, this.state.password)
            .then(user => {
                if (user && user.active) {
                    console.log("USER LOGGED: " + user);
                    this.login(user);
                } else {
                    console.log("WRONG EMAIL OR PASSWORD!!")
                }
            })
            .catch(e => {
                this.alert.current.showAlert();
                console.log('LOGIN ERROR: ' + e.message);
            });

        event.preventDefault();
    }

    handleLoginChange(event) {
        this.alert.current.hideAlert();
        this.setState({
            email: event.target.value
        });
    }

    handlePasswordChange(event) {
        this.alert.current.hideAlert();
        this.setState({
            password: event.target.value
        });
    }

    render() {
        if (this.state.readyToRender) {
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
                    <Alert ref={this.alert} message='Wrong email or password!'/>
                    <button className="btn btn-lg btn-primary btn-block mb-5" type="submit">Sign in</button>
                    <FbLogin onLogin={this.login}/>
                </form>
            );
        }
        return "";
    }

}

