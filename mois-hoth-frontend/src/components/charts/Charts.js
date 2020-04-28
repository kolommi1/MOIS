import React, {Component} from 'react';
import PieChartAll from "./PieChartAll";
import PieChartSelected from "./PieChartSelected";
import LineChartSelected from "./LineChartSelected";
import moment from "moment";

class Charts extends Component {
    constructor(props) {
        super(props);
        this.state = {
            payments: props.payments,
            paymentsAll: props.paymentsAll
        };
        this.getCategorySummarySelected = this.getCategorySummarySelected.bind(this);
        this.getCategorySummaryAll = this.getCategorySummaryAll.bind(this);
        this.getDataForLineChart = this.getDataForLineChart.bind(this);
    }

    componentDidMount() {
        this.setState( {payments: this.props.payments})
        this.setState( {paymentsAll: this.props.paymentsAll})
    }

    componentDidUpdate(prevProps) {
        if(prevProps.payments !== this.props.payments){
            this.setState({
                payments: this.props.payments
            });
        }
        if(prevProps.paymentsAll !== this.props.paymentsAll){
            this.setState({
                paymentsAll: this.props.paymentsAll
            });
        }
    }


    render() {
        return (
            <div className="charts">
                <PieChartAll categorySummaryAll={this.getCategorySummaryAll()}/>
                <PieChartSelected categorySummarySelected={this.getCategorySummarySelected()}/>
                <LineChartSelected lineChartData={this.getDataForLineChart()}/>
            </div>
        )
    }

    getCategorySummarySelected() {
        let cat0 = 0, cat1 = 0, cat2 = 0, cat3 = 0, cat4 = 0, cat5 = 0;
        let paymentsArr = this.state.payments;

        for (let i = 0; i < paymentsArr.length; i++) {
            switch (paymentsArr[i].categoryId) {
                case 0:
                    cat0 += paymentsArr[i].value.amount;
                    break;
                case 1:
                    cat1 += paymentsArr[i].value.amount;
                    break;
                case 2:
                    cat2 += paymentsArr[i].value.amount;
                    break;
                case 3:
                    cat3 += paymentsArr[i].value.amount;
                    break;
                case 4:
                    cat4 += paymentsArr[i].value.amount;
                    break;
                case 5:
                    cat5 += paymentsArr[i].value.amount;
                    break;
                default:
                    cat0 += paymentsArr[i].value.amount;
            }
        }

        return [cat0, cat1, cat2, cat3, cat4, cat5];
    }

    getCategorySummaryAll() {
        let cat0 = 0, cat1 = 0, cat2 = 0, cat3 = 0, cat4 = 0, cat5 = 0;
        let paymentsArr = this.state.paymentsAll;

        for (let i = 0; i < paymentsArr.length; i++) {
            switch (paymentsArr[i].categoryId) {
                case 0:
                    cat0 += paymentsArr[i].value.amount;
                    break;
                case 1:
                    cat1 += paymentsArr[i].value.amount;
                    break;
                case 2:
                    cat2 += paymentsArr[i].value.amount;
                    break;
                case 3:
                    cat3 += paymentsArr[i].value.amount;
                    break;
                case 4:
                    cat4 += paymentsArr[i].value.amount;
                    break;
                case 5:
                    cat5 += paymentsArr[i].value.amount;
                    break;
                default:
                    cat0 += paymentsArr[i].value.amount;
            }
        }
        return [cat0, cat1, cat2, cat3, cat4, cat5];
    }

    getDataForLineChart() {
        //receive disp. data
        let paymentsArr = this.state.payments;
        let paymentDueDate;
        let dateHelp
        let oldestNewestArray = this.getOldestAndNewestPayment(paymentsArr);
        let preparedArrayForLineChart = this.prepareArrayForLineChart(oldestNewestArray[2], oldestNewestArray[0]);

        for (let i = 0; i < paymentsArr.length; i++) {
            if (navigator.userAgent.indexOf("Firefox") !== -1 || navigator.userAgent.indexOf("Safari") !== -1) {
                let paymentDueDateSplit = paymentsArr[i].dueDate.split(".");
                dateHelp = new Date(Number.parseInt(paymentDueDateSplit[2]),
                    Number.parseInt(paymentDueDateSplit[1]) - 1, 1, 0, 0, 0, 0);
            } else {
                paymentDueDate = moment(this.changeDate(paymentsArr[i].dueDate)).format("MM.YYYY");
            }
            for (let j = 1; j < preparedArrayForLineChart.length; j++) {
                if (navigator.userAgent.indexOf("Firefox") !== -1 || navigator.userAgent.indexOf("Safari") !== -1) {
                    if (preparedArrayForLineChart[j][0].valueOf() === dateHelp.valueOf()) {
                        preparedArrayForLineChart[j][(paymentsArr[i].categoryId + 1)] += paymentsArr[i].value.amount;
                    }
                } else {
                    if (preparedArrayForLineChart[j][0] === paymentDueDate) {
                        preparedArrayForLineChart[j][(paymentsArr[i].categoryId + 1)] += paymentsArr[i].value.amount;
                    }
                }
            }
        }

        let emptyCats = this.checkEmptyColumns(preparedArrayForLineChart);
        return this.deleteEmptyColumns(emptyCats, preparedArrayForLineChart);
    }

    getOldestAndNewestPayment(paymentsArr) {
        let newestDate;
        let oldestDate;

        if (paymentsArr.length > 0) {
            if (navigator.userAgent.indexOf("Firefox") !== -1 || navigator.userAgent.indexOf("Safari") !== -1) {
                let dateSplit = paymentsArr[0].dueDate.split(".");
                oldestDate = new Date(parseInt(dateSplit[2]), (dateSplit[1] - 1) % 12, parseInt(dateSplit[0]));
                newestDate = new Date(parseInt(dateSplit[2]), (dateSplit[1] - 1) % 12, parseInt(dateSplit[0]));
            } else {
                oldestDate = moment(this.changeDate(paymentsArr[0].dueDate));
                newestDate = moment(this.changeDate(paymentsArr[0].dueDate));
            }
        } else {
            if (navigator.userAgent.indexOf("Firefox") !== -1) {
                oldestDate = new Date();
                newestDate = new Date();
            } else {
                oldestDate = moment();
                newestDate = moment();
            }
        }

        let differenceMonth;
        for (let i = 0; i < paymentsArr.length; i++) {

            if (navigator.userAgent.indexOf("Firefox") !== -1 || navigator.userAgent.indexOf("Safari") !== -1) {
                let payDateSplit = paymentsArr[i].dueDate.split(".");
                let payDate = new Date(parseInt(payDateSplit[2]),
                    (payDateSplit[1] - 1) % 12, parseInt(payDateSplit[0]));

                if (oldestDate >= payDate) {
                    oldestDate = payDate;
                }
                if (newestDate <= payDate) {
                    newestDate = payDate;
                }
            } else {
                if (oldestDate >= moment(this.changeDate(paymentsArr[i].dueDate))) {
                    oldestDate = moment(this.changeDate(paymentsArr[i].dueDate));
                }
                if (newestDate <= moment(this.changeDate(paymentsArr[i].dueDate))) {
                    newestDate = moment(this.changeDate(paymentsArr[i].dueDate));
                }
            }
        }
        if (navigator.userAgent.indexOf("Firefox") !== -1 || navigator.userAgent.indexOf("Safari") !== -1) {
            differenceMonth = moment(newestDate).diff(moment(oldestDate), 'months', false);
            return [moment(oldestDate).format("DD.MM.YYYY"), moment(newestDate).format("DD.MM.YYYY"),
                differenceMonth + 1];
        } else {
            differenceMonth = newestDate.diff(oldestDate, 'months', false);
            return [oldestDate.format("DD.MM.YYYY"), newestDate.format("DD.MM.YYYY"),
                differenceMonth + 1];
        }
    }

    prepareArrayForLineChart(numberOfMonths, arrayOld) {
        let dataForChart = [];
        let tmp2 = this.changeDate(arrayOld);
        let month = Number.parseInt(tmp2.split(".")[1]);
        let year = Number.parseInt(tmp2.split(".")[0]);

        dataForChart.push(["Datum", "Nezařazeno", "Jídlo", "Oblečení", "Cestování", "Hygiena", "Bydlení"]);
        for (let i = 0; i < numberOfMonths; i++) {
            if (navigator.userAgent.indexOf("Firefox") !== -1 || navigator.userAgent.indexOf("Safari") !== -1) {
                let dateHelp = new Date(year, month - 1, 1, 0, 0, 0, 0);
                dataForChart.push([dateHelp, 0, 0, 0, 0, 0, 0]);
                month += 1;
            } else {
                dataForChart.push([moment(tmp2).add(i, "month").format("MM.YYYY"), 0, 0, 0, 0, 0, 0]);
            }
        }
        return dataForChart;
    }

    changeDate(date) {
        let tmp = date.toString().split(".");
        return tmp[2] + "." + tmp[1] + "." + tmp[0];
    }

    checkEmptyColumns(array) {
        let indexOfEmptyColumn = [];
        for (let j = 0; j < array[0].length; j++) {
            if (array[1][j] === 0) {
                let toDeleted = true;
                for (let i = 2; i < array.length; i++) {
                    if (array[i][j] !== 0) {
                        toDeleted = false;
                    }
                }
                if (toDeleted) {
                    indexOfEmptyColumn.push(j - 1);
                }
            }
        }

        for (let i = 0; i < indexOfEmptyColumn.length; i++) {
            switch (indexOfEmptyColumn[i]) {
                case 0:
                    indexOfEmptyColumn[i] = "Nezařazeno";
                    break;
                case 1:
                    indexOfEmptyColumn[i] = "Jídlo";
                    break;
                case 2:
                    indexOfEmptyColumn[i] = "Oblečení";
                    break;
                case 3:
                    indexOfEmptyColumn[i] = "Cestování";
                    break;
                case 4:
                    indexOfEmptyColumn[i] = "Hygiena";
                    break;
                case 5:
                    indexOfEmptyColumn[i] = "Bydlení";
                    break;
                default:
                    indexOfEmptyColumn[i] = "Nezařazeno";
                    break;
            }
        }
        return indexOfEmptyColumn;
    }

    deleteEmptyColumns(arrayOfColsToBeDeleted, array2D) {
        for (let j = 0; j < arrayOfColsToBeDeleted.length; j++) {
            for (let i = 1; i < array2D[0].length; i++) {
                if (array2D[0][i] === arrayOfColsToBeDeleted[j]) {
                    for (let k = 0; k < array2D.length; k++) {
                        array2D[k].splice(i, 1);
                    }
                }
            }
        }
        return array2D;
    }
}

export default Charts;
