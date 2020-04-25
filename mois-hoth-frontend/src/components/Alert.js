import React, {Component} from 'react';

export default class Alert extends Component {
    constructor(props) {
        super(props);

        this.state = {
            show: false,
            class: this.props.class,
            message: props.message ? props.message : ''
        };
    }

    showAlert = () => {
        this.setState({
            show: true
        });
    };

    hideAlert = () => {
        this.setState({
            show: false
        });
    };


    render() {
        let classes = 'alert '
            + (this.state.class ? this.state.class : 'alert-danger ')
            + (this.state.show ? '' : 'd-none');

        return (
            <div className={classes} role="alert">
                {this.state.message}
            </div>
        );
    }

}

