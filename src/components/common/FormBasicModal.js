import React from 'react';
import Common from './Common';
import Util from '../common/utils/Util';

class FormBasicModal extends Common {
    constructor(props){
        super(props);
        this.nameForm = 'hotels';
        this.readOnlyInputs = false;
        
        this.state = {
            recordSelected: this.props.recordSelected,
            listRecords: []
        };

        this.handleInput = this.handleInput.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.closeSelfModal = this.closeSelfModal.bind(this);
    }
    
    componentWillReceiveProps(nextProps) {
        this.setState({
            recordSelected : nextProps.recordSelected,
        });
    }

    handleInput(evt){
        const target = evt.target;
        if(!target.multiple){
            const value = target.type === 'checkbox' ? target.checked : target.value;
            const name = target.name;
            var postSelected = this.state.recordSelected;
            postSelected[name] = value;
            this.setState({
                recordSelected : postSelected
            });
        }
    }

    handleSave(){  
        let that = this;

        $.ajax({
        type: 'POST',
        url: this.serverUrl+'/'+this.nameForm,
        data: this.state,
        beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', Util.getCookie('tokenAccess'))}
        }).done((data, status) =>{
            $('#modal-'+this.nameForm).modal('hide');
            that.showAlertSuccess();
        }).fail( (data,status)=> {
            that.showAlertError(status.statusText);
        });    
    }

    closeSelfModal(evt){
        evt.preventDefault();
        evt.stopPropagation();
        console.log("close rest");
        $('#modal-'+this.nameForm).modal('hide');
    }

    render(){
        let buttonSave;

        if( typeof this.props.handleSave !== 'undefined' && !this.readOnlyInputs ){
            buttonSave = (<button type='button' className='btn btn-primary' onClick={this.handleSave}>Guardar</button>);
        }else{
            buttonSave = (<span></span>);
        }

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
                                        </form>
                                    </div>

                                </div>

                            <div className='modal-footer'>
                                {buttonSave}
                                <button type='button' className='btn btn-secondary' data-dismiss='modal'>Cerrar</button>
                            </div>

                        </div>
                        </div>
                    </div>  
                </div>  
        )
    }
}

export default FormBasicModal;