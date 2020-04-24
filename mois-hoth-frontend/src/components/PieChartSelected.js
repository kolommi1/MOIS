import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/dist/modal.js';
import Chart from "react-google-charts";


class PieChartSelected extends Component {

    constructor(props) {
        super(props);
        this.state = {};

    }

    render() {
        return (
            <div className="PieChartSelected">
                <div style={{display: 'block', margin: '0 auto', maxWidth: 700}}>
                    <Chart
                        width={'600px'}
                        height={'400px'}
                        chartType="PieChart"
                        loader={<div>Loading Chart</div>}
                        data={[
                            ['Katerogie', 'Útrata'],
                            ['Nezařazeno', this.props.categorySummarySelected[0]],
                            ['Jídlo', this.props.categorySummarySelected[1]],
                            ['Oblečení', this.props.categorySummarySelected[2]],
                            ['Cestování', this.props.categorySummarySelected[3]],
                            ['Hygiena', this.props.categorySummarySelected[4]],
                            ['Bydlení', this.props.categorySummarySelected[5]]
                        ]}


                        options={{
                            title: 'Přehled vybraných kategorií',
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

export default PieChartSelected;
