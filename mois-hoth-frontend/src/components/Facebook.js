import React, {Component} from 'react';
import FacebookLogin from 'react-facebook-login'

export default class Facebook extends Component {
    /*state = {
        isLoggedIn: false,
        userId: '',
        name: '',
        email: '',
        picture: ''
    };*/

    responseFacebook = response => {
        //console.log(response);

        let user = {
            isLoggedIn: true,
            userId: response.userId,
            name: response.name,
            email: response.email,
            picture: response.picture.data.url
        };

        this.props.onLogin(user);
    };

    componentClicked = () => console.log('clicked');

    render() {
        let fbContent;

       /* if (this.state.isLoggedIn) {
            fbContent = (
                <div>
                    <img src={this.state.picture} alt={this.state.name}/>
                    <h2>{this.state.name}</h2>
                    <p>{this.state.email}</p>
                    <p>{this.state.userId}</p>
                </div>
            )
        } else {*/
            fbContent = (<FacebookLogin
                appId="2574747839406438"
                autoLoad={false}
                fields="name,email,picture"
                onClick={this.componentClicked}
                callback={this.responseFacebook}/>);

       // }

        return (
            <div>{fbContent}</div>
        )
    }

}

