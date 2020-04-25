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
                <div style={{display: 'block', margin: '0 auto', maxWidth: 1200}}>
                    <Chart
                        width={'1200px'}
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
                            },
                            title: 'Přehled výdajů kategorií v čase',
                            chartArea: {width: '100%', height: '70%'},
                            legend: {position: 'top', alignment: 'center'}

                        }}
                        rootProps={{ 'data-testid': '2' }}
                    />
                </div>
            </div>
        )
    }
}

export default LineChartSelected;
