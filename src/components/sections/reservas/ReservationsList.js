import React from 'react';
import moment from 'moment';
import Util from '../../common/utils/Util';
import FormBasicTable from '../../common/FormBasicTable';
import Modal from './Modal';
import Table from '../../common/tables/Table';
import SelectInput from '../../common/forms/SelectInput';
import DateInput from '../../common/forms/DateInput';

import './Reservations.scss';

class Reservations extends FormBasicTable{
    constructor(props){
        super(props);
        //Este id es necesario para abrir el modal en concreto
        this.rowIdName = 'Id';
        this.nameForm = 'reservations';
        this.nameModule = 'ReservationsList';
        this.customServerUrl = '/reservations';
        this.modalModule = Modal;
        this.readOnlyInputs = true;
        this.excludeCols = ['Id', 'Secuencia'];
        this.timeoutSearch = '';
        this.timerDates = '';
        this.firstReload = false;
        
        this.state = {
            recordSelected : '',
            listRecords: [],
            listHeaders: [],
            modalComponent:'',
            hotel: '',
            voucher:'',
            origin:'',
            partner:'',
            ttoo:'',
            dateReservation: '',
            dateFrom: '',
            dateTo: '',            
            postingDate: ''
        };
        
        this.handleInputRecord = this.handleInputRecord.bind(this);        
        this.handleReloadTable = this.handleReloadTable.bind(this);
        
        moment.locale('es-ES');
    }

    handleInputRecord(evt){
        evt.persist();

        const target = evt.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        var postSelected = this.state;

        postSelected[name] = value;
        
        this.setState({
            recordSelected : postSelected
        },() => {
            let headers = [];
        });
    }

    handleReloadTable(evt){
        var that = this;
        this.showLoading(this.nameModule);        
        let dateFrom = ( this.state.dateFrom ? moment(this.state.dateFrom, 'DD-MM-YYYY').format('YYYY-MM-DD') : '');
        let dateTo = ( this.state.dateTo ? moment(this.state.dateTo, 'DD-MM-YYYY').format('YYYY-MM-DD') : '');
        
        let dateReservation = ( this.state.dateReservation ? moment(this.state.dateReservation, 'DD-MM-YYYY').format('YYYY-MM-DD') : '');
        let postingDate = ( this.state.postingDate ? moment(this.state.postingDate, 'DD-MM-YYYY').format('YYYY-MM-DD') : '');

        let data = {
            dateFrom: dateFrom,
            dateTo: dateTo,            
            dateReservation: dateReservation,
            postingDate: postingDate,
            hotel: this.state.hotel,
            partner: this.state.partner,
            origin: this.state.origin,
            ttoo: this.state.ttoo,
            voucher: this.state.voucher
        };
        
        $.ajax({
            type: 'POST',
            url: this.serverUrl+this.customServerUrl,
            data: data,
            beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', Util.getCookie('tokenAccess'))}
        }).done((data, status) =>{
            if(data.status === 'error') {                
                that.hideLoading(this.nameModule);
            }else{
                let headers = Object.keys(data.data[Object.keys(data.data)[0]]);
                let records = data.data;
    
                this.setState({
                    listHeaders : headers,
                    listRecords : records,
                }, () => {                    
                    that.hideLoading(that.nameModule);
                });
            }
        }).fail( (data,status)=> {
            that.showAlertError('Error al recuperar reservas');            
            that.hideLoading(this.nameModule);
        });    
    }

    render (props) {
        return(
            <div id='reservations-component'>
                <div className='form-inline row mb-2 mt-2'>
                    <div className='col-sm-3'>
                        <SelectInput resourceUrl='/reservations/config/hotels' label='Hotel' id='hotel' name='hotel' handleChange={this.handleInputRecord}/>
                    </div>
                    <div className='col-sm-3'>
                        <SelectInput resourceUrl='/reservations/config/origins' label='Origen' id='origin' name='origin' handleChange={this.handleInputRecord}/>       
                    </div>
                    <div className=' col-sm-3'>
                        <SelectInput resourceUrl='/reservations/config/ttoo' label='TTOO' id='ttoo' name='ttoo' filterValue={this.state.origin} handleChange={this.handleInputRecord}/> 
                    </div>
                    <div className='input-group col-sm-2'>
                        <label htmlFor='voucher' className='mr-2'>Bono</label>
                        <input className='form-control' name='voucher' id='voucher' value={this.state.voucher} onChange={this.handleInputRecord}/>
                    </div>
                </div>
                <div className='form-inline row mb-2'>
                    <div className='col-sm-4'>
                        <DateInput label='Fecha desde' name='dateFrom' id='dateFrom' value={this.state.dateFrom} handleChange={this.handleInput}/>
                    </div>
                    <div className='col-sm-3'>
                        <DateInput label='Fecha hasta' name='dateTo' id='dateTo' value={this.state.dateTo} handleChange={this.handleInput}/>
                    </div>
                    <div className='col-sm-4'>
                        <DateInput label='Fecha reserva' name='dateReservation' id='dateReservation' value={this.state.dateReservation} handleChange={this.handleInput}/>
                    </div>
                    <button type='submit' className='btn btn_primary fa fa-search mr-2' onClick={this.handleReloadTable}></button>
                </div>
                <Table rowIdName={this.rowIdName} listHeaders={this.state.listHeaders} listTable={this.state.listRecords} handleClickRow={this.handleShowModal} handleReloadTable={this.handleReloadTable} readOnlyInputs={this.readOnlyInputs} excludeCols={this.excludeCols}/>
                {this.state.modalComponent}
            </div>
        )
    }
}

export default Reservations;