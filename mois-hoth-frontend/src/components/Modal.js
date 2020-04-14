import React, {Component} from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/js/dist/modal.js';
class Modal extends Component {

    constructor(props) {
        super(props);
        this.state = {

        };

        this.onSubmitModal = this.onSubmitModal.bind(this);
    }

    onSubmitModal(e) {
        this.props.onSubmitModal();
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
                                        <input type="number" id="amount" className="form-control validate"/>
                                    </div>
                                </div>
                                <div className="md-form mb-2">
                                    <div>
                                        <label data-error="wrong" data-success="right" htmlFor="curr"> Měna </label>
                                        <input type="text" id="curr" className="form-control validate"/>
                                    </div>
                                </div>

                                <div>
                                    <label className="label label-default"> <strong>Protější účet</strong></label>
                                </div>

                                <div className="md-form mb-2">
                                    <input type="text" id="acc_pref" className="form-control validate"/>
                                        <label data-error="wrong" data-success="right"
                                               htmlFor="acc_pref"> Prefix </label>
                                </div>

                                <div className="md-form mb-2">
                                    <input type="text" id="acc_numb" className="form-control validate"/>
                                        <label data-error="wrong" data-success="right" htmlFor="acc_numb">Číslo</label>
                                </div>

                                <div className="md-form mb-2">
                                    <input type="text" id="acc_code" className="form-control validate"/>
                                        <label data-error="wrong" data-success="right" htmlFor="acc_code">Kód
                                            banky</label>
                                </div>

                                <div>
                                    <label className="label label-default"> <strong>Další informace</strong></label>
                                </div>

                                <div className="md-form mb-2">
                                    <input type="text" id="var_s" className="form-control validate"/>
                                        <label data-error="wrong" data-success="right" htmlFor="var_s"> Variabilní
                                            symbol </label>
                                </div>

                                <div className="md-form mb-2">
                                    <input type="text" id="kons_s" className="form-control validate"/>
                                        <label data-error="wrong" data-success="right" htmlFor="kons_s"> Konstantní
                                            symbol</label>
                                </div>

                                <div className="md-form mb-2">
                                    <input type="text" id="spec_s" className="form-control validate"/>
                                        <label data-error="wrong" data-success="right" htmlFor="spec_s">Specifický
                                            symbol</label>
                                </div>

                                <div>
                                    <label className="label label-default"> <strong>Zpráva</strong> </label>

                                </div>
                                <div className="md-form mb-3">
                                    <input type="text" id="mess" className="form-control validate"/>
                                        <label data-error="wrong" data-success="right" htmlFor="mess">Zpráva</label>
                                </div>


                            </div>
                            <div className="modal-footer d-flex justify-content-center">
                                <button onClick={this.onSubmitModal} className="btn btn-deep-orange">Zadat</button>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="text-center">
                    <a href="" className="btn btn-default btn-rounded mb-4" data-toggle="modal"
                       data-target="#modalRegisterForm">Nová platba</a>
                </div>
            </div>
        );
    }
}

export default Modal;
