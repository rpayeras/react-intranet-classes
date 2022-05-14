import React, { Component } from 'react';
import Util from '../../../common/utils/Util';
import Common from '../../../common/Common';

class UserProfilePasswordPci extends Common{
    constructor(props){
        super(props);

        this.state = {
            id: localStorage.getItem('userId'),
            oldPassword: '',
            newPassword : '',
            validations: {
                oldPassword: '',
                newPassword: ''
            }
        };

        this.handleSave = this.handleSave.bind(this);
    }

    componentWillUnmount(){
        this.cleanValidations();                 
    }

    handleSave(){
        let that = this;
        let resValidate = this.validateForm();

        if(resValidate){
            let data = {
                id: this.state.id,
                password: this.state.oldPassword,
                newPassword: this.state.newPassword,
                action: 'saveUserPassword'
            };
    
            $.ajax({
                type: 'POST',
                data: data,
                url: that.serverPciUrl
            }).done(function(data, status){
                data = JSON.parse(data);

                if(data === true || data === 'true'){
                    that.setState({oldPassword:'', newPassword:''}, () =>{
                        that.showAlertSuccess();
                    });  
                }else{
                    that.showAlertError(data);
                }
                
            }).fail(function(data, status){
                that.showAlertError();
            });
        }else{
            that.showAlertError('Introduzca ambos campos de password');
        }
    }

    cleanValidations(){
        let postState = this.state;
        for(let i in postState.validations){
            postState.validations[i] = '';
        }   

        this.setState(postState, () =>{
            console.log('Validaciones vaciadas');
        });     
    }

    validateForm(){
        let postState = this.state;
        let falses = 0;

        if(Object.keys(postState).indexOf('oldPassword') > 0){
            if((postState.oldPassword === null || postState.oldPassword === '') || (postState.oldPassword.length >= 7 && Util.validateField(postState.oldPassword, 'alphanumeric'))){
                postState.validations.oldPassword = 'is-valid';   
            }else{
                postState.validations.oldPassword = 'is-invalid';   
                falses++;
            }
        }

        if(Object.keys(postState).indexOf('newPassword') > 0){
            if((postState.newPassword === null || postState.newPassword === '') || Util.validateField(postState.newPassword, 'alphanumeric')){
                postState.validations.newPassword = 'is-valid';   
            }else{
                postState.validations.newPassword = 'is-invalid';   
                falses++;
            }
        }

        this.setState(postState);

        if(falses > 0){                    
            return false;
        }else{          
            return true;
        }     
    }

    render(){
        return(
            <div className='' id='form-passwordpci'>
                <strong>Cambiar contrase&ntilde;a de PCI:</strong>
                <div className='form-group row'>
                    <div className='col-6 text-center'>
                        <input className='form-control' type='password' name='oldPassword' value={this.state.oldPassword} id='old-password-pci-input' placeholder='Antiguo password PCI' onChange={this.handleInput}/>
                        <div className={"invalid-feedback "+this.state.validations.oldPassword}>La contraseña debe contener 7 caracteres, letras y numeros</div>                                                    
                    </div>
                </div>
                <div className='form-group row'>
                    <div className='col-6 text-center'>
                        <input className='form-control' type='password' name='newPassword' value={this.state.newPassword} id='new-password-pci-input' placeholder='Nuevo password PCI' onChange={this.handleInput}/>
                        <div className={"invalid-feedback "+this.state.validations.oldPassword}>La contraseña debe contener 7 caracteres, letras y numeros</div>                                                    
                    </div>
                </div>
                <div className=''>
                    <button type='button' className='btn btn-lg btn-primary' onClick={this.handleSave}>
                        <i className="fa fa-floppy-o" aria-hidden="true"></i> Guardar
                    </button>
                </div>
            </div> 
        )
    }
}

export default UserProfilePasswordPci;