import React from 'react';
import { withRouter } from 'react-router-dom';
import Common from '../../common/Common';
import Util from '../../common/utils/Util';

class NewPassword extends Common{
    constructor(){
        super();
        this.state = {
            oldPassword : '',
            newPassword : '',
            repeatPassword : ''
        }

        this.handleLogin = this.handleLogin.bind(this);
    }

    handleLogin(evt){
        evt.preventDefault();
        let that = this;
        
        if( this.state.newPassword === this.state.repeatPassword){
            $.ajax({
            type: 'POST',
            url: this.serverUrl+'/login/renew',
            data: this.state,
            beforeSend: (xhr) => {xhr.setRequestHeader('Authorization', Util.getCookie('tokenAccess'))}})
            .done(function(data){
                that.props.history.push('/');
            }).fail(function(){
                Util.showAlertError();
            });
        }else{
             Util.showAlertError();
        }
    }

    render(){
        return(
            <div id='newpassword-component' className='container-fluid'>
                    <form className='form-sigin'>
                        <h2 className='form-sigin-heading'>INTRANET 2.0</h2>
                        <p> Su contraseña ha caducado, debe introducir una nueva para continuar:</p>
                        <label htmlFor='old-password' className='sr-only'></label>
                        <input type='password' name='oldPassword' value={this.state.oldPassword} onChange={this.handleInput} placeholder='Antigua contraseña' />
                        <label htmlFor='new-password' className='sr-only'></label>
                        <input type='password' name='newPassword' value={this.state.newPassword} onChange={this.handleInput} placeholder='Nueva contraseña' />
                        <label htmlFor='repeat-password' className='sr-only'>Repita contraseña</label>
                        <input type='password' name='repeatPassword' value={this.state.repeatPassword} onChange={this.handleInput} placeholder='Repetir contraseña'/>
                        <button className='btn btn-lg btn-primary btn-block' onClick={this.handleLogin}>Guardar</button>
                    </form>
                <div className='alert alert-danger col-sm-3 hidden' role='alert'>
                    Las contraseñas no coinciden
                </div>
            </div>
        )
    }
}

export default withRouter(NewPassword);