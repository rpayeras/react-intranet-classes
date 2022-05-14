import React, { Component } from 'react';
import FormBasicModal from '../../../common/FormBasicModal';
import Util from '../../../common/utils/Util';

class Modal extends FormBasicModal {
    constructor(props){
        super(props);
        this.nameForm = 'sections';
        this.props.recordSelected.workers = (this.props.recordSelected.workers === '1') ? true : false;
        this.state = {
            recordSelected: this.props.recordSelected,
            listRecords: [],
            listOrder: [0,1,2,3,4,5,6,7,8,9]
        };
    }

    componentWillMount(){
        this.getRemoteSections();
    }

    getRemoteSections(){
        var that = this;
        $.ajax({
        type: 'GET',
        url: this.serverUrl+'/sections',
        data: this.state,
        beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', Util.getCookie('tokenAccess'))}
        }).done((data, status) =>{
            that.setState({
                listRecords : data.data,
            });
        }).fail( (data,status)=> {
            Util.showAlertError(status.statusText);
        }); 
    }
    
    render(){
        return(
            <div className='modal fade' id='modal-sections'>
                    <div className='modal-dialog' role='document'>
                        <div className='modal-content'>
                            <div className='modal-header'>
                                <h5 className='modal-title'>{this.state.recordSelected.seccion}</h5>
                                <button type='button' className='close' data-dismiss='modal' aria-label='Close' >
                                    <span aria-hidden='true'>&times;</span>
                                </button>
                            </div>

                            <div className='modal-body'>
                                <ul className='nav nav-tabs' role='tablist'>
                                    <li className='nav-item'>
                                        <a className='nav-link active' data-toggle='tab' href='#general' role='tab' >GENERAL</a>
                                    </li>
                                    <li className='nav-item'>
                                        <a className='nav-link' data-toggle='tab' href='#workers' role='tab' >WORKERS</a>
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
                                                <label htmlFor='inputId'>Seccion</label>
                                                <input type='text' className='form-control' name='seccion' value={this.state.recordSelected.seccion} onChange={this.handleInput}/>
                                            </div>
                                            <div className='form-group'>
                                                <label htmlFor='inputId'>Menu</label>
                                                <input type='text' className='form-control' name='menu' value={this.state.recordSelected.menu} onChange={this.handleInput}/>
                                            </div>
                                            <div className='form-group'>
                                                <label htmlFor='inputId'>Modulo</label>
                                                <input type='text' className='form-control' name='modulo' value={this.state.recordSelected.modulo} onChange={this.handleInput}/>
                                            </div>
                                            <div className='form-group'>
                                                <label>SECCION PADRE</label>
                                                <select className='form-control' name='id_seccion_padre' value={this.state.recordSelected.id_seccion_padre || ''} onChange={this.handleInput}>
                                                    <option value=''></option>
                                                    {this.state.listRecords.map((item, index) => {
                                                            if( this.state.recordSelected.id !== item.id ){
                                                                return (<option key={'seccion_padre-'+index} value={item.id}>{item.seccion}</option>);
                                                            }
                                                        })
                                                    }
                                                </select>
                                            </div>
                                            <div className='form-group'>
                                                <label htmlFor='inputId'>Icono</label>
                                                <input type='text' className='form-control' name='icono' value={this.state.recordSelected.icono} onChange={this.handleInput}/>
                                            </div>
                                            <div className='form-group'>
                                                <label>ORDEN</label>
                                                <select className='form-control' name='orden' value={this.state.recordSelected.orden || ''} onChange={this.handleInput}>
                                                    <option value=''></option>
                                                    {this.state.listOrder.map((item, index) => {
                                                            return (<option key={'orden-'+index} value={item}>{item}</option>);
                                                        })
                                                    }
                                                </select>
                                            </div>
                                        </form>
                                    </div>
                                    <div className='tab-pane p-2' id='workers' role='tabpanel'>
                                        <form>
                                        <div className='form-check'>
                                                <label className='form-check-label'>
                                                <input type='checkbox' className='form-check-input' name='workers' checked={this.state.recordSelected.workers} onChange={this.handleInput} /><span> </span>
                                                Usuario workers</label>
                                            </div>
                                            <div className='form-group'>
                                                <label htmlFor='inputId'>Icono</label>
                                                <input type='text' className='form-control' name='icono_workers' value={this.state.recordSelected.icono_workers} onChange={this.handleInput}/>
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