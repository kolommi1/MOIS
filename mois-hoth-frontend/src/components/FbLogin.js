import React, {Component} from 'react';
import FacebookLogin from 'react-facebook-login'

export default class FbLogin extends Component {
    /*state = {
        isLoggedIn: false,
        userId: '',
        name: '',
        email: '',
        picture: ''
    };*/

    responseFacebook = response => {
        //console.log(response);

        //{"id":12785567,"accountId":345678912,"active":true,"name":"Kamil","sure_name":"Nemyl","mail":"abbc@a.cz","password":"heslo"}
        let user = {
            id: response.id,
            accountId: 0,
            active: true,
            name: response.name,
            sure_name: '',
            mail: response.email
            //picture: response.picture.data.url
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

