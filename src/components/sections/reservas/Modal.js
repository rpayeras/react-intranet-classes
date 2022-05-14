import React, { Component } from 'react';
import FormBasicModal from '../../common/FormBasicModal';
import Util from '../../common/utils/Util';
import Table from '../../common/tables/Table';
import './Modal.scss';
import UserPasswordPci from '../sistema/users/UserProfilePasswordPci';

class Modal extends FormBasicModal {
    constructor(props){
        super(props);
        this.nameForm = 'reservations';
        this.readOnlyInputs = true;
        this.headerRoomsTable = Object.keys(this.props.recordSelected.Rooms[0]);                            
        this.timeouts = [];

        this.handleInputGeneral = this.handleInputGeneral.bind(this);
        this.handleInputPciPassword = this.handleInputPciPassword.bind(this);
        this.getCreditCard = this.getCreditCard.bind(this);
    }

    componentWillMount(){
        let postState = this.state;
        postState.creditCard = [];
        postState.iconLockCreditCard = 'lock';
        postState.showPciPassword = false;
        this.setState(postState);
    }

    componentWillReceiveProps(nextProps) {
        this.setState({
            recordSelected : nextProps.recordSelected,
        },
        () => {
            this.cleanStateCC()
        });
    }

    getCreditCard(){
        let that = this;
        that.cleanStateCC();
        that.showLoading('creditcard');

        let data = {
            id: Util.getCookie('userId'),
            password: this.state.password_pci,
            action: 'getCreditCard',
            bono: this.state.recordSelected.Voucher
        };

        $.ajax({
            type: 'POST',
            url: this.serverPciUrl,
            data: data
        }).done( (data, status) => {
            data = JSON.parse(data);

            if(typeof data === "object"){
                that.setCreditCard(data);
            }else{
                that.cleanStateCC();
                that.hideLoading('creditcard');
                
                if(data.indexOf('caducado') >= 0){
                    that.setState({
                        showPasswordPci: true
                    });
                }else{
                    that.setState({
                        showPasswordPci: false
                    });
                }
                
                that.showAlertError(data);
            }
        }).fail( (data, status) => { that.showAlertError(); });
    }

    setCreditCard(data){
        let that = this;
        let listElements = [];

        for (let i in data) {
            if(typeof data[i] === "object"){
                data[i] = '';
            }
            
            //Exclusion de columnas
            let elem = (
            <div className="col-md-4" key={'cc-'+i}>
                <div className="form-group">
                    <label htmlFor={'cc-'+i}>{i.toUpperCase()}</label>
                    <input className="form-control" type="text" readOnly name={'cc-'+i} id={'cc-'+i} value={data[i] || ''} />
                </div>
            </div>);
            listElements.push(elem);
        }

        this.setState({
            creditCard : listElements,
            password_pci: '',
            iconLockCreditCard: 'unlock'
        }, () =>{
            that.hideLoading('creditcard');
            that.showAlertSuccess();            
            this.timeouts = setTimeout( () => {
                that.cleanStateCC();
            }, 900000);            
        });
    }

    handleInputGeneral(evt){
        const target = evt.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        var poststate = this.state;

        poststate[name] = value;
        this.setState(poststate);
    }

    handleInputPciPassword(evt){
        if(evt.key === 'Enter'){
            this.getCreditCard();
        }
    }

    cleanStateCC(){
        return new Promise( (resolve, reject) => {
            for(let i in this.timeouts){
                clearTimeout(this.timeouts[i]);
            }

            this.setState({
                creditCard : '',                    
                password_pci: '',
                iconLockCreditCard: 'lock'
            }, () =>{
                this.hideLoading('creditcard');     
                resolve();
            });
        });
    }

    render(){
        return(
            <div className='modal fade' id={'modal-'+this.nameForm}>
                <div className='modal-dialog modal-lg' role='document'>
                    <div className='modal-content'>

                        <div className='modal-header'>
                            <h5 className='modal-title'>{'Bono '+this.state.recordSelected.Voucher+' '+this.state.recordSelected.PartnerId}</h5>
                            <button type='button' className='close' aria-label='Close' onClick={this.closeSelfModal}>
                                <span aria-hidden='true'>&times;</span>
                            </button>
                        </div>
                        
                        <div className='modal-body'>
                            <ul className='nav nav-tabs' role='tablist'>
                                <li className='nav-item'>
                                    <a className='nav-link active' data-toggle='tab' href='#general' role='tab' >FICHA</a>
                                </li>
                                <li className='nav-item'>
                                    <a className='nav-link' data-toggle='tab' href='#creditcard' role='tab'>TARJETA DE CREDITO</a>
                                </li>
                            </ul>
                            <div className='tab-content'>
                                <div className='tab-pane active p-2' id='general' role='tabpanel'>

                                    <div className="row">
                                        <div className="col-md-12">
                                            <form className="row form">
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="Id">Hotel</label>
                                                        <input className="form-control" type="text" readOnly name="Id" id="Id" value={this.state.recordSelected.HotelId} />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="Date">Fecha de Reserva</label>
                                                        <input className="form-control" type="text" readOnly name="Date" id="Date" value={(typeof this.state.recordSelected.Date === "string" ? this.state.recordSelected.Date : '')} />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="Name">Titular</label>
                                                        <input className="form-control" type="text" readOnly name="Name" id="Name" value={(typeof this.state.recordSelected.Name === "string" ? this.state.recordSelected.Name : '')} />
                                                    </div>
                                                </div>
                                            </form>

                                            <form className="row form">
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="Email">Email</label>
                                                        <input className="form-control" readOnly type="text" name="Email" id="Email" value={(typeof this.state.recordSelected.Email === "string" ? this.state.recordSelected.Email : '')} />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="Phone">Teléfono</label>
                                                        <input className="form-control" readOnly type="text" name="Phone" id="Phone" value={(typeof this.state.recordSelected.Phone === "string" ? this.state.recordSelected.Phone : '')} />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="Country">País</label>
                                                        <input className="form-control" readOnly type="text" name="Country" id="Country" value={this.state.recordSelected.Country || ''} />
                                                    </div>
                                                </div>
                                            </form>
                                            
                                            <form className="row form">
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="Amount">Importe</label>
                                                        <input className="form-control" readOnly type="text" name="Amount" id="Amount" value={this.state.recordSelected.Amount || ''} />
                                                    </div>
                                                </div>
                                                <div className="col-md-4">
                                                    <div className="form-group">
                                                        <label htmlFor="Amount">Comisión</label>
                                                        <input className="form-control" readOnly type="text" name="Comission" id="Comission" value={this.state.recordSelected.Comission || ''} />
                                                    </div>
                                                </div>
                                            </form>
                                            <div className="form-group">
                                                <label>Habitaciones</label>
                                                <Table listHeaders={this.headerRoomsTable} listTable={this.state.recordSelected.Rooms} readOnlyInputs={true} showUtilsHeader={false}/>
                                            </div>
                                            <div className="form-group">
                                                <label htmlFor="Remarks">Comentarios</label>
                                                <textarea className="form-control" name="Remarks" id="Remarks" readOnly value={this.state.recordSelected.Remarks || ''} rows="4" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className='tab-pane p-2' id='creditcard' role='tabpanel'>
                                    <div className="container">
                                        <div className="row">
                                            <div className='form-group col-md-6'>
                                                <label htmlFor='password_pci'><strong>Password PCI</strong></label>
                                                <div className="row p-3">
                                                    <input type='password' className='form-control col-sm-9' name='password_pci' value={this.state.password_pci} onChange={this.handleInputGeneral} onKeyPress={this.handleInputPciPassword}/>
                                                    <button type='button' className={'btn btn-primary col-sm-2 ml-1 fa fa-'+this.state.iconLockCreditCard} onClick={this.getCreditCard} data-target="password_pci" />
                                                    <span className='loading-gif'>
                                                        <span>
                                                            <img src='img/loading.gif'/> 
                                                        </span>
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="col-md-6">
                                                {this.state.showPasswordPci && <UserPasswordPci/>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="form row mt-2">
                                        {this.state.creditCard}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>  
            </div>  
        )
    }
}

export default Modal;