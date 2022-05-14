import React from 'react';
import Common from '../Common';
import Util from '../utils/Util';

class SelectInput extends Common{
    constructor(props){
        super(props);
        this.label = this.props.label;
        this.id = this.props.id;
        this.name = this.props.name;   
        this.resourceUrl = this.props.resourceUrl;        
        
        this.state = {
            data : [],   
            value: '',
            filterValue: this.props.filterValue,
            disabled: this.props.disabled ? this.props.disabled : false
        };

        this.handleInput = this.handleInput.bind(this);      
        this.handleChange = this.props.handleChange;
    };

    componentDidMount(){
        this.getRemoteResources();
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            filterValue: nextProps.filterValue,
            disabled: nextProps.disabled          
        });
    }

    getRemoteResources(){
        var that = this;
        that.showLoadingData('loading-input-'+this.id);
        
        $.ajax({
        type: 'GET',
        url: this.serverUrl+this.resourceUrl,
        beforeSend: (xhr) => {xhr.setRequestHeader('Authorization', Util.getCookie('tokenAccess'));}
        }).done(function(data, status){
            console.log('Recuperados datos remotos');
            
            that.setState({
                data : data.data
            }, () =>{
                that.hideLoadingData('loading-input-'+that.id);
            });
        }).fail(function(data, status){ that.showAlertError('Fallo al recuperar '+that.label); })
    }

    handleInput(evt){
        evt.persist();        
        const value = evt.target.value;
        var postSelected = this.state;
        postSelected['value'] = value;

        this.setState(postSelected, ()=>{
            this.handleChange(evt);
        });
    }

    render(){
        return(
            <div className='select-input-component form-group mr-2'>
                <label htmlFor={this.name} className="mr-1">{this.props.label} </label>
                <select id={this.name} className="form-control mb-2" name={this.props.name} value={this.state.value} onChange={this.handleInput} disabled={this.state.disabled}>
                    <option value=''></option>

                    {this.state.data.map( (value, index) => {
                        if(value){
                            if(this.state.filterValue){
                                if (value.filter && value.filter.indexOf(this.state.filterValue) >= 0){
                                    return(
                                        <option key={index+'_'+value.id+'_opt'} value={value.id}>{value.name}</option>
                                    );
                                }
                            }else{
                                return(
                                    <option key={index+'_'+value.id+'_opt'} value={value.id}>{value.name}</option>
                                );
                            }
                        }
                    })}
                </select>
                <img id={"loading-input-"+this.name} className="loading-data-gif fade" src="img/loading.gif"/>
            </div>
        )
    }
}

export default SelectInput;