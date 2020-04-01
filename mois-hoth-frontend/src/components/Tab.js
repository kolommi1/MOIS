import React, { Component } from "react";
import PropTypes from "prop-types";

class Tab extends Component {
    static propTypes = {
        activeTabName: PropTypes.string.isRequired,
        name: PropTypes.string.isRequired,
        onClick: PropTypes.func.isRequired,
    };

    onClick = () => {
        const { name, onClick } = this.props;
        onClick(name);
    }

    render() {
        const {
            onClick,
            props: {
                activeTabName,
                name,
            },
        } = this;

        let className = 'tab';
        if (activeTabName === name) {
            className += ' tab-active';
        }

        return (
            <li className={className} onClick={onClick}>{name}</li>
        );
    }
}

export default Tab;