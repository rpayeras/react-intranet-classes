import React from 'react';
import moment from 'moment';
import Flatpickr from '../../../lib/flatpickr/dist/flatpickr';
import languageFlatpickr from "flatpickr/dist/l10n/es.js";
import "flatpickr/dist/flatpickr.css";


import FormBasicTable from '../../common/FormBasicTable';
import Modal from './Modal';
import Table from '../../common/tables/Table';
import Util from '../../common/utils/Util';
import './Reservations.scss';

class Reservations extends FormBasicTable{

    constructor(props){
        super(props);
        //Este id es necesario para abrir el modal en concreto
        this.rowIdName = 'Id';
        this.nameForm = 'reservations';
        this.nameModule = 'ReservationsList';
        this.customServerUrl = '/cm/reservations';
        this.modalModule = Modal;
        this.readOnlyInputs = true;
        this.excludeCols = ['Id'];
        this.timeoutSearch = '';
        this.timerDates = '';
        
        this.state = {
            recordSelected : '',
            listRecords: [],
            listHeaders: [],
            modalComponent:'',
            hotels: '',
            hotelsElements:'',
            partners: '',
            partnersElements:'',
            hotel: '',
            voucher:'',
            partner:'',
            dateReservation: '',
            dateFrom: '',
            dateTo: '',            
            postingDate: ''
        };

        this.dateToMomentDate = this.dateToMomentDate.bind(this);
        this.parseCustomDate = this.parseCustomDate.bind(this);
        
        this.handleInput = this.handleInput.bind(this);
        this.handleReloadTable = this.handleReloadTable.bind(this);
        this.handleInputDate = this.handleInputDate.bind(this);        
        this.handleDateFrom = this.handleDateFrom.bind(this);
        this.handleDateTo = this.handleDateTo.bind(this);
        this.handleDateReservation = this.handleDateReservation.bind(this);
        this.handlePostingDate = this.handlePostingDate.bind(this);
        
        moment.locale('es-ES');
    }

    componentWillMount(){
        this.getRemoteHotels();
        this.getRemotePartners();
        this.setTableContent();       
        this.renderDates(); 
    }

    componentDidMount(){
        this.renderDates();
    }

    renderDates(){
        Flatpickr('#dateReservation',{allowInput: true, dateFormat:'d-m-Y', onChange: this.handleDateReservation, parseDate: this.parseCustomDate, locale: languageFlatpickr.es}); 
        Flatpickr('#dateFrom',{allowInput: true, dateFormat:'d-m-Y', onChange: this.handleDateFrom, parseDate: this.parseCustomDate, locale: languageFlatpickr.es});         
        Flatpickr('#dateTo',{allowInput: true, dateFormat:'d-m-Y', onChange: this.handleDateTo, parseDate: this.parseCustomDate, locale: languageFlatpickr.es});                 
        Flatpickr('#postingDate',{allowInput: true, dateFormat:'d-m-Y', onChange: this.handlePostingDate, parseDate: this.parseCustomDate, locale: languageFlatpickr.es}); 
    }

    getRemoteHotels(){
        var that = this;
        Util.showLoading(this.nameModule);

        $.ajax({
            type: 'GET',
            url: this.serverUrl+'/reservations/config/hotels',
            beforeSend: (xhr) => {xhr.setRequestHeader('Authorization', Util.getCookie('tokenAccess'));}
        }).done( (data, status) => {
            var resData = data.data;

            if( resData ){
                let elements = [];
                let indexElements = 0;
                resData = Util.sortCollection(resData);
                
                for(var i in resData){
                    let value = resData[i];
                    elements[indexElements] = (<option value={value.id} key={'opt_'+Math.random()+'_'+value.id}>{value.nombre}</option>);
                    indexElements++;
                }

                that.setState({
                    hotels : data.data,
                    hotelsElements: elements
                });
            }
            
        }).fail( (data, status) => { Util.showAlertError(); });
    }

    getRemotePartners(){
        var that = this;

        $.ajax({
        type: 'GET',
        url: this.serverUrl+'/cm/partners',
        beforeSend: (xhr) => {xhr.setRequestHeader('Authorization', Util.getCookie('tokenAccess'));}
        }).done( (data, status) => {
            const resData = data.data;

            if( resData ){
                let elements = [];
                for(var i in resData){
                    let value = resData[i];
                    elements[i] = (<option value={value.id} key={'opt_'+Math.random()+'_'+value.id}>{value.nombre}</option>);
                }
                
                that.setState({
                    partners: data.data,
                    partnersElements: elements
                });
            }
        }).fail( (data, status) => { Util.showAlertError(); });
    }

    handleInput(evt){
        evt.persist();

        const target = evt.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        var postSelected = this.state;

        postSelected[name] = value;
        
        this.setState({
            recordSelected : postSelected
        },() => {
            let headers = this.state.listHeaders;
            this.setStateData(headers, undefined);
        });
    }

    handleInputDate(evt){
        evt.persist();
        clearTimeout(this.timerDates);
        let postState = this.state;
        postState[evt.target.id] = evt.target.value;

        this.setState(postState, () => {
            this.timerDates = setTimeout( () => {
                //this.handleInputDateReservationPickr(evt.target.value);     
            }, 1000);
        });
    }

    dateToMomentDate(date) {
        let customDate = '';
        
        if(date.length === 1) {
            customDate = date ? date[0] : '';
            customDate = moment(customDate).format('DD-MM-YYYY');     
        } else if (date.length > 1) {
            customDate = [];
            for(let i = 0; i <= date.length; i++) {
                if(typeof date[i] !== "undefined") {
                    customDate.push(date[i]);                    
                }
            }
        }

        return customDate;
    }

    handleDateReservation(date) {
        let dateTmp = '';

        if (typeof date === 'object' && date.length > 1) {
            dateTmp = [];
            for (let i = 0; i < date.length; i++) {
                if(typeof date[i] !== "undefined") {
                    dateTmp.push(moment(date[i]).format('DD-MM-YYYY'));
                }
            
            }
        } else if(date.length === 1){
            dateTmp = date ? date[0] : '';
            dateTmp = moment(dateTmp).format('DD-MM-YYYY');     
        } else {
            dateTmp = '';
        }
        
        this.setState({
            dateReservation : dateTmp
        });
    }

    handleDateFrom(date) {
        date = this.dateToMomentDate(date);
        this.setState({
            dateFrom : date
        });
    }

    handleDateTo(date) {
        date = this.dateToMomentDate(date);
        this.setState({
            dateTo : date
        });
    }
    handlePostingDate(date) {
        date = this.dateToMomentDate(date);
        this.setState({
            postingDate : date
        });
    }

    /*
    * Recibe un string y lo pasa a date con moment js, lo utiliza flatpickr
    */
    parseCustomDate(dateString) {
        let customDate;

        if (typeof dateString === 'string') {
            switch (dateString) {
                case 'h':
                    customDate = moment();
                break;
                case 'm':
                    customDate = moment().add(1,'d');
                break;
                case 'a':
                    customDate = moment().subtract(1,'d');
                break;
            }
            
            if (dateString.indexOf('..') >= 0) {                
                let date1 = moment(dateString.substr(0, dateString.indexOf('..')), ['DDMM','DDMMYY','DDMMYYYY']);
                let date2 = moment(dateString.substr(dateString.indexOf('..') + 2), ['DDMM','DDMMYY','DDMMYYYY']);

                if (date1.isValid() && date2.isValid()) {
                    customDate = [date1.toDate(), date2.toDate()];                    
                }

                this.handleDateReservation(customDate);
                return customDate;  
            }

            if (typeof customDate === "undefined"){
                switch(dateString.length){
                    case 2:
                        customDate = moment(dateString, ['DD','YY']);
                    break;
    
                    case 4:
                        customDate = moment(dateString,['DDMM','MMYY','YYYY']);      
                    break;
    
                    case 6:
                        customDate = moment(dateString,['DDMMYY','YYMMDD']);
                    break;
    
                    case 8:
                        customDate = moment(dateString,['DDMMYYYY','YYYYMMDD']);
                    break;
                }
            }
        }

        if (typeof dateString === 'object') {
            customDate = moment(dateString, ['DD-MM-YYYY']);
        }

        if (typeof customDate === "undefined"){
            customDate = moment(dateString, ['DD-MM-YYYY']);

            if (typeof customDate === "undefined"){
                customDate = moment();
            }            
        }

        if(customDate.isValid()) {
            if (customDate.length > 1) {
                this.handleDateReservation(customDate);
                return null;          
            }else{
                return customDate.toDate();
            }
        } else{
            return false;
        }
    }

    handleReloadTable(evt){
        Util.showLoading(this.nameModule);

        var that = this;
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
            voucher: this.state.voucher
        };

        $.ajax({
            type: 'POST',
            url: this.serverUrl+this.customServerUrl,
            data: data,
            beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', Util.getCookie('tokenAccess'))}
        }).done((data, status) =>{
            if(data.status === 'error') {
                Util.hideLoading(this.nameModule);
            }else{
                let headers = this.state.listHeaders;
                let records = data.data;
    
                if( headers.length === 0 ){
                    headers = Object.keys(data.data[Object.keys(data.data)[0]]);
                }else{
                    headers = this.state.listHeaders;
                }
    
                that.setStateData(headers, records);
            }
        }).fail( (data,status)=> {
            Util.showAlertError();
            Util.hideLoading(this.nameModule);
        });    
    }

    setStateData(headers, records){
        // Antes de setear el estado del componente
        for(let i in records){
            function searchName(obj) { 
                return obj.id === records[i].Hotel;
            }

            let hotel = this.state.hotels.find(searchName);
            let partner = this.state.partners[records[i].Canal];

            if (typeof hotel !== "undefined") {
                records[i].Hotel = hotel.nombre;
                records[i].Canal = partner.nombre;
            }

        }        

        if( typeof records === "undefined" ){
            records = [];
        }

        this.setState({
            listHeaders : headers,
            listRecords : records,
        }, () => {
            Util.hideLoading(this.nameModule);
        });
    }

    render (props) {
        return(
            <div id='reservations-component'>
                <div className='form-inline row'>
                    <div className='input-group col-sm-3 m-2'>
                        <label htmlFor='hotel' className='mr-2'>Hotel</label>
                        <select className="form-control" name='hotel' id='hotel' value={this.state.hotel} onChange={this.handleInput}>
                            <option></option>
                            {this.state.hotelsElements}
                        </select>
                    </div>
                    <div className='input-group col-sm-3 m-2'>
                        <label htmlFor='partner' className='mr-2'>Canal</label>
                        <select className="form-control" name='partner' id='partner' value={this.state.partner} onChange={this.handleInput}>
                            <option></option>
                            {this.state.partnersElements}
                        </select>       
                    </div>
                    <div className='input-group col-sm-3 m-2'>
                        <label htmlFor='voucher' className='mr-2'>Bono</label>
                        <input className='form-control mb-1 mr-sm-1 mb-sm-0 m-1' name='voucher' id='voucher' value={this.state.voucher} onChange={this.handleInput}/>
                    </div>
                    <div className='input-group col-sm-1 m-2'>
                        <button type='submit' className='btn btn_primary fa fa-search mr-2' onClick={this.handleReloadTable}></button>
                    </div>

                </div>
                <div className='form-inline row mb-2'>
                    <div className='input-group col-sm-3'>
                        <label htmlFor='date-reservation' className='mr-2'>Fecha Reserva</label><br />
                        <input className="datepicker form-control" name="dateReservation" id="dateReservation" value={this.state.dateReservation} onChange={this.handleInputDate}/>
                        <button type="button" className="btn btn-primary fa fa-times" onClick={this.handleDateReservation}></button>
                    </div>
                    <div className='input-group col-sm-3'>
                        <label htmlFor='date-from' className='mr-2'>Fecha Desde</label>
                        <input className="datepicker form-control" name="dateFrom" id="dateFrom" value={this.state.dateFrom} onChange={this.handleInputDate}/>
                        <button type="button" className="btn btn-primary fa fa-times" onClick={this.handleDateFrom}></button>
                    </div>
                    <div className='input-group col-sm-3'>
                        <label htmlFor='date-to' className='mr-2'>Fecha Hasta</label>
                        <input className="datepicker form-control" name="dateTo" id="dateTo" value={this.state.dateTo} onChange={this.handleInputDate}/>
                        <button type="button" className="btn btn-primary fa fa-times" onClick={this.handleDateTo}></button>
                    </div>
                    <div className='input-group col-sm-3'>
                        <label htmlFor='date-posted' className='mr-2'>Fecha Registro</label>
                        <input className="datepicker form-control" name="postingDate" id="postingDate" value={this.state.postingDate} onChange={this.handleInputDate}/>
                        <button type="button" className="btn btn-primary fa fa-times" onClick={this.handlePostingDate}></button>
                    </div>

                </div>
                <Table rowIdName={this.rowIdName} listHeaders={this.state.listHeaders} listTable={this.state.listRecords} handleClickRow={this.handleShowModal} handleReloadTable={this.handleReloadTable} readOnlyInputs={this.readOnlyInputs} excludeCols={this.excludeCols}/>
                {this.state.modalComponent}
            </div>
        )
    }
}

export default Reservations;