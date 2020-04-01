import React, { Component } from 'react';
import '../css/Table.css';
import API_Calls from "../js/apiCalls";

export default class CategoryHygiena extends Component {
    constructor(props) {
        super(props)
        this.state = {
            payments: []
        };
    }

    async componentDidMount() {
        try {
            let result = await API_Calls.getAllPayments();
            this.setState({ payments: result});
        } catch (error) {
            this.setState({ error:error });
        }
    }

    render() {
        return (
            <div>
                <h2>Hygiena</h2>
                <table class="Table">
                    <tr>
                        <th>Id</th><th>Číslo účtu příjemce</th><th>Kategorie</th><th>Částka</th><th>Variabilní symbol</th><th>Termín splatnosti</th>
                    </tr>

                    {this.renderPaymentData()}

                </table>
            </div>
        );
    }

    renderPaymentData() {
        return this.state.payments.map((payment, index) => {
            return (
                <tr key={payment.id}>
                    <td>{payment.id}</td><td>{payment.partyAccount.prefix}-{payment.partyAccount.accountNumber}/{payment.partyAccount.bankCode}</td>
                    <td>{payment.categoryId}</td>
                    <td>{payment.value.amount}</td><td>{payment.additionalInfo.variableSymbol}</td><td>{payment.dueDate}</td>
                </tr>
            )
        })
    }
}

