import React, {Component} from 'react';
import API_Calls from "../js/apiCalls";
import logo from "../logo.svg";
import Categories from "./Categories";
import '../css/MainPage.css';
import Modal from "./Modal";

export default class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            payments: [],
            checkedCategories: "",
        };
        this.handleCategories = this.handleCategories.bind(this);
        this.onSummitModal = this.onSummitModal.bind(this);
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
            let result = await API_Calls.getPaymentsByCategoryUser(categoryIds, this.props.user.userAccount.number);
            this.setState({payments: result});
        } catch (error) {
            this.setState({error: error});
        }
    }

    async componentDidMount() {
        try {
            let result = await API_Calls.getPaymentsByUser(this.props.user.userAccount.number);
            this.setState({payments: result});
        } catch (error) {
            this.setState({error: error});
        }
    }

    render() {
        return (
            <div className="MainPage">
                <header className="App-header">
                    <div class="userPanel">
                        <div class="userLogo"><img src={logo} className="App-logo" alt="logo"/></div>
                        <div class="userInfo">
                            <div class="userName">{this.props.user.name} {this.props.user.sure_name}</div>
                            <div class="userAccountNumber">{this.props.user.userAccount.prefix_user}-{this.props.user.userAccount.number}/{this.props.user.userAccount.bankCode_user}</div>
                            <div class="logout_button"><a href=".">Odhlásit se</a></div>
                        </div>
                    </div>
                    <div class="divider"></div>
                    <Categories onCheckedCategoryChanged={this.handleCategories}/>
                </header>

                <table className="Table">
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
                </table>

             {/*   <Modal onSubmitModal={this.onSummitModal}></Modal>*/}

                <div class="payments">
                    <h5>Platby od: 1.1.2019 do 31.12.2019</h5>

                    {this.renderPaymentData2()}
                </div>
            </div>
        )
    }

    onSummitModal(){
        // Call. post Payment

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
                <div class="payment" key={payment.id}>
                    <div class="payment_left">
                        <div class="payment_name">{payment.partyAccount.prefix}-{payment.partyAccount.accountNumber}/{payment.partyAccount.bankCode}</div>
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

}

