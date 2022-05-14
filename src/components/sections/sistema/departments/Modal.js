import React, { Component } from 'react';
import FormBasicModal from '../../../common/FormBasicModal';
import Util from '../../../common/utils/Util';

class Modal extends FormBasicModal {
    constructor(props){
        super(props);
        this.nameForm = 'departments';
    }
    
    render(){
        return(
            <div className='modal fade' id='modal-departments'>
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
                                                <label htmlFor='inputId'>Codigo</label>
                                                <input type='text' className='form-control' name='codigo' value={this.state.recordSelected.codigo} onChange={this.handleInput}/>
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