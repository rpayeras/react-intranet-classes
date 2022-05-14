import React from 'react';
import Common from './Common';
import Util from '../common/utils/Util';
import TableEditable from './tables/TableEditable';

class FormTableEditable extends Common {
    constructor(props){
        super(props);
        this.name = this.props.name;
        this.rowIdName = 'id';
        this.firstReload = false;
        this.changingState = false;
        this.timeoutChangeCol = '';
        this.sendOldData = this.props.sendOldData ? this.props.sendOldData : false;
        this.oldData = [];
        this.showDuplicateRow = this.props.sendOldData ? false : true;

        this.state = {
            data: [],
            getUrl: this.props.getUrl,
            saveUrl: this.props.saveUrl,
            deleteUrl: this.props.deleteUrl,
            autoStart: this.props.autoStart ? this.props.autoStart : true
        };

        this.handleReloadTable = this.handleReloadTable.bind(this);        
        this.handleDelete = this.handleDelete.bind(this);
        this.handleDuplicate = this.handleDuplicate.bind(this);        
        this.handleSave = this.handleSave.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleChangeCol = this.handleChangeCol.bind(this);        
    }

    componentWillReceiveProps(nextProps){
        var that = this;

        if(this.props.autoStart){
            let get = false;
            this.showLoading(this.name);

            //Si no se van a actualizar ni la url de get ni el autostart no se pone en marcha la tabla
            if(nextProps.getUrl !== this.state.getUrl || nextProps.autoStart !== this.state.autoStart){
                get = true;
            }
            
            this.setState({
                getUrl: nextProps.getUrl,
                saveUrl: nextProps.saveUrl,
                deleteUrl: nextProps.deleteUrl,
                autoStart: nextProps.autoStart
            }, () => {
                if(nextProps.data && nextProps.data.length > 0){
                    that.setState({
                        data: nextProps.data
                    }, () =>{
                        that.showAlertSuccess();
                    });
                }else{
                    if(get){
                        that.getRemoteResource();                
                    }else{
                        that.hideLoading(that.name);                
                    }
                }
            });
        }
    }

    componentWillMount(){
        if(this.firstReload){
            this.setTableContent();
        }
    }

    componentDidMount(){
        this.showLoading(this.name);        
    }

    getRemoteResource(){        
        var that = this;

        $.ajax({
        type: 'GET',
        url: that.state.getUrl,
        beforeSend: (xhr) => {xhr.setRequestHeader('Authorization', Util.getCookie('tokenAccess'));}
        }).done( (data, status) => {
            let dataRes = data.data ? data.data : [];

            that.setState({
                data: dataRes
            }, () =>{
                that.oldData = that.clone(dataRes);
                that.showAlertSuccess();      
                that.hideLoading(that.name);                
            });
        }).fail( (jqXHR, textStatus, errorThrown) => {
            that.setState({
                data:[]
            }, () => {
                console.log(textStatus.statusText);
                that.hideLoading(that.name);                
            });
        })
    }

    setTableContent(){}

    setStateData(data){
        this.setState({
            data : data,
        }, () =>{
            this.hideLoading(this.name);
        });
    }

    handleReloadTable(){
        this.setTableContent();
        this.showLoading(this.name);
    }

    handleChangeCol(evt){       
        let that = this;
        that.changingState = true;
        const target = evt.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name; 
        const row = target.dataset.row;
        let postState = that.state;
        postState.data.data[row][name] = value;

        that.setState(postState, () => {
            that.changingState = false;
        });
    }

    handleSave(evt){
        var that = this;
        const row = evt.target.dataset.row;
        let data;
        let newRow = that.state.data.data[row];
        let oldRow = that.oldData.data[row];

        if(!that.changingState){
            if(that.sendOldData){
                data = {
                    data: newRow,
                    oldData: oldRow
                };
            }else{
                data = newRow;
            }
    
            console.log(data);
    
            $.ajax({
            type: 'POST',
            url: this.state.saveUrl,            
            data: data,
            beforeSend: (xhr) => { xhr.setRequestHeader('Authorization', Util.getCookie('tokenAccess'));}
            }).done( (res, status) => {
                if(res.status === 'success'){
                    that.showAlertSuccess();      
                }else{
                    that.showAlertError(res.message);                
                }

                that.getRemoteResource();                
            }).fail( (jqXHR, textStatus, errorThrown) => {
                that.showAlertError(status.statusText);                
            })
        }else{
            that.showAlertError('Cambio de estado en proceso');
        }
    }
    
    /*
    * Elimina un registro de la bd basado en el id pasado
    * */
    handleDelete(evt) {
        evt.stopPropagation();
        let that = this;
        let id = evt.target.dataset.id;
        const row = evt.target.dataset.row;
        let data = row;
        let requestType = 'DELETE';

        //Si no existe un id en la tabla de la bd debemos enviar los datos para hacer el delete correctamente
        if(that.sendOldData){
            let postState = that.state;
            data = postState.data.data[row];
            requestType = 'POST';
        }
        
        if(confirm('Desea eliminar el registro?')) {
            if(typeof(id) !== 'undefined' || that.sendOldData) {
                if(typeof(id) === 'undefined'){
                    id = 0;
                }

                $.ajax({
                type: requestType,
                data: data,
                url: this.state.deleteUrl+'/'+id,
                beforeSend: (xhr) => {xhr.setRequestHeader('Authorization', Util.getCookie('tokenAccess'));}
                }).done( (data, status) => {
                    if(data.data){
                        that.getRemoteResource();
                        that.showAlertSuccess();
                    }
                }).fail((data, status) => {
                    that.showAlertError();
                });
            }
        }
    }

    handleDuplicate(evt) {
        evt.stopPropagation();
        var that = this;
        let id = evt.target.dataset.id;

        if(confirm('Desea duplicar el registro?')) {
            if(typeof(id) !== 'undefined') {
                $.ajax({
                type: 'PUT',
                url: this.state.deleteUrl+'/'+id,
                beforeSend: (xhr) => {xhr.setRequestHeader('Authorization', Util.getCookie('tokenAccess'));}
                }).done( (data, status) => {
                    if(data.data){
                        that.getRemoteResource();
                        that.showAlertSuccess();
                    }
                }).fail((data, status) => {
                    that.showAlertError();
                });
            }
        }
    }

    handleSearch(){
        this.getRemoteResource();
    }

    render (props) {
        return(
            <div id={this.name+'-component'}>
                <TableEditable name={this.name} rowIdName={this.rowIdName} listTable={this.state.data} handleNewRow={this.handleSave} handleSaveRow={this.handleSave} handleDeleteRow={this.handleDelete}  handleChangeCol={this.handleChangeCol} handleReloadTable={this.handleReloadTable} handleDuplicateRow={this.handleDuplicate} showDuplicate={false} />
            </div>
        )
    }
}

export default FormTableEditable;