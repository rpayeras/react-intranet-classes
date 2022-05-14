import React from 'react';
import TableRooms from '../../common/tables/TableEditableOld';
import TableRegimen from '../../common/tables/TableEditableOld';
import TableCompositions from '../../common/tables/TableEditableOld';
import SelectInput from '../../common/forms/SelectInput';

import Common from '../../common/Common';
import Util from '../../common/utils/Util';

class ConfigReservations extends Common {
    constructor(props){
        super(props);
        this.state = {
            hotel : '',
            origin: '',
            hotels : [],
            origins : [],
            hotelConfigHeaders : [],
            hotelConfig : [],
            regimenEquivHeaders : [],
            regimenEquiv : [],
            roomTypesEquivHeaders: [],
            roomTypesEquiv : [],
            compositionsHeaders: [],
            compositions :[],
            showConfig : false,
            readOnlyInputs : false
        };

        this.handleInput = this.handleInput.bind(this);
        this.handleInputHeader = this.handleInputHeader.bind(this);
        this.handleNew = this.handleNew.bind(this);
        this.handleDelete = this.handleDelete.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleEditCol = this.handleEditCol.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }

    getRemoteConfigReservations(){
        if( this.state.hotel && this.state.origin ){
            var that = this;
            $.ajax({
            type: 'GET',
            url: this.serverUrl+'/reservations/config/'+this.state.hotel+'/'+this.state.origin,
            beforeSend: (xhr) => { xhr.setRequestHeader('Authorization', Util.getCookie('tokenAccess'));}
            }).done( (data, status) => {
                let headerRooms = ['Codigo Origen', 'Codigo Navision'];
                let headerReg = ['Codigo Origen','Codigo Navision'];
                let headerComp = [];

                if( typeof data.data.compositions !== 'undefined' && data.data.compositions.length > 0 ){
                    headerComp = Object.keys(data.data.compositions[Object.keys(data.data.compositions)[0]]);
                }else{
                    headerComp = [];
                }
                
                that.setState({
                    hotelConfig : data.data.hotel,
                    roomTypesEquivHeaders : headerRooms,
                    roomTypesEquiv : data.data.rooms,
                    regimenEquivHeaders : headerReg,
                    regimenEquiv : data.data.regimenes,
                    compositionsHeaders : headerComp,
                    compositions : data.data.compositions,
                    readOnlyInputs : data.data.readonly,
                    showConfig : true
                }, () => {
                    $('.tab-content').show();
                    $('.tab-reservations:first').tab('show');
                    that.showAlertSuccess();
                });
            }).fail( (data, status) => { that.showAlertError(); })
        }
    }

    handleSearch(){
        this.getRemoteConfigReservations();
    }

    handleInputHeader(evt){
        const target = evt.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        let postState = this.state;
        postState[name] = value;
        postState['showConfig'] = false;

        this.setState(postState, () =>{
            $('#config-reservations-component .tab-content').hide();
        });
    }

    handleInput(evt){
        const target = evt.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        var postState = this.state;

        if( name === 'id_hotel_origen' || name === 'anticipo_caja' || name === 'anticipo_tipo_cobro' ){
            postState.hotelConfig[name] = value;
        }else{
            postState[name] = value;
        }

        this.setState(postState, () => {
            console.log('Input Editado');
        });
    }

    handleNew(evt){
        var propStateName = evt.target.dataset.listname;
        var postState = this.state;
        var obj = {};

        if(typeof postState[propStateName] !== 'undefined'){
            var headers = Object.keys(postState[propStateName][Object.keys(postState[propStateName])[0]]);
            for(var i in headers){
                obj[headers[i]] = '';
            }
            postState[propStateName].push(obj);

            this.setState(postState, () =>{
                this.showAlertSuccess();
            });
        }else{
            this.setBlankRecord();
        }
    }

    handleDelete(evt) {
        evt.stopPropagation();
        var that = this;
        let id = evt.target.dataset.id;
        let listName = evt.target.dataset.listname;
        let url;

        switch(listName){
            case 'regimenEquiv':
                url = 'regimenes';
            break;
            case 'roomTypesEquiv':
                url = 'roomtypes';
            break;
            case 'compositions':
                url = 'compositions';
            break;
        }

        if(confirm('Desea eliminar el registro?')) {
            if(typeof(id) !== 'undefined') {
                $.ajax({
                    type: 'DELETE',
                    url: this.serverUrl+'/reservations/config/'+url+'/'+this.state.hotel+'/'+this.state.origin+'/'+id,
                    beforeSend: (xhr) => {xhr.setRequestHeader('Authorization', Util.getCookie('tokenAccess'));}
                    }).done( (data, status) => {
                        if(data.data){
                            that.getRemoteConfigReservations();
                            this.showAlertSuccess();
                        }
                    }).fail((data, status) => {
                        this.showAlertError();
                });
            }
        }
    }

    handleEditCol(evt){
        evt.stopPropagation();
        const target = evt.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const nameField = target.name;
        const listName = target.dataset.listname;
        const listIndex = target.dataset.index;
        let postState = this.state;
        postState[listName][listIndex][nameField] = value;
        
        this.setState(postState, ()=> {
            console.log('Columna editada');
        });
    }

    handleSave(){
        if( !this.state.readOnlyInputs ){
            var that = this;
            $.ajax({
            type: 'POST',
            data: that.state,
            url: this.serverUrl+'/reservations/config',
            beforeSend: (xhr) => {xhr.setRequestHeader('Authorization', Util.getCookie('tokenAccess'));}
            }).done( (data, status) => {
                if(data.data){
                    that.showAlertSuccess();
                }
            }).fail( (data, status) => {
                that.showAlertError();
            }); 
        }
    }
    
    render (props) {
        return(
            <div id='config-reservations-component' >
                <div className='form-inline row p-3'>

                    <div className='input-group mr-2'>
                        <SelectInput resourceUrl='/users/profile/hotels/input' label='Hotel' id='hotel' name='hotel' handleChange={this.handleInputHeader}/>
                    </div>

                    <div className='input-group mr-2'>
                        <SelectInput resourceUrl='/reservations/config/origins' label='Origen' id='origin' name='origin' handleChange={this.handleInputHeader}/>
                    </div>

                    <button type='submit' className='btn btn_primary fa fa-search mr-2' onClick={this.handleSearch}></button>
                </div>
                { this.state.showConfig &&
                <ul className='nav nav-tabs'>
                    <li className='nav-item'>
                        <a className='nav-link tab-reservations' data-toggle='tab' href='#general'>GENERAL</a>
                    </li>
                    <li className='nav-item'>
                        <a className='nav-link tab-reservations' data-toggle='tab' href='#roomsTypes'>EQUIVALENCIAS HABITACIONES</a>
                    </li>
                    <li className='nav-item'>
                        <a className='nav-link tab-reservations' data-toggle='tab' href='#regimenes'>EQUIVALENCIAS REGIMENES</a>
                    </li>
                    <li className='nav-item'>
                        <a className='nav-link tab-reservations' data-toggle='tab' href='#compositions'>TRIPLETAS</a>
                    </li>
                </ul>
                }
                <div className='tab-content p-2'>
                    <div className='tab-pane fade' id='general' role='tabpanel'>
                        <div className='form-inline row'>
                            
                            <div className='input-group col-sm-4'>
                                <label htmlFor='id_hotel_origen' className='mr-2'>ID HOTEL ORIGEN</label>
                                <input className='form-control mb-1 mr-sm-1 mb-sm-0 m-1' name='id_hotel_origen' id='id_hotel_origen' value={this.state.hotelConfig.id_hotel_origen || ''} onChange={this.handleInput} onBlur={this.handleSave}/>
                            </div>
                            <div className='input-group col-sm-4'>
                                <label htmlFor='anticipo_caja' className='mr-2'>CODIGO DE CAJA</label>
                                <input className='form-control mb-1 mr-sm-1 mb-sm-0 m-1' name='anticipo_caja' id='anticipo_caja' value={this.state.hotelConfig.anticipo_caja || ''} onChange={this.handleInput} onBlur={this.handleSave}/>
                            </div>

                            <div className='input-group col-sm-4'>
                                <label htmlFor='anticipo_tipo_cobro' className='mr-2'>CODIGO TIPO DE COBRO</label>
                                <input className='form-control' name='anticipo_tipo_cobro' id='anticipo_tipo_cobro' value={this.state.hotelConfig.anticipo_tipo_cobro || ''} onChange={this.handleInput} onBlur={this.handleSave}/>
                            </div>
                        </div>
                    </div>
                    <div className='tab-pane fade p-2' id='roomsTypes' role='tabpanel'>
                        <TableRooms tableName='Equivalencias de habitaciones' nameIdRow='id_hab_hotel' listName='roomTypesEquiv' listHeaders={this.state.roomTypesEquivHeaders} listTable={this.state.roomTypesEquiv} handleNewRow={this.handleNew} handleDeleteRow={this.handleDelete} handleEditCol={this.handleEditCol} handleInputBlur={this.handleSave} readOnlyInputs={this.state.readOnlyInputs} />
                    </div>
                    <div className='tab-pane fade p-2' id='regimenes' role='tabpanel'>
                        <TableRegimen tableName='Equivalencias de regimenes' nameIdRow='id_reg_hotel' listName='regimenEquiv' listHeaders={this.state.regimenEquivHeaders} listTable={this.state.regimenEquiv} handleNewRow={this.handleNew} handleDeleteRow={this.handleDelete} handleEditCol={this.handleEditCol} handleInputBlur={this.handleSave} readOnlyInputs={this.state.readOnlyInputs} />
                    </div>
                    <div className='tab-pane fade p-2' id='compositions' role='tabpanel'>
                        <TableCompositions tableName='Tripletas' nameIdRow='referencia' listName='compositions' listHeaders={this.state.compositionsHeaders} listTable={this.state.compositions} handleClickRow={this.handleShowModal} handleNewRow={this.handleNew} handleDeleteRow={this.handleDelete} handleEditCol={this.handleEditCol} handleInputBlur={this.handleSave} readOnlyInputs={this.state.readOnlyInputs}/>
                    </div>
                </div>
            </div>
        )
    }
}

export default ConfigReservations;