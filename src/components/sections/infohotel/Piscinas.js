import React from 'react';
import Util from '../../common/utils/Util';

class Piscinas extends React.Component{

    constructor(props){
        super(props);
        this.serverUrl = Util.urlServer;
        this.state = {
            userId : ''
        }
    }

    componentDidMount(){
        this.getRemoteUserId();
    }

    getRemoteUserId(){
        var that = this;
        $.ajax({
            type: 'GET',
            url: this.serverUrl+'/users/profile/id',
            beforeSend: (xhr) => {xhr.setRequestHeader('Authorization', Util.getCookie('tokenAccess'));}
        }).done( (data, status) => {
            that.setState({
                userId : data.data
            });
        }).fail( (data, status) => { Util.showAlertError(); });
    }

    render(){
        return(
            <div className='p-3' id="informes-tui-component">
                <h3 className='panel-title'>Gestión de piscinas:</h3>
                <form className="form-inline" method="POST" action="http://192.168.0.10/prg/crea_piscinas.php" target="_blank">
                    <input type="hidden" name="IdUs" value={this.state.userId}/>
                    <input type="submit" value="Ir a Gestión de Piscinas"/>
                </form>
            </div>
        )
    }
}

export default Piscinas;