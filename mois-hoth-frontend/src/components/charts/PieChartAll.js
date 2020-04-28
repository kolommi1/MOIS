import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/dist/modal.js';
import Chart from "react-google-charts";


class PieChartAll extends Component {

    constructor(props) {
        super(props);
        this.state = {};

    }

    render() {
        return (
            <div className="PieChartAll">
                <div style={{display: 'block', margin: '0 auto', maxWidth: 600}}>
                    <Chart
                        width={'99%'}
                        height={'400px'}
                        chartType="PieChart"
                        loader={<div>Loading Chart</div>}
                        data={[
                            ['Katerogie', 'Útrata'],
                            ['Nezařazeno', this.props.categorySummaryAll[0]],
                            ['Jídlo', this.props.categorySummaryAll[1]],
                            ['Oblečení', this.props.categorySummaryAll[2]],
                            ['Cestování', this.props.categorySummaryAll[3]],
                            ['Hygiena', this.props.categorySummaryAll[4]],
                            ['Bydlení', this.props.categorySummaryAll[5]]
                        ]}

                        options={{
                            title: 'Přehled všech výdajů',
                            chartArea: {width: '100%', height: '70%'},
                            legend: {position: 'top', alignment: 'center'}
                        }}
                        rootProps={{'data-testid': '1'}}
                    />
                </div>
            </div>
        )
    }
}

export default PieChartAll;
