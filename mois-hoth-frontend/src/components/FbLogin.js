import React, {Component} from 'react';
import FacebookLogin from 'react-facebook-login'
import API_Calls from "../js/apiCalls";
import auth from '../js/auth';

export default class FbLogin extends Component {

    responseFacebook = response => {
        //console.log(response);

        API_Calls.facebookLogin(response).then(user => {
            this.props.onLogin(user);
        }).catch((e) => {
            console.log('FbLogin Error:' + e.message);
            auth.logout();
            this.props.onLogin(null);
        });
    };

    componentClicked = () => console.log('clicked');

    render() {
        return (
            <FacebookLogin
                appId="2574747839406438"
                autoLoad={false}
                fields="name,email,picture"
                onClick={this.componentClicked}
                callback={this.responseFacebook}/>
        )
    }

}

