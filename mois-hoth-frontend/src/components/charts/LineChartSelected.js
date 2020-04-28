import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/dist/modal.js';
import Chart from "react-google-charts";

class LineChartSelected extends Component {
    constructor(props) {
        super(props);
        this.state = {
            chartReff: ""
        };
        this.resize = this.resize.bind(this);
    }

    render() {
        return (
            <div className="LineChartSelected">
                <div style={{display: 'block', margin: '0 auto', maxWidth: 1200}}>
                    <Chart
                        width={'100%'}
                        height={'400px'}
                        chartType={"LineChart"}
                        loader={<div>Loading Chart</div>}
                        data={this.props.lineChartData}
                        rootProps={{'data-testid': '2'}}
                        options={{

                            hAxis: {
                                title: 'Datum',
                            },
                            vAxis: {
                                title: 'Částka',
                            },
                            title: 'Přehled výdajů ve vybraných kategoriích za zvolené období',
                            chartArea: {width: '90%', height: '70%'},
                            legend: {position: 'top', alignment: 'center'}
                        }}
                        getChartWrapper={chartWrapper => {
                            this.setState({chartReff: chartWrapper});
                        }}
                    />
                </div>
            </div>
        )
    }

    resize(e) {
        let temp = this.state.chartReff;
        temp.width=e.innerWidth-100;
        temp.draw();
    }

    componentDidMount() {
        window.addEventListener('resize', this.resize);
    }

    componentWillUnmount() {
        window.removeEventListener('resize', this.resize);
    }
}

export default LineChartSelected;
