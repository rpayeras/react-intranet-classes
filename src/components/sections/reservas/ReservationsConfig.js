import React from 'react';
import TableRooms from '../../common/FormTableEditable';
import TableRegimenes from '../../common/FormTableEditable';
import TableCompositions from '../../common/FormTableEditable';
import SelectInput from '../../common/forms/SelectInput';

import Common from '../../common/Common';
import Util from '../../common/utils/Util';

class ConfigReservations extends Common {
    constructor(props){
        super(props);
        this.name = 'Configuración de reservas';     

        this.state = {
            showTabs: false,
            operationsUrl : this.serverUrl+'/reservations/config',
            id_hotel : 0,
            origen: '',
            id_hotel_origen: '',
            anticipo_caja: '',
            anticipo_tipo_cobro: '',
            autoStartTables: false
        };

        this.handleInputSearch = this.handleInputSearch.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleSave = this.handleSave.bind(this);
    }
    
    handleInputSearch(evt){
        //Permitimos el arranque de las tablas que no son la config general
        const target = evt.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        let postSelected = this.state;        
        postSelected[name] = value;
        postSelected.autoStartTables = false;
        postSelected.showTabs = false;
        this.setState(postSelected);
    }

    handleSave(){
        var that = this;
        if(that.state.id_hotel > 0 && that.state.origen.length !== ''){
            $.ajax({
            type: 'POST',
            data: that.state,
            url: this.state.operationsUrl+'/general',
            beforeSend: (xhr) => {xhr.setRequestHeader('Authorization', Util.getCookie('tokenAccess'));}
            }).done( (data, status) => {
                if(data.status === 'success'){
                    that.showAlertSuccess();
                }else{
                    that.showAlertError(data.message);
                }
            }).fail( (data, status) => {
                that.showAlertError();
            }); 
        }
    }

    handleSearch(){
        if(this.state.id_hotel && this.state.origen){
            var that = this;

            //Permitimos el arranque de las tablas que no son la config general
            that.setState({
                autoStartTables: true
            });

            $.ajax({
            type: 'GET',
            url: this.serverUrl+'/reservations/config/general/'+this.state.id_hotel+'/'+this.state.origen,
            beforeSend: (xhr) => { xhr.setRequestHeader('Authorization', Util.getCookie('tokenAccess'));}
            }).done( (data, status) => {
                that.setState({
                    id_hotel_origen : data.data.id_hotel_origen,
                    anticipo_caja : data.data.anticipo_caja,
                    anticipo_tipo_cobro : data.data.anticipo_tipo_cobro,
                    showTabs: true
                }, () => {
                    $('.tab-content').show();
                    $('.tab-reservations:first').tab('show');

                    that.showAlertSuccess();
                });
            }).fail( (data, status) => { 
                this.setState({
                    autoStartTables: false,
                    showTabs: false
                });
                that.showAlertError(); 
            })
        }else{
            this.setState({
                autoStartTables: false,
                showTabs: false
            });        }
    }

    render (props) {
        let classShow = !this.state.showTabs ? 'd-none' : '';
        return(
            <div id='config-reservations-component' >
                <div className='form-inline row p-3'>
                    <div className='input-group mr-2'>
                        <SelectInput resourceUrl='/users/profile/hotels/input' label='Hotel' id='id_hotel' name='id_hotel' handleChange={this.handleInputSearch}/>
                    </div>
                    <div className='input-group mr-2'>
                        <SelectInput resourceUrl='/reservations/config/origins' label='Origen' id='origen' name='origen' handleChange={this.handleInputSearch}/>
                    </div>
                    <button type='submit' className='btn btn_primary fa fa-search mr-2' onClick={this.handleSearch}></button>
                </div>
                <ul className={'nav nav-tabs '+classShow}>
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
                <div className={'tab-content p-2 '+classShow}>
                    <div className='tab-pane fade' id='general' role='tabpanel'>
                        <div className='form-inline row'>
                            
                            <div className='input-group col-sm-4'>
                                <label htmlFor='id_hotel_origen' className='mr-2'>ID HOTEL ORIGEN</label>
                                <input className='form-control mb-1 mr-sm-1 mb-sm-0 m-1' name='id_hotel_origen' id='id_hotel_origen' value={this.state.id_hotel_origen || ''} onChange={this.handleInput} onBlur={this.handleSave}/>
                            </div>
                            <div className='input-group col-sm-4'>
                                <label htmlFor='anticipo_caja' className='mr-2'>CODIGO DE CAJA</label>
                                <input className='form-control mb-1 mr-sm-1 mb-sm-0 m-1' name='anticipo_caja' id='anticipo_caja' value={this.state.anticipo_caja || ''} onChange={this.handleInput} onBlur={this.handleSave}/>
                            </div>

                            <div className='input-group col-sm-4'>
                                <label htmlFor='anticipo_tipo_cobro' className='mr-2'>CODIGO TIPO DE COBRO</label>
                                <input className='form-control' name='anticipo_tipo_cobro' id='anticipo_tipo_cobro' value={this.state.anticipo_tipo_cobro || ''} onChange={this.handleInput} onBlur={this.handleSave}/>
                            </div>
                        </div>
                    </div>
                    <div className='tab-pane fade p-2' id='roomsTypes' role='tabpanel'>
                        <TableRooms name="EquivalenciasHabitaciones" getUrl={this.state.operationsUrl+'/equiv/roomtypes/'+this.state.id_hotel+'/'+this.state.origen} saveUrl={this.state.operationsUrl+'/equiv/roomtypes/'+this.state.id_hotel+'/'+this.state.origen} deleteUrl={this.state.operationsUrl+'/equiv/roomtypes/delete/'+this.state.id_hotel+'/'+this.state.origen} autoStart={this.state.autoStartTables} sendOldData={true} />
                    </div>
                    <div className='tab-pane fade p-2' id='regimenes' role='tabpanel'>
                        <TableRegimenes name="EquivalenciasRegimenes" getUrl={this.state.operationsUrl+'/equiv/regimenes/'+this.state.id_hotel+'/'+this.state.origen} saveUrl={this.state.operationsUrl+'/equiv/regimenes/'+this.state.id_hotel+'/'+this.state.origen} deleteUrl={this.state.operationsUrl+'/equiv/regimenes/delete/'+this.state.id_hotel+'/'+this.state.origen} autoStart={this.state.autoStartTables} sendOldData={true} />
                    </div>
                    <div className='tab-pane fade p-2' id='compositions' role='tabpanel'>
                        <TableCompositions name="Tripletas" getUrl={this.state.operationsUrl+'/equiv/compositions/'+this.state.id_hotel+'/'+this.state.origen} saveUrl={this.state.operationsUrl+'/equiv/compositions/'+this.state.id_hotel+'/'+this.state.origen} deleteUrl={this.state.operationsUrl+'/equiv/compositions/delete/'+this.state.id_hotel+'/'+this.state.origen} autoStart={this.state.autoStartTables} sendOldData={true} />
                    </div>
                </div>
            </div>
        )
    }
}

export default ConfigReservations;