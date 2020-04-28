import React, {Component} from 'react';
import API_Calls from "../js/apiCalls";
import logo from "../img/logo.png";
import Categories from "./Categories";
import '../css/MainPage.css';
import Modal from "./Modal";
import PieChartSelected from "./PieChartSelected";
import PieChartAll from "./PieChartAll";
import LineChartSelected from "./LineChartSelected";
import ReactPaginate from 'react-paginate';
import moment from "moment";

export default class MainPage extends Component {
    constructor(props) {
        super(props);

        let datefrom, dateto;
        // set dateTo to current Day
        dateto = new Date().toISOString().substr(0, 10);
        // set dateFrom to first Day of current Month
        datefrom = dateto.substr(0, 8) + "01";

        this.state = {
            payments: [],
            paymentsAll: [],
            currentPagePayments: [],
            currencyRate: [],
            checkedCategories: "",
            currencyState: "CZK",
            dateTo: dateto,
            dateFrom: datefrom,
            pageSize: 5,
            currentPage: 0,
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

    async componentDidMount() {
        try {
            let result = await API_Calls.getPaymentsByDateByUser(this.state.dateFrom, this.state.dateTo, this.props.user.userAccount.accountNumber_user);
            let resultAll = await API_Calls.getPaymentsByUser(this.props.user.userAccount.accountNumber_user);
            this.updateData(result);
            this.setState({paymentsAll: resultAll});

            fetch('http://data.fixer.io/api/latest?access_key=f8b5504f1235a75a4b50a6ab2c986fb1')
                .then(res => res.json())
                .then((data) => {
                    this.setState({currencyRate: data.rates})
                })
                .catch(console.log)

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
                            <div
                                className="userAccountNumber">{this.props.user.userAccount.prefix_user}-{this.props.user.userAccount.accountNumber_user}/{this.props.user.userAccount.bankCode_user}</div>
                            <div className="logout_button btn btn-sm btn-link p-0"
                                 onClick={this.props.onLogout}>Odhlásit se
                            </div>
                        </div>
                    </div>
                </header>
                <Categories onCheckedCategoryChanged={this.handleCategories}/>
                <div className="payments">
                    <div className="dates">
                        <div className="mx-auto d-block">
                            <div>
                                <label htmlFor="dateFrom">Platby&nbsp;od: </label>
                                <input type="date" required className="form-control form-control-sm"
                                       id="dateFrom" max={this.state.dateTo} name="dateFrom"
                                       value={this.state.dateFrom} onChange={this.handleDateFromChange}/>
                            </div>
                            <div>
                                <label htmlFor="dateTo">do: </label>
                                <input type="date" required className="form-control form-control-sm"
                                       id="dateTo" name="dateTo" min={this.state.dateFrom}
                                       value={this.state.dateTo} onChange={this.handleDateToChange}/>
                            </div>
                            <div>
                                <label htmlFor="currency">Měna: </label>
                                <select id="currency_input" className="form-control form-control-sm"
                                        name="currency_input"
                                        onChange={(val) =>
                                            this.onCurrencyChange(val.target.value)}>
                                    <option value="CZK">CZK</option>
                                    <option value="EUR">EUR</option>
                                    <option value="NON">Nespecifikováno</option>
                                </select>
                            </div>
                        </div>
                    </div>
                    {this.renderPaymentData2()}

                </div>
                <Modal onSubmitModal={this.onSummitModal}/>
                <hr className="divider"/>
                <div className="overview">
                    <span className="overviewValues">
                        <div className="overviewDetail">Počet plateb: {this.state.payments.length}</div>
                        <div className="overviewDetail">Suma: {this.calculatePaymentSum()} Kč</div>
                        <div className="overviewDetail">Interval: od {this.state.dateFrom} do {this.state.dateTo}</div>
                    </span>
                </div>
                <hr className="divider"/>
                <div className="charts">
                    <PieChartAll categorySummaryAll={this.getCategorySummaryAll()}/>
                    <PieChartSelected categorySummarySelected={this.getCategorySummarySelected()}/>
                    <LineChartSelected lineChartData={this.getDataForLineChart()}/>
                </div>

            </div>
        )
    }

    renderPaymentData2() {
        let paginationElement;
        if (this.state.pageCount > 1) {
            paginationElement = (
                <ReactPaginate pageCount={this.state.pageCount} previousLabel={"← Předchozí"}
                               nextLabel={"Následující →"}
                               breakLabel={<span className="gap">...</span>}
                               onPageChange={this.handlePageClick} forcePage={this.state.currentPage}
                               containerClassName={"pagination"}
                               previousLinkClassName={"previous_page"} nextLinkClassName={"next_page"}
                               disabledClassName={"disabled"} activeClassName={"active"}
                               initialPage={this.state.currentPage}/>)
        }
        return (<div>
            {this.state.currentPagePayments}
            {paginationElement}
        </div>)
    }

    renderPaymentAmount(amount, currentCurrency, requestedCurrency, rate) {
        if (requestedCurrency === "CZK" && currentCurrency === "EUR") {
            return <div
                className="payment_amount"> {Math.round((Number.parseInt(amount) * Number.parseInt(rate)) * 100) / 100 + " " + requestedCurrency}</div>
        } else if (requestedCurrency === "EUR" && currentCurrency === "CZK") {
            return <div
                className="payment_amount"> {Math.round((Number.parseInt(amount) / Number.parseInt(rate)) * 100) / 100 + " " + requestedCurrency} </div>
        } else {
            return <div className="payment_amount"> {amount + " " + currentCurrency}</div>
        }
    }

    setElementsForCurrentPage() {
        let sliceFrom = this.state.currentPage === 0 ? 0 : this.state.currentPage * this.state.pageSize;
        let sliceTo = this.state.currentPage === 0 ? (this.state.pageSize) : (this.state.currentPage * this.state.pageSize) + this.state.pageSize;
        let elements = this.state.payments
            .slice(sliceFrom, sliceTo)
            .map((payment, index) => {
                return (
                    <div className="payment" key={payment.id}>
                        <div className="payment_left">
                            <div
                                className="payment_name">{payment.partyAccount.prefix}-{payment.partyAccount.accountNumber}/{payment.partyAccount.bankCode}</div>
                            <span className="payment_category">Kategorie: </span>
                            <select id="cats_input" className="form-control form-control-sm" name="cats_input"
                                    onChange={(e) => this.onCatsInputChange(payment, index, e)}
                                    value={payment.categoryId}>
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
                            <div className="payment_date">Datum uskutečnění platby: {payment.dueDate}</div>
                        </div>
                        <div className="payment_right">
                            {this.renderPaymentAmount(payment.value.amount, payment.value.currency, this.state.currencyState,
                                this.state.currencyRate.CZK)}
                        </div>
                    </div>
                )
            });
        this.setState({currentPagePayments: elements});
    }

    updateData(payments) {
        this.setState({
            payments: payments,
            currentPage: 0,
            pageCount: Math.ceil(payments.length / this.state.pageSize)
        }, () => this.setElementsForCurrentPage());
    }

    async updateTable(dateFrom, dateTo, categoryIds) {
        try {
            let result = await API_Calls.getPaymentsByDateByCategoryByUser(this.state.dateFrom, this.state.dateTo, this.props.user.userAccount.accountNumber_user, categoryIds);
            this.updateData(result);
        } catch (error) {
            this.setState({error: error});
        }
    }

    async updateTableNoCategory(dateFrom, dateTo) {
        try {
            let result = await API_Calls.getPaymentsByDateByUser(dateFrom, dateTo, this.props.user.userAccount.accountNumber_user);
            this.updateData(result);
        } catch (error) {
            this.setState({error: error});
        }
    }

    async onSummitModal(newPayment) {
        // new payments are from current logged user
        newPayment.userAccount.prefix_user = +this.props.user.userAccount.prefix_user;
        newPayment.userAccount.accountNumber_user = +this.props.user.userAccount.accountNumber_user;
        newPayment.userAccount.bankCode_user = +this.props.user.userAccount.bankCode_user;

        let new_Payment = await API_Calls.postPayment(newPayment);

        this.updateData(this.state.payments.concat([new_Payment]));
        this.setState({
            paymentsAll: this.state.paymentsAll.concat([new_Payment]),
        })
    }

    async onCatsInputChange(editedPayment, index, e) {
        editedPayment.categoryId = +e.target.value;
        await API_Calls.updatePayment(editedPayment);

        let temp = this.state.payments.slice();
        temp[index] = editedPayment;
        this.updateData(temp);

        temp = this.state.paymentsAll.slice();
        for (let i = 0; i < temp.length; i++) {
            if (temp[i].id === editedPayment.id) {
                temp[i] = editedPayment;
            }
        }
        this.setState({paymentsAll: temp});

        this.handleCategories(this.state.checkedCategories)
    }

    calculatePaymentSum() {
        let sum = 0.0;
        this.state.payments.forEach((payment) => {
            sum += payment.value.amount;
        });
        return (sum);
    }

    handlePageClick = (data) => {
        this.setState({currentPage: data.selected}, () => {
            this.setElementsForCurrentPage();
            this.render();
        });
    }

    onCurrencyChange(currency) {
        this.setState({currencyState: currency});
        if (this.state.checkedCategories.length > 0) {
            this.updateTable(this.state.dateFrom, this.state.dateTo, this.state.checkedCategories);
        } else {
            this.updateTableNoCategory(this.state.dateFrom, this.state.dateTo);
        }
    }

    handleCategories = (categoriesValue) => {
        this.setState({checkedCategories: categoriesValue});
        if (categoriesValue.length > 0) {
            this.updateTable(this.state.dateFrom, this.state.dateTo, categoriesValue);
        } else {
            this.updateTableNoCategory(this.state.dateFrom, this.state.dateTo);
        }
    };

    handleDateFromChange(e) {
        const value = e.target.value;
        this.setState({dateFrom: value});
        if (this.state.checkedCategories.length > 0) {
            this.updateTable(value, this.state.dateTo, this.state.checkedCategories);
        } else {
            this.updateTableNoCategory(value, this.state.dateTo);
        }
    }

    handleDateToChange(e) {
        const value = e.target.value;
        this.setState({dateTo: value});
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

