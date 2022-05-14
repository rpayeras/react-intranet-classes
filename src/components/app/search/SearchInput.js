import React from 'react';
import Common from '../../common/Common';
import Util from '../../common/utils/Util';
import './SearchInput.scss';

class SearchInput extends Common {
    constructor(props){
        super(props);
        this.timeout = '';
        this.state = {
            keywords: this.props.data,
            users : [],
            menus : [],
            totalFounds : 0
        }

        this.handleInput = this.handleInput.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
        this.handleSearchBox = this.handleSearchBox.bind(this);
    }
    
    handleClickResult(evt){
        this.props.onClick(evt);
    }

    handleSearchBox(evt){
        var that = this;
        this.handleInput(evt);
        evt.persist();

        clearTimeout(this.timeout);

        this.timeout = setTimeout(() =>{
            this.searchRemote();
        },1000);
    }
    
    handleInput(evt){
        var that = this;
        const target = evt.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        var postSelected = this.state;

        postSelected[name] = value;
        this.setState(postSelected);
        
        //Permite conservar el estado del evento y sus datos, se evita que otro evento borre estos datos
        evt.persist();
        clearTimeout(this.timeout);

        this.timeout = setTimeout(() =>{
            that.searchRemote();
        },1000);
    }

    handleSearch(evt){
        this.searchRemote();
    }

    searchRemote(){
        let that = this;
        if ( this.state.keywords.length > 0 ){
            let data = ( this.state.keywords ? '/'+this.state.keywords : '');
            that.showLoading();

            $.ajax({
                type: 'GET',
                url: this.serverUrl+'/search'+data,
                beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', Util.getCookie('tokenAccess'));
                }
            }).done(function(data, status){
                let listUsers = that.setListUsers(data.data.users);
                let listMenus = that.setListMenus(data.data.menus);

                that.setState({
                    users : listUsers,
                    menus : listMenus,
                    totalFounds : listUsers.length + listMenus.length
                }, () => {
                    that.hideLoading();
                    $(".dropdown-item").click(function(evt){
                        that.handleClickResult(evt);
                    });
                    $('#dropdown-search-app').dropdown('toggle');
                });
                
            }).fail(function(data, status){
                that.showAlertError();
                that.hideLoading();
            })
        }
    }

    setListMenus(data){
        var list = [];

        for( let i in data ){
            for( let j in data[i].menus ){
                
                if ( typeof data[i].menus[j].menu !== 'undefined' ){
                    var elem = (
                        <a key = {i+j+'_src'} className="dropdown-item" href="#" >
                            <p id={data[i].menus[j].modulo} data-module={data[i].menus[j].modulo} data-title={data[i].menus[j].menu}>{data[i].menus[j].grupo}</p>
                            <h4 id={data[i].menus[j].modulo} data-module={data[i].menus[j].modulo} data-title={data[i].menus[j].menu}><i className="fa fa-bars" aria-hidden="true"></i> {data[i].menus[j].menu.toUpperCase()}</h4>
                        </a>
                    );   
                    list.push(elem);
                }
            }
        }

        return list;
    }

    setListUsers(data){
        var list = [];

        for( let i in data ){
            if ( typeof data[i].nombre !== 'undefined' ){
                var elem = (
                    <a key = {i+'_usr'} className="dropdown-item" href="#">
                        <p id='Users' data-module='Users' data-title='Usuarios'>{data[i].departamento}</p>
                        <h4 id='Users' data-module='Users' data-title='Usuarios'><i className="fa fa-user" aria-hidden="true"></i> {data[i].nombre.toUpperCase()}</h4>
                    </a>
                );   
                list.push(elem);
            }
        }

        return list;
    }
    
    render(){
        return (
            <form id="search-input-component" className='form-inline'>
                <div className='input-group'>
                    <input type='text' className='form-control' name='keywords' placeholder='Busqueda por...' data-title='Resultados...' data-reload='true' value={this.state.keywordsSearch} onChange={this.handleSearchBox} />
                    <span className='btn-group'>
                        <button id='SearchResults' className='btn btn-secondary fa fa-search dropdown-toggle' data-toggle="dropdown" type='button' onClick={this.state.handleSearchButton}>
                        </button>
                        <div className="dropdown-menu dropdown-menu-right search-dropdown" id="dropdown-search-app">
                            {this.state.menus}
                            {this.state.users}
                    </div>
                    </span>
                    
                </div>
            </form>  
        )
    }
} 

export default SearchInput;