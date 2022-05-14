import React, { Component } from 'react';
import FormBasicModal from '../../../common/FormBasicModal';
import Util from '../../../common/utils/Util';
import Externos from '../../../common/tables/TableEditableOld';

class Modal extends FormBasicModal {
    constructor(props){
        super(props);
        this.nameForm = 'users';
        this.props.recordSelected.activo = (this.props.recordSelected.activo === '1') ? true : false;
        this.closeTimeout = '';

        this.state = {
            recordSelected: this.props.recordSelected,
            listRoles : [],
            listDepartments : [],
            externalsHeaders : ['ID Usuario Externo', 'Servicio'],
            externals: [],
            hotelConfig : [],
            validations: {
                pciPasswordValidClass: '',
                ipValidClass: ''
            }
        };

        this.handleInputUserHotels = this.handleInputUserHotels.bind(this);
        this.handleExpired = this.handleExpired.bind(this);
        this.handleExpiredPci = this.handleExpiredPci.bind(this);
        this.generatePassword = this.generatePassword.bind(this);
        
        
        this.handleNewExternals = this.handleNewExternals.bind(this);
        this.handleDeleteExternals = this.handleDeleteExternals.bind(this);
        this.handleEditColExternals = this.handleEditColExternals.bind(this);
    }

    componentWillMount(){
        this.getRemoteRoles();
        this.getRemoteDepartments();
    }

    componentDidMount(){
        //Pasamos los usuarios externos al componente TableEditable si todo el componente ha terminado de montarse
        let postState = this.state;
        postState.externals = this.state.recordSelected.externals;
        this.setState(postState);
        this.closeTimeout = setTimeout(this.closeModal(), 5000)
    }

    componentWillReceiveProps(nextProps) {
        nextProps.recordSelected.activo = (nextProps.recordSelected.activo === '1') ? true : false;
        
        this.setState({
            recordSelected : nextProps.recordSelected,
            externals: nextProps.recordSelected.externals
        }, () => {
          this.closeTimeout = setTimeout(this.closeModal(), 5000)
        });
    }

    componentWillUnmount(){
        clearTimeout(this.closeTimeout);        
    }

    handleSave(){  
        var that = this;
        let postState = this.state;
        let resValidate = this.validateBeforeSend();

        if(resValidate){
            $.ajax({
            type: 'POST',
            url: this.serverUrl+'/'+this.nameForm,
            data: postState,
            beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', Util.getCookie('tokenAccess'))}
            }).done((data, status) =>{
                let closeModal = true;
                let posError;
                postState.recordSelected.password_pci = '';

                //Print errors
                for(let i in data.message){
                    if(data.message[i] !== true){
                        posError = i;
                    }
                }

                if(posError >= 0){
                    that.showAlertError(data.message[posError]);
                    closeModal = false;
                }

                that.setState(postState, () => {
                    if(closeModal){
                        that.closeModal();                        
                    }
                });
            }).fail( (data,status)=> {
                Util.showAlertError(status.statusText);
            });  
        }
    }

    handleExpired(){  
        let that = this;
        if (confirm('Este usuario deberá cambiar su contraseña, esta seguro?')){
            $.ajax({
                type: 'GET',
                url: this.serverUrl+'/'+this.nameForm+'/'+this.state.recordSelected.id+'/expired',
                beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', Util.getCookie('tokenAccess'))}
            }).done((data, status) =>{
                if( data.data === true ){
                    $('#modal-'+this.nameForm).modal('hide');
                    that.showAlertSuccess();
                }else{
                    that.showAlertError(status.statusText);
                }
                
            }).fail( (data,status)=> {
                that.showAlertError(status.statusText);
            });  
        } 
    }

    handleInputUserHotels(evt){
        const target = evt.target;
        const value = target.checked ? 1 : 0;
        var postSelected = this.state.recordSelected;
        var elementPos;

        postSelected.hotels.map( (item, index) => {
            if(item.id === target.dataset.id){
                elementPos = index;
            }
        });

        postSelected.hotels[elementPos]['act'] = value;

        this.setState({
            recordSelected : postSelected
        })
    }

    handleNewExternals(evt){
        var propStateName = evt.target.dataset.listname;
        var postState = this.state;
        var obj = {};

        if(typeof postState[propStateName] !== 'undefined' && postState[propStateName].length > 0){
            var headers = Object.keys(postState[propStateName][Object.keys(postState[propStateName])[0]]);
            for(var i in headers){
                obj[headers[i]] = '';
            }
            postState[propStateName].push(obj);
        }else{
            postState[propStateName].push({id_usuario_ext: "1", servicio: "Nuevo"});
        }

        this.setState(postState, () =>{
            this.showAlertSuccess();
        });
    }

    handleDeleteExternals(evt) {
        evt.stopPropagation();
        var that = this;
        let id = evt.target.dataset.id;
        let listName = evt.target.dataset.listname;

        if(confirm('Desea eliminar el registro?')){
            if(typeof(id) !== 'undefined'){
                $.ajax({
                    type: 'DELETE',
                    url: this.serverUrl+'/users/'+that.state.recordSelected.id+'/externals/'+id,
                    beforeSend: (xhr) => {xhr.setRequestHeader('Authorization', Util.getCookie('tokenAccess'));}
                }).done( (data, status) => {
                    let postState = that.state;
                    postState.recordSelected.externals = data.data;
                    postState.externals = data.data;
                    that.setState(postState);
                }).fail( (data, status) => {
                        that.showAlertError();
                });
            }
        }
    }

    handleEditColExternals(evt){
        evt.stopPropagation();
        const target = evt.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const nameField = target.name;
        const listName = target.dataset.listname;
        const listIndex = target.dataset.index;
        let postState = this.state;
        postState[listName][listIndex][nameField] = value;
        
        this.setState(postState, ()=> {
            console.log('Columna editada');
        });
    }

    getCheckedHotels(recordSelected){
        var newListHotels = this.state.listHotels.map( (value, index) => {
            if(recordSelected.hotels.indexOf(value.id) >= 0){
                value.act = true;
            }else{
                value.act = false;
            }

            return value;
        });

        this.setState({
            listHotels : newListHotels
        });
    }

    getRemoteRoles(){
        var that = this;

        $.ajax({
            url: this.serverUrl+'/roles',
            type: 'GET',
            beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', Util.getCookie('tokenAccess'))}
        }).done(function(data,status){
            that.setState({
                listRoles : data.data,
            });
        })
    }

    getRemoteDepartments(){
        var that = this;

        $.ajax({
            url: this.serverUrl+'/departments',
            type: 'GET',
            beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', Util.getCookie('tokenAccess'))}
        }).done(function(data,status){
            that.setState({
                listDepartments : data.data,
            });
        })
    }

    setBlankRecordExternals(){
        var that = this;
        $.ajax({
            url: this.serverUrl+'/users/'+that.state.recordSelected.id+'/externals',
            type: 'POST',
            beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', Util.getCookie('tokenAccess'))}
        }).done(function(data,status){
            if( data.data.length > 0 ){
                that.setState({
                    externals : data.data
                });
            }
        })
    }

    validateBeforeSend(){
        let postState = this.state;
        let falses = 0;

        if(Object.keys(postState.recordSelected).indexOf('password_pci') > 0){
            if((postState.recordSelected.password_pci === null || postState.recordSelected.password_pci === '') || (postState.recordSelected.password_pci.length >= 7 && Util.validateField(postState.recordSelected.password_pci, 'alphanumeric'))){
                postState.validations.pciPasswordValidClass = 'is-valid';   
            }else{
                postState.validations.pciPasswordValidClass = 'is-invalid';   
                falses++;
            }
        }

        if(Object.keys(postState.recordSelected).indexOf('ip_pci') > 0){
            if((postState.recordSelected.ip_pci === null || postState.recordSelected.ip_pci === '') || Util.validateField(postState.recordSelected.ip_pci, 'ip')){
                postState.validations.pciIpValidClass = 'is-valid';   
            }else{
                postState.validations.pciIpValidClass = 'is-invalid';   
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

    cleanValidations(){
        let postState = this.state;
        for(let i in postState.validations){
            postState.validations[i] = '';
        }   

        this.setState(postState, () =>{
            console.log('Validaciones vaciadas');
        });     
    }

    generatePassword(evt){
        evt.stopPropagation();
        const target = evt.target.dataset.target;
        let postState = this.state;
        postState.recordSelected[target] = Math.random().toString(36).substring(2);
        this.setState(postState);
    }

    handleExpiredPci(evt){
        evt.stopPropagation();
        let that = this;
        if (confirm('Este usuario deberá cambiar su contraseña de pci y será caducado, esta seguro?')){
            const target = evt.target.dataset.target;
            let postState = this.state;
            postState.recordSelected[target] = '123456a';

            this.setState(postState, function(){
                $.ajax({
                    type: 'GET',
                    url: this.serverUrl+'/'+this.nameForm+'/pci/'+this.state.recordSelected.id+'/expired',
                    beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', Util.getCookie('tokenAccess'))}
                }).done((data, status) =>{
                    if( data.data === true ){
                        that.showAlertSuccess();
                    }else{
                        that.showAlertError(data.message);
                    }
                    
                }).fail( (data,status)=> {
                    that.showAlertError(status.statusText);
                });  
            });
        }
    }
    
    closeModal(){
        $('#modal-'+this.nameForm).modal('hide');
        this.cleanValidations();                 
        this.showAlertSuccess();
    }

    render(){
        return(
            <div className='modal fade' id='modal-users'>
                    <div className='modal-dialog' role='document'>
                            <div className='modal-content'>
                                {/* HEADER */}
                                <div className='modal-header'>
                                    <h5 className='modal-title'>{this.state.recordSelected.nombre}</h5>
                                    <button type='button' className='close' data-dismiss='modal' aria-label='Close' >
                                        <span aria-hidden='true'>&times;</span>
                                    </button>
                                </div>

                                {/* TABS */}
                                <div className='modal-body'>
                                    <ul className='nav nav-tabs' role='tablist'>
                                        <li className='nav-item'>
                                            <a className='nav-link active' data-toggle='tab' href='#general' role='tab' >GENERAL</a>
                                        </li>
                                        <li className='nav-item'>
                                            <a className='nav-link' data-toggle='tab' href='#opciones' role='tab'>OPCIONES</a>
                                        </li>
                                        <li className='nav-item'>
                                            <a className='nav-link' data-toggle='tab' href='#pci' role='tab'>PCI</a>
                                        </li>
                                        <li className='nav-item'>
                                            <a className='nav-link' data-toggle='tab' href='#hoteles' role='tab'>HOTELES</a>
                                        </li>
                                        <li className='nav-item'>
                                            <a className='nav-link' data-toggle='tab' href='#externos' role='tab'>EXTERNOS</a>
                                        </li>
                                    </ul>

                                    <div className='tab-content'>
                                        {/* PRINCIPAL */}
                                        <div className='tab-pane active p-2' id='general' role='tabpanel'>
                                            <form>
                                                <div className='form-group'>
                                                    <label htmlFor='id'>ID</label>
                                                    <input type='text' className='form-control' name='id' value={this.state.recordSelected.id} onChange={this.handleInput}/>
                                                </div>
                                                <div className='form-group'>
                                                    <label htmlFor='nombre'>Nombre</label>
                                                    <input type='text' className='form-control' name='nombre' value={this.state.recordSelected.nombre} onChange={this.handleInput}/>
                                                </div>
                                                <div className='form-group'>
                                                    <label htmlFor='usuario'>Nombre de usuario</label>
                                                    <input type='text' className='form-control' name='usuario' value={this.state.recordSelected.usuario} onChange={this.handleInput}/>
                                                </div>
                                                <div className='form-group'>
                                                        <label htmlFor='password'>Password</label>
                                                        <div className="row p-3">
                                                            <input type='text' className='form-control col-sm-11' name='password' value={this.state.recordSelected.password} onChange={this.handleInput}/>
                                                            <button type='button' className='btn btn-primary fa fa-refresh col-sm-1' onClick={this.generatePassword} data-target="password" />
                                                        </div>
                                                </div>
                                                <div className='form-group'>
                                                    <label>ROL</label>
                                                    <select className='form-control' name='id_rol' value={this.state.recordSelected.id_rol || ''} onChange={this.handleInput}>
                                                        <option value=''></option>
                                                        {this.state.listRoles.map((rol, index) => {
                                                                return (<option key={'list_roles_'+rol.rol+rol.id} value={rol.id}>{rol.rol}</option>);
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                                <div className='form-group'>
                                                    <label>DEPARTAMENTO</label>
                                                    <select className='form-control' name='id_departamento' value={this.state.recordSelected.id_departamento || ''} onChange={this.handleInput}>
                                                        <option value=''></option>
                                                        {this.state.listDepartments.map((dep, index) => {
                                                                return (<option key={'list_dep_'+dep.nombre+dep.id} value={dep.id}>{dep.nombre}</option>);
                                                            })
                                                        }
                                                    </select>
                                                </div>
                                                <div className='form-check'>
                                                    <label className='form-check-label'>
                                                    <input type='checkbox' className='form-check-input' name='activo' checked={this.state.recordSelected.activo} onChange={this.handleInput} /><span> </span>
                                                    Activo</label>
                                                </div>
                                            </form>
                                        </div>

                                        {/* PCI */}
                                        <div className='tab-pane p-2' id='pci' role='tabpanel'>
                                            <form>
                                                <div className='form-group'>
                                                    <label htmlFor='ip_pci'>IP</label>
                                                    <input type='text' className='form-control' name='ip_pci' value={this.state.recordSelected.ip_pci} onChange={this.handleInput}/>
                                                    <div className={"invalid-feedback "+this.state.validations.pciIpValidClass}>La ip debe contener el formato XXX.XXX.XXX.XXX</div>                                                    
                                                </div>
                                                <div className='form-group'>
                                                    <label htmlFor='password_pci'>Password PCI</label>
                                                    <div className="row p-3">
                                                        <input type='text' className={"form-control col-sm-11 "+this.state.validations.pciPasswordValidClass} name="password_pci" value={this.state.recordSelected.password_pci} placeholder={this.state.recordSelected.password_pci_placeholder} onChange={this.handleInput} />
                                                        <button type='button' className='btn btn-danger col-sm-1 fa fa-refresh' onClick={this.handleExpiredPci} data-target="password_pci_placeholder" title="Caducar password pci"/>
                                                        <div className={"invalid-feedback "+this.state.validations.pciPasswordValidClass}>La contraseña debe contener 7 caracteres, letras y numeros</div>                                                    
                                                    </div>
                                                </div>
                                            </form>
                                        </div>

                                        {/* OTRAS OPCIONES */}
                                        <div className='tab-pane p-2' id='opciones' role='tabpanel'>
                                            <div className='form-check'>
                                                <label className='form-check-label'>
                                                    <input className='form-check-input' type='checkbox' value='' /><span> </span>
                                                    Master
                                                </label>
                                            </div>
                                            <div className='form-check'>
                                                <label className='form-check-label'>
                                                    <input className='form-check-input' type='checkbox' value='' /><span> </span>
                                                    Mensaje de bienvenida
                                                </label>
                                            </div>
                                        </div>

                                        {/* HOTELES */}
                                        <div className='tab-pane p-2' id='hoteles' role='tabpanel'>
                                            <div className='row'>

                                                <div className='col-sm-6 col-md-6'>
                                                {this.state.recordSelected.hotels.map((hot, index) => {
                                                    if(index <= this.state.recordSelected.hotels.length / 2 ){
                                                        return (
                                                        <div className='form-check' key={'list_hotels_'+hot.nombre+hot.id}>
                                                            <label className='form-check-label'>
                                                                <input data-id={hot.id} className='form-check-input' type='checkbox' checked={hot.act}  onChange={this.handleInputUserHotels}/>
                                                                <span> </span>{hot.descripcion}
                                                            </label>
                                                        </div>);
                                                    }
                                                })}
                                                </div>

                                                <div className='col-sm-6 col-md-6'>
                                                {this.state.recordSelected.hotels.map((hot, index) => {
                                                    if(index > this.state.recordSelected.hotels.length / 2 ){
                                                        return (
                                                            <div className='form-check' key={'list_hotels_'+hot.nombre+hot.id}>
                                                                <label className='form-check-label'>
                                                                    <input data-id={hot.id} className='form-check-input' type='checkbox' checked={hot.act} onChange={this.handleInputUserHotels}/>
                                                                    <span> </span>{hot.descripcion}
                                                                </label>
                                                            </div>
                                                        );
                                                    }
                                                })}
                                                </div>
                                                
                                            </div>
                                        </div>
                                        <div className='tab-pane p-2' id='externos' role='tabpanel'>
                                            <Externos tableName='Usuarios externos' nameIdRow='servicio' listName='externals' listHeaders={this.state.externalsHeaders} listTable={this.state.externals} handleNewRow={this.handleNewExternals} handleDeleteRow={this.handleDeleteExternals} handleEditCol={this.handleEditColExternals} />
                                        </div>
                                    </div>
                                {/* FOOTER Y BOTONES */}
                                <div className='modal-footer'>
                                    <button type='button' className='btn btn-danger' onClick={this.handleExpired}>Forzar caducidad</button>
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