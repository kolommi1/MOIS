import React, {Component} from 'react';
import API_Calls from "../js/apiCalls";
import logo from "../logo.svg";
import Categories from "./Categories";

export default class MainPage extends Component {
    constructor(props) {
        super(props);
        this.state = {
            payments: [],
            checkedCategories: "",
        };
        this.handleCategories = this.handleCategories.bind(this);
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
            let result = await API_Calls.getPaymentsByCategory(categoryIds);
            this.setState({payments: result});
        } catch (error) {
            this.setState({error: error});
        }
    }

    async componentDidMount() {
        try {
            let result = await API_Calls.getAllPayments();
            this.setState({payments: result});
        } catch (error) {
            this.setState({error: error});
        }
    }

    render() {
        return (
            <div className="MainPage">
                <header className="App-header">
                    <img src={logo} className="App-logo" alt="logo"/>
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
            </div>
        )
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

}

