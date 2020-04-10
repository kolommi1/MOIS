import React, { Component } from "react";
import PropTypes from "prop-types";

import Tab from './Tab';

export default class Tabs extends Component {
    static propTypes = {
        children: PropTypes.instanceOf(Array).isRequired,
    };

    constructor(props) {
        super(props);

        this.state = {
            activeTabName: this.props.children[0].props.name,
        };
    }

    onClickTab = (tab) => {
        this.setState({ activeTabName: tab });
    };

    render() {
        const {
            onClickTab,
            props: {
                children,
            },
            state: {
                activeTabName,
            }
        } = this;

        return (
            <div className="tabs">
                <ol className="tabs-menu">
                    {children.map((child) => {
                        const { name } = child.props;

                        return (
                            <Tab activeTabName={activeTabName} key={name} name={name} onClick={onClickTab}/>
                        );
                    })}
                </ol>
                <div className="tab-content">
                    {children.map((child) => {
                        if (child.props.name !== activeTabName) return undefined;
                        return child.props.children;
                    })}
                </div>
            </div>
        );
    }
}