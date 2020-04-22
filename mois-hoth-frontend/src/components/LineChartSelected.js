import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/dist/modal.js';
import Chart from "react-google-charts";

class LineChartSelected extends Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    render() {
        return (
            <div className="LineChartSelected">
                <div style={{display: 'flex', maxWidth: 900}}>
                    <Chart
                        width={'600px'}
                        height={'400px'}
                        chartType="LineChart"
                        loader={<div>Loading Chart</div>}
                        data={this.props.lineChartData}
                        options={{
                            hAxis: {
                                title: 'Datum',
                            },
                            vAxis: {
                                title: 'Částka',
                            }
                        }}
                        rootProps={{ 'data-testid': '2' }}
                    />
                </div>
            </div>
        )
    }
}

export default LineChartSelected;
