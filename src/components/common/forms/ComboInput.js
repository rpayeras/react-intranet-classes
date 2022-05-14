import Common from '../Common';
import React from 'react';
import Util from '../utils/Util';

import './ComboInput.scss';

class ComboInput extends Common {
    constructor(props){
        super(props);
        this.label = this.props.label;
        this.id = this.props.id;
        this.name = this.props.name;
        this.resourceUrl = this.props.resourceUrl;        
        this.filterSearchBy = this.props.filterSearchBy ? this.props.filterSearchBy : 'name'; 

        this.state = {
            data : [],   
            listElements:[],         
            value: '',
            visible: false,
            filterValue: this.props.filterValue
        };

        this.handleInput = this.handleInput.bind(this);
        this.handleClickAll = this.handleClickAll.bind(this);
        this.handleClickResult = this.handleClickResult.bind(this);
        this.handleChange = this.props.handleChange;
    }

    componentWillMount(){
        this.getRemoteResources();
    }

    componentWillReceiveProps(nextProps){
        this.setState({
            filterValue: nextProps.filterValue
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
        var list = [];

        if(value){      
            for(let i in postSelected['data']){
                if (this.state.filterValue && this.state.filterValue.length > 0) {
                    if (postSelected['data'][i]['filter'].indexOf(this.state.filterValue) >= 0  && postSelected['data'][i][this.filterSearchBy] && postSelected['data'][i][this.filterSearchBy].toUpperCase().indexOf(value.toUpperCase()) >= 0) {
                        list.push(postSelected['data'][i]);
                    }
                } else {
                    if(postSelected['data'][i][this.filterSearchBy] && postSelected['data'][i][this.filterSearchBy].toUpperCase().indexOf(value.toUpperCase()) >= 0){
                        list.push(postSelected['data'][i]);
                    }
                }

            }
        }

        postSelected['value'] = value;
        postSelected['listElements'] = list;

        if(postSelected['listElements'] && postSelected['listElements'].length > 0){
            postSelected['visible'] = true;            
        }else{
            postSelected['visible'] = false;                        
        }

        this.setState(postSelected, ()=>{
            this.handleChange(evt);
        });
    }

    handleClickAll(){
        let postSelected = this.state;

        if(postSelected['visible']){
            postSelected['visible'] = false;                                    
        }else{
            postSelected['listElements'] = postSelected['data'];
            
            if(postSelected['listElements'] && postSelected['listElements'].length > 0){
                postSelected['visible'] = true;            
            }else{
                postSelected['visible'] = false;                        
            }
        }

        this.setState(postSelected);
    }

    handleClickResult(evt){
        evt.persist();
        const value = evt.target.dataset.value;
        var postSelected = this.state;
        
        evt.target.value = value;
        evt.target.name = this.name;
        postSelected['value'] = value;
        postSelected['visible'] = false;
        
        this.setState(postSelected, ()=>{
            this.handleChange(evt);
        });
    }
    
    render(){
        let visible = this.state.visible ? 'show' : '';

        return (
            <div className='combobox-input-component form-inline mr-2'>
                <div className='input-group'>
                    <label htmlFor={this.name} >{this.label}</label>
                    <input type='text' className='form-control ml-1' name={this.name} id={this.id} placeholder='' value={this.state.value} onChange={this.handleInput} />
                    <button type="button" className="btn btn-primary fa fa-angle-right" onClick={this.handleClickAll} title="Listar todo"></button>
                    <div className={"dropdown-menu "+visible}>
                        {this.state.listElements.map( (value, index) => {
                            return (
                                <a key={index+'_drop'} className="dropdown-item" href="#" onClick={this.handleClickResult} data-value={value.id}>
                                    <span data-value={value.id}>{value.name}</span>
                                </a>
                            );
                        })}
                    </div>
                </div>
                <img id={"loading-input-"+this.name} className="loading-data-gif fade" src="img/loading.gif"/>
            </div>  
        )
    }
} 

export default ComboInput;