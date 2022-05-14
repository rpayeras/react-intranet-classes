import React from 'react';
import Common from '../../common/Common';
import Util from '../../common/utils/Util';
import './Login.scss';

class Login extends Common{
    constructor(){
        super();
        this.state = {
            user : localStorage.getItem('user') || '',
            password : '',
            rememberMe : false
        }

        this.handleLogin = this.handleLogin.bind(this);
        this.inputRememberMe = this.inputRememberMe.bind(this);
    }

    componentDidMount(){
        if(localStorage.getItem('user') !== null ){
            document.getElementById('login-remember').checked = true;
            document.getElementById('login-password').focus();
        }else{
            document.getElementById('login-user').focus();
        }
    }

    inputRememberMe(event){
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;

        if ( value ){
            localStorage.setItem('user', this.state.user);
        }else{
            localStorage.setItem('user', '');
        }
        
    }

    handleLogin(evt){
        evt.preventDefault();
        let that = this;

        $.ajax({
        type: 'POST',
        url: this.serverUrl+'/login',
        data: this.state})
        .done(function(data){
            if( typeof data.data !== 'undefined' && typeof data.data.token !== 'undefined' ){
                Util.setCookie('tokenAccess', data.data.token);
                Util.setCookie('userId', data.data.user_id);

                if(data.data.expired ){
                    that.props.history.push("/newpassword");
                }else{
                    that.props.history.push("/app");
                }
                
            }else{
                that.showAlertError();
            }
        }).fail(function(){
            that.showAlertError();
        });
    }

    render(){
        return(
            <div id='login-component' className='container-fluid'>
                    <form className='form-sigin'>
                        <h2 className='form-sigin-heading'>INTRANET 2.0</h2>
                        <label htmlFor='user' className='sr-only'>User</label>
                        <input id="login-user" type='text' name='user' value={this.state.user} onChange={this.handleInput} placeholder='Usuario'/>
                        <label htmlFor='password' className='sr-only'>Password</label>
                        <input id="login-password" type='password' name='password' value={this.state.password} onChange={this.handleInput} placeholder='Password'/>
                        <div className='checkbox'>
                            <label>
                                <input id="login-remember" type='checkbox' onChange={this.inputRememberMe} /> Recuerdame
                            </label>
                        </div>
                        <button className='btn btn-lg btn-primary btn-block' onClick={this.handleLogin}>Login</button>
                    </form>
                <div className='alert alert-danger col-sm-3 hidden' role='alert'>
                    Usuario/Password incorrecto
                </div>
            </div>
        )
    }
}

export default Login;