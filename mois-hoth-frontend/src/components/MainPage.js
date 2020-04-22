import React, {Component} from 'react';
import API_Calls from "../js/apiCalls";
import logo from "../logo.svg";
import Categories from "./Categories";
import '../css/MainPage.css';
import Modal from "./Modal";
import PieChartSelected from "./PieChartSelected";
import PieChartAll from "./PieChartAll";
import LineChartSelected from "./LineChartSelected";
import moment from "moment";

export default class MainPage extends Component {

    constructor(props) {
        super(props);

        let datefrom, dateto;
        // set dateTo to current Day
        dateto = new Date().toISOString().substr(0, 10);
        // set dateFrom to first Day of current Month
        datefrom = dateto.substr(0, 8)+"01";

        this.state = {
            payments: [],
            paymentsAll: [],
            checkedCategories: "",
            dateTo: dateto,
            dateFrom: datefrom
        };
        this.handleCategories = this.handleCategories.bind(this);
        this.onSummitModal = this.onSummitModal.bind(this);
        this.getCategorySummarySelected = this.getCategorySummarySelected.bind(this);
        this.getCategorySummaryAll = this.getCategorySummaryAll.bind(this);
        this.getDataForLineChart = this.getDataForLineChart.bind(this);
        this.handleDateFromChange = this.handleDateFromChange.bind(this);
        this.handleDateToChange = this.handleDateToChange.bind(this);
        this.onCatsInputChange = this.onCatsInputChange.bind(this);
    }

    handleCategories = (categoriesValue) => {
        this.setState({checkedCategories: categoriesValue});
        if (categoriesValue.length > 0) {
            this.updateTable(this.state.dateFrom, this.state.dateTo, categoriesValue);
        } else {
            this.updateTableNoCategory(this.state.dateFrom, this.state.dateTo);
        }
    };

    async updateTable(dateFrom, dateTo, categoryIds) {
        try {
            let result = await API_Calls.getPaymentsByDateByCategoryByUser(this.state.dateFrom, this.state.dateTo, this.props.user.userAccount.accountNumber_user, categoryIds);
            this.setState({payments: result});
        } catch (error) {
            this.setState({error: error});
        }
    }

    async componentDidMount() {
        try {
            let result = await API_Calls.getPaymentsByDateByUser(this.state.dateFrom, this.state.dateTo, this.props.user.userAccount.accountNumber_user);
            let resultAll = await API_Calls.getPaymentsByUser(this.props.user.userAccount.accountNumber_user);
            this.setState({payments: result});
            this.setState({paymentsAll: resultAll});
        } catch (error) {
            this.setState({error: error});
        }
    }

    async updateTableNoCategory(dateFrom, dateTo) {
        try {
            let result = await API_Calls.getPaymentsByDateByUser(dateFrom, dateTo, this.props.user.userAccount.accountNumber_user);
            this.setState({payments: result});
        } catch (error) {
            this.setState({error: error});
        }
    }

    render() {
        return (
            <div className="MainPage">
                <header className="App-header">
                    <div className="userPanel">
                        <div className="userLogo"><img src={logo} className="App-logo" alt="logo"/></div>
                        <div className="userInfo">
                            <div className="userName">{this.props.user.name} {this.props.user.sure_name}</div>
                            <div className="userAccountNumber">{this.props.user.userAccount.prefix_user}-{this.props.user.userAccount.accountNumber_user}/{this.props.user.userAccount.bankCode_user}</div>
                            <div className="logout_button"><a href=".">Odhlásit se</a></div>
                        </div>
                    </div>
                    <Categories onCheckedCategoryChanged={this.handleCategories}/>
                </header>

                <Modal onSubmitModal={this.onSummitModal}/>

                <div className="payments">
                    <div className="dates">
                        <label htmlFor="dateFrom">Platby od: </label>
                        <input type="date" required id="dateFrom" max={this.state.dateTo} name="dateFrom" value={this.state.dateFrom} onChange={this.handleDateFromChange} />
                        <label htmlFor="dateTo">do: </label>
                        <input type="date" required id="dateTo" name="dateTo" min={this.state.dateFrom} value={this.state.dateTo} onChange={this.handleDateToChange} />
                    </div>
                    {this.renderPaymentData2()}
                </div>

                <div className="charts">
                    <PieChartAll categorySummaryAll={this.getCategorySummaryAll()}/>
                    <PieChartSelected categorySummarySelected={this.getCategorySummarySelected()}/>
                </div>
                <LineChartSelected lineChartData={this.getDataForLineChart()}/>
            </div>
        )
    }

   async onSummitModal(newPayment) {
        // new payments are from current logged user
        newPayment.userAccount = this.props.user.userAccount;

        let new_Payment = await API_Calls.postPayment(newPayment);
        this.setState({
           payments: this.state.payments.concat([new_Payment]),
       });
       this.setState({
           paymentsAll: this.state.paymentsAll.concat([new_Payment]),
       })
    }


    renderPaymentData2() {
        return this.state.payments.map((payment, index) => {
            return (
                <div className="payment" key={payment.id}>
                    <div className="payment_left">
                        <div className="payment_name">{payment.partyAccount.prefix}-{payment.partyAccount.accountNumber}/{payment.partyAccount.bankCode}</div>
                        <span className="payment_category">Kategorie: </span>
                        <select id="cats_input" name="cats_input" onChange={(e) => this.onCatsInputChange(payment, index, e)} value={payment.categoryId} >
                            <option value="0">Nezařazeno</option>
                            <option value="1">Jídlo</option>
                            <option value="2">Oblečení</option>
                            <option value="3">Cestování</option>
                            <option value="4">Hygiena</option>
                            <option value="5">Bydlení</option>
                        </select>
                    </div>
                    <div className="payment_middle">
                        <div className="payment_VS">Variabilní symbol: {payment.additionalInfo.variableSymbol}</div>
                        <div className="payment_date">Termín splatnosti: {payment.dueDate}</div>
                    </div>
                    <div className="payment_right">
                        <div className="payment_amount">{payment.value.amount} Kč</div>
                    </div>
                </div>
            )
        })
    }

    async onCatsInputChange(editedPayment, index, e) {
        editedPayment.categoryId = +e.target.value;
        await API_Calls.updatePayment(editedPayment);

        let temp = this.state.payments.slice();
        temp[index] = editedPayment;
        this.setState({payments: temp});

        temp = this.state.paymentsAll.slice();
        for(let i = 0; i < temp.length; i++) {
            if(temp[i].id === editedPayment.id) {
                temp[i] = editedPayment;
            }
        }
        this.setState({paymentsAll: temp});
    }

    handleDateFromChange(e) {
        const value = e.target.value;
        this.setState( {dateFrom: value});
        if (this.state.checkedCategories.length > 0) {
            this.updateTable(value, this.state.dateTo, this.state.checkedCategories);
        } else {
            this.updateTableNoCategory(value, this.state.dateTo);
        }
    }

    handleDateToChange(e) {
        const value = e.target.value;
        this.setState( {dateTo: value});
        if (this.state.checkedCategories.length > 0) {
            this.updateTable(this.state.dateFrom, value, this.state.checkedCategories);
        } else {
            this.updateTableNoCategory(this.state.dateFrom, value);
        }
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

        let oldestNewestArray = this.getOldestAndNewestPayment(paymentsArr);
        let preparedArrayForLineChart = this.prepareArrayForLineChart(oldestNewestArray[2],oldestNewestArray[0]);
        console.log(preparedArrayForLineChart);

        for (let i=0; i<paymentsArr.length; i++) {
            paymentDueDate = moment(this.changeDate(paymentsArr[i].dueDate)).format( "MM.YYYY");
            for (let j=1; j<preparedArrayForLineChart.length; j++) {
                console.log("hovnohovno"+ preparedArrayForLineChart[j][0] + "  "+ paymentDueDate);
                if (preparedArrayForLineChart[j][0]===paymentDueDate){
                    console.log("hovno");
                    preparedArrayForLineChart[j][(paymentsArr[i].categoryId + 1)] += paymentsArr[i].value.amount;
                }
            }
        }
        return preparedArrayForLineChart;
    }

    getOldestAndNewestPayment(paymentsArr) {
        let newestDate;
        let oldestDate;
        if (paymentsArr.length > 0) {
            oldestDate = moment(this.changeDate(paymentsArr[0].dueDate));
            newestDate = moment(this.changeDate(paymentsArr[0].dueDate));
        } else {
            oldestDate = moment();
            newestDate = moment();
        }

        let differenceMonth;
        for (let i = 0; i < paymentsArr.length; i++) {
            if (oldestDate >= moment(this.changeDate(paymentsArr[i].dueDate))) {
                oldestDate = moment(this.changeDate(paymentsArr[i].dueDate));
            }
            if (newestDate <= moment(this.changeDate(paymentsArr[i].dueDate))) {
                newestDate =  moment(this.changeDate(paymentsArr[i].dueDate));
            }
        }
        differenceMonth = newestDate.diff(oldestDate, 'months', false);
        return [oldestDate.format("DD.MM.YYYY"), newestDate.format("DD.MM.YYYY"), differenceMonth+1];
    }

    prepareArrayForLineChart(numberOfMonths, arrayOld) {
        let dataForChart = [];
        //TODO rename
        dataForChart.push(["Datum","Nezařezeno","Jídlo","Oblečení","Cestování","Hygiena","Bydlení"]);
        for (let i = 0; i < numberOfMonths; i++) {

            let tmp2 = this.changeDate(arrayOld);
            dataForChart.push([moment(tmp2).add(i, "month").format("MM.YYYY"),0,0,0,0,0,0]);
        }
        return dataForChart;
    }

    changeDate(date) {
        let tmp = date.toString().split(".");
        let tmp2 = tmp[2]+"."+tmp[1]+"."+tmp[0];
        return tmp2;
    }
}

