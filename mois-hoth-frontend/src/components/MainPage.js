import React, {Component} from 'react';
import API_Calls from "../js/apiCalls";
import logo from "../img/logo.png";
import Categories from "./Categories";
import '../css/MainPage.css';
import Modal from "./Modal";
import ReactPaginate from 'react-paginate';
import Charts from "./charts/Charts";

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
                <Charts payments={this.state.payments} paymentsAll={this.state.paymentsAll}/>

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
                            <div className="d-flex flex-wrap mx-auto">
                                <span className="payment_category">Kategorie: </span>
                                <select id="cats_input" className="cats-input form-control form-control-sm"
                                        name="cats_input"
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

}

