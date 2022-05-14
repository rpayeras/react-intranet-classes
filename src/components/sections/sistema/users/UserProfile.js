import React from 'react';
import Common from '../../../common/Common';
import Util from '../../../common/utils/Util';
import Modal from './Modal';
import PasswordPci from './UserProfilePasswordPci';

class UserProfile extends Common {
    constructor(props){
        super(props);
        this.state = {
            usuario: '',
            nombre: '',
            departamento: '',
            email : '',
            showPciSection: false,
            oldPassword: '',
            newPassword :''
        };

        this.handleSaveGeneral = this.handleSaveGeneral.bind(this);
        this.handleChangePassword = this.handleChangePassword.bind(this);
    }

    componentWillMount(){
        var user;
        var that = this;
        var token = Util.getCookie('tokenAccess');

        $.ajax({
        type: 'GET',
        url: this.serverUrl+'/users/profile',
        beforeSend: function (xhr) {xhr.setRequestHeader('Authorization', Util.getCookie('tokenAccess'));}
        }).done(function(data,status){
            that.setState(data.data);
        }).fail(function(){
            that.showAlertError();
        });
    }

    handleSaveGeneral(){
        let validated = false;
        let data = {
            email: this.state.email
        };
        let that = this;
        
        if( Util.validateEmail(this.state.email) ){
            validated = true;
        }else{
            that.showAlertError('El formato del email no es valido');
        }

        if (validated) {
            $.ajax({
                type: 'POST',
                data: data,
                url: this.serverUrl+'/users/profile',
                beforeSend: function (xhr) {xhr.setRequestHeader('Authorization', Util.getCookie('tokenAccess'));}
            }).done(function(data,status){
                that.showAlertSuccess();
            }).fail(function(){
                that.showAlertError();
            });
        }
    }

    handleChangePassword(){
        let that = this;
        
        let data = {
            oldPassword: this.state.oldPassword,
            newPassword: this.state.newPassword
        };

        if ( data.oldPassword.length > 0 && data.newPassword.length > 0 ){
            $.ajax({
                type: 'POST',
                data: data,
                url: this.serverUrl+'/users/profile/password',
                beforeSend: function (xhr) {xhr.setRequestHeader('Authorization', Util.getCookie('tokenAccess'));}
            }).done(function(data, status){
                if( data.data ){
                    that.showAlertSuccess();
                }else{
                    that.showAlertError('El antiguo password no es correcto');
                }
                
            }).fail(function(data, status){
                that.showAlertError();
            });
        }else{
            that.showAlertError('Introduzca ambos campos de password');
        }
    }

    render (props) {
        return(
            <div id='page-user-component' className='p-1'>
                <h1 className='text-center'>{this.state.nombre}</h1>
                <h4 className='text-center'>@{this.state.usuario}</h4>
                <h4 className='text-center'>{this.state.departamento}</h4>
                
                <div className='card-deck'>
                    
                    <div className='card'>
                        <div className='card-block'>
                            <strong>Datos generales:</strong>
                            <div className='form-group row'>
                                <div className='col-6'>
                                    <label htmlFor='email' >Email:</label>
                                    <input className='form-control' name='email' type='email' value={this.state.email} placeholder='mail@primary.com' onChange={this.handleInput} />
                                </div>
                            </div>
                            <button type='button' className='btn btn-lg btn-primary' onClick={this.handleSaveGeneral}>Guardar</button>
                        </div>
                    </div>

                    <div className='card'>
                        <div className='card-block'>
                            <strong>Cambiar contrase&ntilde;a:</strong>
                            <div className='form-group row'>
                                <div className='col-6 text-center'>
                                    <input className='form-control' type='password' name='oldPassword' value={this.state.oldPassword} id='old-password-input' placeholder='Antiguo password' onChange={this.handleInput}/>
                                </div>
                            </div>
                            <div className='form-group row'>
                                <div className='col-6 text-center'>
                                    <input className='form-control' type='password' name='newPassword' value={this.state.newPassword} id='new-password-input' placeholder='Nuevo password' onChange={this.handleInput}/>
                                </div>
                            </div>
                            <button type='button' className='btn btn-lg btn-primary' onClick={this.handleChangePassword}>Guardar</button>
                        </div>
                    </div>
                    {this.state.showPciSection && (
                    <div className='card'>
                        <div className='card-block'>
                            <PasswordPci/>
                        </div>
                    </div>)}
                </div>
            </div>
        )   
    }
}

export default UserProfile;