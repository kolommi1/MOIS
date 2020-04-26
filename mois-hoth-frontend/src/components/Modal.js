import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/dist/modal.js';
class Modal extends Component {

    constructor(props) {
        super(props);
        this.state = {
            payment: {
                "value": {
                    "amount": 0,
                    "currency": ""
                },
                "userAccount": {
                    "prefix_user": 0,
                    "accountNumber_user": 0,
                    "bankCode_user": 0
                },
                "partyAccount": {
                    "prefix": 0,
                    "accountNumber": 0,
                    "bankCode": 0
                },
                "dueDate": "",
                "recurringPayment": {
                    "firstPayment": "First payment",
                    "lastPayment": "Last payment",
                    "interval": "WEEK"
                },
                "payeeMessage": "",
                "payerMessage": "",
                "categoryId": 0,
                "additionalInfo": {
                    "constantSymbol": 0,
                    "variableSymbol": 0,
                    "specificSymbol": 0
                },
                "id": "",
                "editableByUser": true,
                "realizationStatus": "RTS_REALISED"
            },
        };

        this.onSubmitModal = this.onSubmitModal.bind(this);
        this.handleAmountChange = this.handleAmountChange.bind(this);
        this.handleCurrChange = this.handleCurrChange.bind(this);
        this.handlePrefixChange = this.handlePrefixChange.bind(this);
        this.handleAccNumberChange = this.handleAccNumberChange.bind(this);
        this.handleBankCodeChange = this.handleBankCodeChange.bind(this);
        this.handleVSChange = this.handleVSChange.bind(this);
        this.handleCSChange = this.handleCSChange.bind(this);
        this.handleSSChange = this.handleSSChange.bind(this);
        this.handlePayeeMessChange = this.handlePayeeMessChange.bind(this);
        this.handlePayerMessChange = this.handlePayerMessChange.bind(this);
    }

    onSubmitModal(e) {
        this.props.onSubmitModal(this.state.payment);
    }

    render() {
        return (
            <div className="Modal">

                <div className="modal fade" id="modalRegisterForm" tabIndex="-1" role="dialog"
                     aria-labelledby="myModalLabel"
                     aria-hidden="true">
                    <div className="modal-dialog" role="document">
                        <div className="modal-content">
                            <div className="modal-header text-center">
                                <h4 className="modal-title w-100 font-weight-bold">Zadat platbu</h4>
                                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                    <span aria-hidden="true">&times;</span>
                                </button>
                            </div>
                            <div className="modal-body mx-3">
                                <div className="md-form mb-2">
                                    <div>
                                        <label data-error="wrong" data-success="right" htmlFor="amount"> Částka </label>
                                        <input type="number" id="amount" className="form-control validate" value={this.state.payment.value.amount} onChange={this.handleAmountChange} />
                                    </div>
                                </div>
                                <div className="md-form mb-2">
                                    <div>
                                        <label data-error="wrong" data-success="right" htmlFor="curr"> Měna </label>
                                        <select className="form-control validate" id="curr" name="curr" onChange={this.handleCurrChange} value={this.state.payment.value.currency}>
                                            <option value="CZK">CZK</option>
                                            <option value="EUR">EUR</option>
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="label label-default"> <strong>Protější účet</strong></label>
                                </div>

                                <div className="md-form mb-2">
                                    <label data-error="wrong" data-success="right" htmlFor="acc_pref"> Prefix </label>
                                    <input type="number" id="acc_pref" className="form-control validate" value={this.state.payment.partyAccount.prefix} onChange={this.handlePrefixChange}/>

                                </div>

                                <div className="md-form mb-2">
                                    <label data-error="wrong" data-success="right" htmlFor="acc_numb">Číslo</label>
                                    <input type="number" id="acc_numb" className="form-control validate" value={this.state.payment.partyAccount.accountNumber} onChange={this.handleAccNumberChange}/>
                                </div>

                                <div className="md-form mb-2">
                                    <label data-error="wrong" data-success="right" htmlFor="acc_code">Kód banky</label>
                                    <input type="number" id="acc_code" className="form-control validate" value={this.state.payment.partyAccount.bankCode} onChange={this.handleBankCodeChange}/>
                                </div>

                                <div>
                                    <label className="label label-default"> <strong>Další informace</strong></label>
                                </div>

                                <div className="md-form mb-2">
                                    <label data-error="wrong" data-success="right" htmlFor="var_s"> Variabilní symbol </label>
                                    <input type="number" id="var_s" className="form-control validate" value={this.state.payment.additionalInfo.variableSymbol} onChange={this.handleVSChange}/>
                                </div>

                                <div className="md-form mb-2">
                                    <label data-error="wrong" data-success="right" htmlFor="kons_s"> Konstantní symbol</label>
                                    <input type="number" id="kons_s" className="form-control validate" value={this.state.payment.additionalInfo.constantSymbol} onChange={this.handleCSChange}/>
                                </div>

                                <div className="md-form mb-2">
                                    <label data-error="wrong" data-success="right" htmlFor="spec_s">Specifický symbol</label>
                                    <input type="number" id="spec_s" className="form-control validate" value={this.state.payment.additionalInfo.specificSymbol} onChange={this.handleSSChange}/>

                                </div>

                                <div>
                                    <label className="label label-default"> <strong>Zpráva</strong> </label>

                                </div>
                                <div className="md-form mb-3">
                                    <label data-error="wrong" data-success="right" htmlFor="mess">Zpráva pro příjemnce</label>
                                    <input type="text" id="mess" className="form-control validate" value={this.state.payment.payeeMessage} onChange={this.handlePayeeMessChange}/>
                                </div>
                                <div className="md-form mb-3">
                                    <label data-error="wrong" data-success="right" htmlFor="mess_02">Zpráva pro odesilatele</label>
                                    <input type="text" id="mess_02" className="form-control validate" value={this.state.payment.payerMessage} onChange={this.handlePayerMessChange}/>
                                </div>

                            </div>
                            <div className="modal-footer d-flex justify-content-center">
                                <button type="button" onClick={this.onSubmitModal} className="btn btn-deep-orange" data-dismiss="modal">Zadat</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <button className="new-payment-button" data-toggle="modal"
                       data-target="#modalRegisterForm">Nová platba</button>
                </div>
            </div>
        );
    }

    handleAmountChange(e) {
        const value = +e.target.value;
        this.setState(prevState => ({
            payment: {
                ...prevState.payment,
                value: {
                    ...prevState.payment.value,
                    amount: value
                }
            }
        }))
    }

    handleCurrChange(e) {
        const value = e.target.value;
        this.setState(prevState => ({
            payment: {
                ...prevState.payment,
                value: {
                    ...prevState.payment.value,
                    currency: value
                }
            }
        }))
    }

    handlePrefixChange(e) {
        const value = +e.target.value;
        this.setState(prevState => ({
            payment: {
                ...prevState.payment,
                partyAccount: {
                    ...prevState.payment.partyAccount,
                    prefix: value
                }
            }
        }))
    }

    handleAccNumberChange(e) {
        const value = +e.target.value;
        this.setState(prevState => ({
            payment: {
                ...prevState.payment,
                partyAccount: {
                    ...prevState.payment.partyAccount,
                    accountNumber: value
                }
            }
        }))
    }

    handleBankCodeChange(e) {
        const value = +e.target.value;
        this.setState(prevState => ({
            payment: {
                ...prevState.payment,
                partyAccount: {
                    ...prevState.payment.partyAccount,
                    bankCode: value
                }
            }
        }))
    }

    handleVSChange(e) {
        const value = +e.target.value;
        this.setState(prevState => ({
            payment: {
                ...prevState.payment,
                additionalInfo: {
                    ...prevState.payment.additionalInfo,
                    variableSymbol: value
                }
            }
        }))
    }

    handleCSChange(e) {
        const value = +e.target.value;
        this.setState(prevState => ({
            payment: {
                ...prevState.payment,
                additionalInfo: {
                    ...prevState.payment.additionalInfo,
                    constantSymbol: value
                }
            }
        }))
    }

    handleSSChange(e) {
        const value = +e.target.value;
        this.setState(prevState => ({
            payment: {
                ...prevState.payment,
                additionalInfo: {
                    ...prevState.payment.additionalInfo,
                    specificSymbol: value
                }
            }
        }))
    }

    handlePayeeMessChange(e) {
        const value = e.target.value;
        this.setState(prevState => ({
            payment: {
                ...prevState.payment,
                payeeMessage: value
            }
        }))
    }

    handlePayerMessChange(e) {
        const value = e.target.value;
        this.setState(prevState => ({
            payment: {
                ...prevState.payment,
                payerMessage: value
            }
        }))
    }
}

export default Modal;
