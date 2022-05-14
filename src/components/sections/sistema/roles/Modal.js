import React, { Component } from 'react';
import FormBasicModal from '../../../common/FormBasicModal';
import Util from '../../../common/utils/Util';

class Modal extends FormBasicModal {
    constructor(props){
        super(props);
        this.nameForm = 'roles';
        this.state = {
            recordSelected: this.props.recordSelected,
            listRecords: []
        };

        this.handleInputPermissions = this.handleInputPermissions.bind(this);
    }

    handleInputPermissions(evt){
        const target = evt.target;
        const value = target.checked ? 1 : 0;
        const name = target.name;
        var postSelected = this.state.recordSelected;
        var elementPos;

        postSelected.permissions.map( (item, index) => {
            if(item.id_seccion === target.dataset.id){
                elementPos = index;
            }
        });

        postSelected.permissions[elementPos][name] = value;
        this.setState({
            recordSelected : postSelected
        });
    }

    handleSave(){      
        var data = this.state;
        for( var i = 0; i < data.recordSelected.permissions.length; i++ ){
            data.recordSelected.permissions[i].lectura = ( (data.recordSelected.permissions[i].lectura || data.recordSelected.permissions[i].lectura === '1') ? '1':'0');
            data.recordSelected.permissions[i].escritura = ( (data.recordSelected.permissions[i].escritura || data.recordSelected.permissions[i].escritura === '1') ? '1':'0');
            data.recordSelected.permissions[i].modificacion = ( (data.recordSelected.permissions[i].modificacion || data.recordSelected.permissions[i].modificacion === '1') ? '1':'0');
        }

        $.ajax({
            url: this.serverUrl+'/roles',
            type: 'POST',
            data: data,
            beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', Util.getCookie('tokenAccess'))}
        }).done(function(data,status){
            $('#modal-roles').modal('hide');
        }).fail( (data,status) =>{ 
            Util.showAlertError(status.statusText);
        });
    }
    
    render(){
        return(
            <div className='modal fade' id='modal-roles'>
                    <div className='modal-dialog' role='document'>
                            <div className='modal-content'>
                                <div className='modal-header'>
                                    <h5 className='modal-title'>ROL: {this.state.recordSelected.rol}</h5>
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
                                                <label htmlFor='inputId'>ROL</label>
                                                <input type='text' className='form-control' name='rol' value={this.state.recordSelected.rol} onChange={this.handleInput}/>
                                            </div>
                                            <div className='form-check'>
                                                <label className='form-check-label'>
                                                <input type='checkbox' className='form-check-input' name='jefe' checked={this.state.recordSelected.jefe} onChange={this.handleInput} />
                                                Jefe</label>
                                            </div>
                                        </form>
                                    </div>

                                <table className='col-sm-12 col-md-12 text-center'>
                                    <thead>
                                        <tr>
                                            <th>SECCI&Oacute;N</th>
                                            <th>LECTURA</th>
                                            <th>ESCRITURA</th>
                                            <th>MODIFICACI&Oacute;N</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.recordSelected.permissions.map((item, index) => {
                                            return (
                                                <tr key={'rol_'+index}>
                                                    <td>{item.seccion}</td>
                                                    <td><input name='lectura' data-id={item.id_seccion} type='checkbox' checked={item.lectura} onChange={this.handleInputPermissions}/></td>
                                                    <td><input name='escritura' data-id={item.id_seccion} type='checkbox' checked={item.escritura}  onChange={this.handleInputPermissions}/></td>
                                                    <td><input name='modificacion' data-id={item.id_seccion} type='checkbox' checked={item.modificacion}  onChange={this.handleInputPermissions}/></td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>

                            <div className='modal-footer'>
                                <button type='button' className='btn btn-primary' onClick={this.handleSave}>Guardar</button>
                                <button type='button' className='btn btn-secondary' data-dismiss='modal'>Cerrar</button>
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