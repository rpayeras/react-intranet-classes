import React, { Component } from 'react';
import FormBasicModal from '../../../common/FormBasicModal';
import Util from '../../../common/utils/Util';

class Modal extends FormBasicModal{
    constructor(props){
        super(props);
        this.nameForm = 'hotels';

        this.handleMultiselect = this.handleMultiselect.bind(this);
    }

    componentWillMount(){
        this.getRemoteZones();
    }

    getRemoteZones(){
        var that = this;
        $.ajax({
        type: 'GET',
        url: this.serverUrl+'/zones',
        beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', Util.getCookie('tokenAccess'))}
    }).done((data, status) =>{
            that.setState({
                listRecords : data.data,
            });
        }).fail( (data,status)=> {
            Util.showAlertError(status.statusText);
        }); 
    }

    handleMultiselect(evt){
        evt.preventDefault();
        evt.stopPropagation();
        const target = evt.target;

        if(target.parentElement.multiple) {
            const value = target.type === 'checkbox' ? target.checked : target.value;
            const name = target.parentElement.name;
            var postSelected = this.state.recordSelected;
        
            if(postSelected[name].indexOf(value) >= 0){
                postSelected[name] = Util.removeValueArray(postSelected[name], value);
            }else{
                postSelected[name].push(value);
            }
            postSelected[name].sort();
            
            this.setState({
                recordSelected : postSelected
            });
        }
    }
    render(){
        return(
            <div className='modal fade' id='modal-hotels'>
                    <div className='modal-dialog' role='document'>
                            <div className='modal-content'>
                            <div className='modal-header'>
                                <h5 className='modal-title'>{this.state.recordSelected.nombre}</h5>
                                <button type='button' className='close' data-dismiss='modal' aria-label='Close' >
                                    <span aria-hidden='true'>&times;</span>
                                </button>
                            </div>

                            <div className='modal-body'>
                                <ul className='nav nav-tabs' role='tablist'>
                                    <li className='nav-item'>
                                        <a className='nav-link active' data-toggle='tab' href='#general' role='tab' >GENERAL</a>
                                    </li>
                                </ul>

                                <div className='tab-content'>
                                    <div className='tab-pane active p-2' id='general' role='tabpanel'>
                                        <form>
                                            <div className='form-group'>
                                                <label htmlFor='inputId'>ID</label>
                                                <input type='text' className='form-control' name='id' readOnly value={this.state.recordSelected.id}/>
                                            </div>
                                            <div className='form-group'>
                                                <label htmlFor='inputId'>Nombre</label>
                                                <input type='text' className='form-control' name='nombre' value={this.state.recordSelected.nombre} onChange={this.handleInput}/>
                                            </div>
                                            <div className='form-group'>
                                                <label htmlFor='inputId'>Nombre descriptivo</label>
                                                <input type='text' className='form-control' name='nombre_desc' value={this.state.recordSelected.nombre_desc} onChange={this.handleInput}/>
                                            </div>
                                            <div className='form-group'>
                                                <label htmlFor='inputId'>ID Hotel Real</label>
                                                <input type='text' className='form-control' name='id_hotel_real' value={this.state.recordSelected.id_hotel_real} onChange={this.handleInput}/>
                                            </div>
                                            <div className='form-group'>
                                                <label>Zona</label>
                                                <select className='form-control' name='id_zona' value={this.state.recordSelected.id_zona || ''} onChange={this.handleInput}>
                                                    <option value=''></option>
                                                    {this.state.listRecords.map((item, index) => {
                                                        return (<option key={'id_zona-'+index} value={item.id}>{item.zona}</option>);
                                                    })}
                                                </select>
                                            </div>
                                            <div className='form-group'>
                                                <label>Tipo de informe</label>
                                                <select className='form-control' id='tipo_informes' name='tipo_informes' value={this.state.recordSelected.tipo_informes || ''} onChange={this.handleInput} onClick={this.handleMultiselect} multiple>
                                                    <option value='1'>contabilidad</option>
                                                    <option value='2'>ocupacion</option>
                                                    <option value='3'>eshotel</option>
                                                </select>
                                            </div>
                                        </form>
                                    </div>

                                </div>

                            <div className='modal-footer'>
                                <button type='button' className='btn btn-primary' onClick={this.handleSave}>Guardar</button>
                                <button type='button' className='btn btn-secondary' data-dismiss='modal'>Cerrar</button>
                            </div>

                        </div>
                        </div>
                    </div>  
                </div>  
        )
    }
}

export default Modal;