import React from 'react';
import Common from './Common';
import Util from '../common/utils/Util';
import Table from './tables/Table';
import ModalCustom from './FormBasicModal';

class FormBasicTable extends Common {
    constructor(){
        super();
        this.nameForm  = '';
        this.customServerUrl = '/'+this.nameForm;
        this.rowIdName = 'id';
        this.modalModule = ModalCustom;
        this.firstReload = true;

        this.state = {
            recordSelected : '',
            listRecords : [],
            listHeaders : [],
            modalComponent:'',
        };

        this.handleInput = this.handleInput.bind(this);        
        this.handleShowModal = this.handleShowModal.bind(this);
        this.handleNew = this.handleNew.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleReloadTable = this.handleReloadTable.bind(this);
    }

    componentWillMount(){
        if(this.customServerUrl === '/') {
            this.customServerUrl = '/'+this.nameForm;
        }

        if(this.firstReload){
            this.setTableContent();
        }
    }

    componentDidMount(){
        this.showLoading(this.nameForm);        
    }

    setTableContent(){
        var that = this;

        $.ajax({
            type: 'GET',
            url: this.serverUrl+this.customServerUrl,
            beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', Util.getCookie('tokenAccess'))}
        }).done((data, status) =>{
            if(data.status !== 'error'){
                let headers = this.state.listHeaders;
                let records = data.data;
    
                if( headers.length === 0 && records.length > 0){
                    headers = Object.keys(records[Object.keys(records)[0]]);
                }else{
                    headers = this.state.listHeaders;
                }
    
                that.setStateData(headers, records);
            }else{
                that.showAlertError(data.message);
                that.hideLoading(this.nameForm);
            }
        }).fail( (data,status)=> {
            that.showAlertError(data.message);
            that.hideLoading(this.nameForm);
        });
    }

    setStateData(headers, records){
        this.setState({
            listHeaders : headers,
            listRecords : records,
        }, () =>{
            this.hideLoading(this.nameForm);
        });
    }

    handleReloadTable(){
        this.setTableContent();
        this.showLoading(this.nameForm);
    }

    handleShowModal(evt) {
        this.showLoading(this.nameModule);
        var that = this;
        const target = evt.target;
        const idRecord = target.dataset.id;

        if (typeof(idRecord) !== 'undefined') {
            $.ajax({
            type: 'GET',
            url: this.serverUrl+this.customServerUrl+'/'+idRecord,
            beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', Util.getCookie('tokenAccess'))}
            }).done((data, status) =>{
                if(typeof data.data === "undefined"){
                    that.hideLoading(this.nameModule);                    
                }else{
                    that.setState({
                        recordSelected : data.data
                    }, () =>{
                        this.setModalComponent();
                    });
                }
            }).fail( (data,status)=> {
                that.showAlertError();
            });
        }
    }
    
    handleShowModalCustom(idRecord) {
        this.showLoading(this.nameForm);
        var that = this;

        if(typeof(idRecord) !== 'undefined'){
            $.ajax({
            type: 'GET',
            url: this.serverUrl+this.customServerUrl+'/'+idRecord,
            beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', Util.getCookie('tokenAccess'))}
        }).done((data, status) =>{
            if(data.status !== 'error'){
                that.setState({
                    recordSelected : data.data
                }, () =>{
                    this.setModalComponent();
                });
            }else{
                that.showAlertError(data.message);
                that.hideLoading(this.nameForm);
            }
        }).fail( (data,status)=> {
            that.showAlertError();
        });
        }
    }

    /*
    * Asigna el modulo para el modal de bootstrap al estado de la app.
    *
    */
    setModalComponent(){
        let that = this;
        let Modal = this.modalModule;

        this.setState({
            modalComponent : (<Modal recordSelected={this.state.recordSelected} />)
        },() =>{
            console.log('Mostrando modal-'+this.nameForm);
            $('#modal-'+this.nameForm).modal({animation: false});        
            $('#modal-'+this.nameForm+' a:first').tab('show');
            $('#modal-'+this.nameForm).off('hidden.bs.modal').on('hidden.bs.modal', function (evt) {
                $(this).data('bs.modal', null);
                that.setState({
                    modalComponent : ''
                },() =>{
                    that.handleReloadTable();                    
                });
            });
            that.hideLoading(this.nameForm);
        });
    }

    handleNew(){
        var that = this;

        this.setState({
            recordSelected : ''
        }, () =>{
            $.ajax({
            type: 'POST',
            url: this.serverUrl+this.customServerUrl,
            beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', Util.getCookie('tokenAccess'))}
            }).done((data, status) =>{
                let posError;

                //Imprimimos erroressi los hay
                for(var i in data.status){
                    if(data.status[i] && data.status[i].indexOf('error') >= 0){
                        posError = i;
                    }
                }

                if(posError >= 0){
                    that.showAlertError(data.message[posError]);
                    that.hideLoading(this.nameForm);
                }else{
                    if(typeof data.data[0] !== 'number'){
                        data.data[0] = data.data[1];
                    }

                    that.handleReloadTable();
                    that.handleShowModalCustom(data.data[0]);
                    that.showAlertSuccess();
                }
            }).fail( (data,status)=> {
                that.showAlertError(status.statusText);
            });
        });
    }

    handleDelete(evt) {
        evt.stopPropagation();
        var that = this;
        const target = evt.target;
        const idRecord = target.dataset.id;

        if(confirm('Desea eliminar el registro?')){
            if(typeof(idRecord) !== 'undefined'){
                $.ajax({
                    url: this.serverUrl+this.customServerUrl+'/'+idRecord,
                    type: 'DELETE',
                    beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', Util.getCookie('tokenAccess'))}
                }).done( (data,status) => {
                    if(data.status !=='error' && data.data){
                        that.handleReloadTable();
                        that.showAlertSuccess();
                    }else{
                        that.showAlertError(data.message);
                        that.hideLoading(this.nameForm);
                    }                
                }).fail( (data, status) => {
                    that.showAlertError(status.statusText);
                });
            }
        }
    }

    render (props) {
        return(
            <div id={this.nameForm+'-component'}>
                <Table rowIdName={this.rowIdName} listHeaders={this.state.listHeaders} listTable={this.state.listRecords} handleClickRow={this.handleShowModal} handleNewRow={this.handleNew} handleDeleteRow={this.handleDelete} handleReloadTable={this.handleReloadTable} />
                {this.state.modalComponent}
            </div>
        )
    }
}

export default FormBasicTable;