import React, {Component} from 'react';
import API_Calls from "../js/apiCalls";
import logo from "../logo.svg";
import Categories from "./Categories";
import '../css/MainPage.css';
import Modal from "./Modal";
import PieChartSelected from "./PieChartSelected";
import PieChartAll from "./PieChartAll";
import LineChartSelected from "./LineChartSelected";

export default class MainPage extends Component {

    constructor(props) {
        super(props);
        this.state = {
            payments: [],
            paymentsAll: [],
            checkedCategories: "",
        };
        this.handleCategories = this.handleCategories.bind(this);
        this.onSummitModal = this.onSummitModal.bind(this);
        this.getCategorySummarySelected = this.getCategorySummarySelected.bind(this);
        this.getCategorySummaryAll = this.getCategorySummaryAll.bind(this);
        this.getDataForLineChart = this.getDataForLineChart.bind(this);
    }

    handleCategories = (categoriesValue) => {
        this.setState({checkedCategories: categoriesValue});
        if (categoriesValue.length > 0) {
            this.updateTable(categoriesValue);
        } else {
            this.componentDidMount();
        }
    };

    async updateTable(categoryIds) {
        try {
            let result = await API_Calls.getPaymentsByCategoryUser(categoryIds, this.props.user.userAccount.accountNumber_user);
            this.setState({payments: result});
        } catch (error) {
            this.setState({error: error});
        }
    }

    async componentDidMount() {
        try {
            let result = await API_Calls.getPaymentsByUser(this.props.user.userAccount.accountNumber_user);
            this.setState({payments: result});
            this.setState({paymentsAll: result});
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

              {/*  <table className="Table">
                    <thead>
                    <tr>
                        <th>Id</th>
                        <th>Číslo účtu příjemce</th>
                        <th>Kategorie</th>
                        <th>Částka</th>
                        <th>Variabilní symbol</th>
                        <th>Termín splatnosti</th>
                    </tr>
                    </thead>

                    <tbody>
                    {this.renderPaymentData()}
                    </tbody>
                </table>*/}

                <Modal onSubmitModal={this.onSummitModal}/>

                <div className="payments">
                    <h5>Platby od: 1.1.2019 do 31.12.2019</h5>
                    {this.renderPaymentData2()}
                </div>

                <PieChartAll categorySummaryAll={this.getCategorySummaryAll()}/>
                <PieChartSelected categorySummarySelected={this.getCategorySummarySelected()}/>
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
       })
       this.setState({
           paymentsAll: this.state.paymentsAll.concat([new_Payment]),
       })
    }

    renderPaymentData() {
        return this.state.payments.map((payment, index) => {
            return (
                <tr key={payment.id}>
                    <td>{payment.id}</td>
                    <td>{payment.partyAccount.prefix}-{payment.partyAccount.accountNumber}/{payment.partyAccount.bankCode}</td>
                    <td>{payment.categoryId}</td>
                    <td>{payment.value.amount}</td>
                    <td>{payment.additionalInfo.variableSymbol}</td>
                    <td>{payment.dueDate}</td>
                </tr>
            )
        })
    }

    renderPaymentData2() {
        return this.state.payments.map((payment, index) => {
            return (
                <div className="payment" key={payment.id}>
                    <div className="payment_left">
                        <div className="payment_name">{payment.partyAccount.prefix}-{payment.partyAccount.accountNumber}/{payment.partyAccount.bankCode}</div>
                        <div className="payment_category">Kategorie: {payment.categoryId}</div>
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
        //should be only from last 6 months
        let paymentsArr = this.state.payments;
        let splitDateArray = [];
        let result = [];
        let indexOfEmptyColumn = [];
        let moment = require('moment');

        let monthDateNow = moment().format('MM');
        let monthDateNow1 = moment().subtract(1, 'months').format('MM');
        let monthDateNow2 = moment().subtract(2, 'months').format('MM');
        let monthDateNow3 = moment().subtract(3, 'months').format('MM');
        let monthDateNow4 = moment().subtract(4, 'months').format('MM');
        let monthDateNow5 = moment().subtract(5, 'months').format('MM');

        let month0 = [monthDateNow5,0,0,0,0,0,0],
            month1 = [monthDateNow4,0,0,0,0,0,0],
            month2 = [monthDateNow3,0,0,0,0,0,0],
            month3 = [monthDateNow2,0,0,0,0,0,0],
            month4 = [monthDateNow1,0,0,0,0,0,0],
            month5 = [monthDateNow,0,0,0,0,0,0];

        for (let i = 0; i < paymentsArr.length; i++) {
            splitDateArray = paymentsArr[i].dueDate.toString().split(".");

            switch (splitDateArray[1]) {
                case monthDateNow5:
                    month0 = this.getArrayForMonthCategory(month0, paymentsArr[i].categoryId,
                        paymentsArr[i].value.amount);
                    break;
                case monthDateNow4:
                    month1 = this.getArrayForMonthCategory(month1, paymentsArr[i].categoryId,
                        paymentsArr[i].value.amount);
                    break;
                case monthDateNow3:
                    month2 = this.getArrayForMonthCategory(month2, paymentsArr[i].categoryId,
                        paymentsArr[i].value.amount);
                    break;
                case monthDateNow2:
                    month3 = this.getArrayForMonthCategory(month3, paymentsArr[i].categoryId,
                        paymentsArr[i].value.amount);
                    break;
                case monthDateNow1:
                    month4 = this.getArrayForMonthCategory(month4, paymentsArr[i].categoryId,
                       paymentsArr[i].value.amount);
                    break;
                case monthDateNow:
                    month5 = this.getArrayForMonthCategory(month5, paymentsArr[i].categoryId,
                        paymentsArr[i].value.amount);
                    break;
                default:

            }
        }

        result = [["Měsíce", "Nezařazeno","Jídlo","Oblečení","Cestování", "Hygiena", "Bydlení"],
            month0, month1, month2, month3, month4, month5];
        indexOfEmptyColumn = this.checkEmptyColumns(result);
        return this.deleteEmptyColumns(indexOfEmptyColumn,result);
    }

    getArrayForMonthCategory(monthArrPar, paymentCategory, paymentAmount) {
        if (paymentCategory === 0) monthArrPar[1] += parseInt(paymentAmount);
        else if (paymentCategory === 1) monthArrPar[2] += parseInt(paymentAmount);
        else if (paymentCategory === 2) monthArrPar[3] += parseInt(paymentAmount);
        else if (paymentCategory === 3) monthArrPar[4] += parseInt(paymentAmount);
        else if (paymentCategory === 4) monthArrPar[5] += parseInt(paymentAmount);
        else if (paymentCategory === 5) monthArrPar[6] += parseInt(paymentAmount);
        return monthArrPar;
    }

    checkEmptyColumns(array) {
        let indexOfEmptyColumn = [];
        for (let j = 0; j<array[0].length; j++) {
            if (array[1][j] === 0){
                if (array[2][j]===0 &&
                    array[3][j]===0 &&
                    array[4][j]===0 &&
                    array[5][j]===0) {
                    indexOfEmptyColumn.push(j);
                }
            }
        }
        return indexOfEmptyColumn;
    }

    deleteEmptyColumns(arrayOfColsToBeDeleted, array2D) {
        for (let j = 0; j < arrayOfColsToBeDeleted.length; j++) {
            for (let i = 0; i < array2D.length; i++) {
                array2D[i].splice(arrayOfColsToBeDeleted[j],1);
            }
        }
        return array2D;
    }
}

