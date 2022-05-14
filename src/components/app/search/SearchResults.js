import React from 'react';
import Common from '../../common/Common';
import Util from '../../common/utils/Util';

class SearchResults extends Common {
    constructor(props){
        super(props);
        this.timeout = '';
        this.state = {
            keywords: this.props.data,
            users : [],
            menus : [],
            totalFounds : 0
        }

        this.handleClickLink = this.props.onClick;
        this.handleInput = this.handleInput.bind(this);
        this.handleSearch = this.handleSearch.bind(this);
    }
    
    componentWillMount(){
        that.showLoading();
        this.searchRemote();
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
            });
            
        }).fail(function(data, status){
            that.showAlertError();
            that.hideLoading();
        })
    }

    setListMenus(data){
        var list = [];

        for( let i in data ){
            for( let j in data[i].menus ){
                
                if ( typeof data[i].menus[j].menu !== 'undefined' ){
                    var elem = (
                        <li key = {i+j+'_src'} className='list-group-item'>
                            <div className='card-block'>
                                <a href='#' className='card-link link-search'>
                                    <p className='card-text' id={data[i].menus[j].modulo} data-module={data[i].menus[j].modulo} data-title={data[i].menus[j].menu} onClick={this.handleClickLink}>{data[i].menus[j].grupo}</p>
                                    <h4 className='card-title' id={data[i].menus[j].modulo} data-module={data[i].menus[j].modulo} data-title={data[i].menus[j].menu} onClick={this.handleClickLink}>{data[i].menus[j].menu.toUpperCase()}</h4>
                                </a>
                            </div>
                        </li>
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
                    <li key = {i+'_usr'} className='list-group-item'>
                        <div className='card-block'>
                            <a href='#' className='card-link link-search'>
                                <p className='card-text' id='Users' data-module='Users' data-title='Usuarios' onClick={this.handleClickLink}>{data[i].departamento}</p>
                                <h4 className='card-title' id='Users' data-module='Users' data-title='Usuarios' onClick={this.handleClickLink}>{data[i].nombre.toUpperCase()}</h4>
                            </a>
                        </div>
                    </li>
                );   
                list.push(elem);
            }
        }
        return list;
    }
    
    render(){
        return (
            <div className='search-results-component p-3'>
                <div className='header-search row'>
                    <h1 className='col-md-10'>{this.state.totalFounds} resultados de busqueda para '{this.state.keywords}'</h1> 
                    <span className='loading-gif col-md-2'>
                        <img src='img/loading.gif'/> 
                    </span>
                </div>
                
                <div className='input-search row'>
                    <div className='input-group col-md-6'>
                        <input type='text' className='form-control' name='keywords' placeholder='Palabras de busqueda...' value={this.state.keywords} onChange={this.handleInput} />
                        <span className='input-group-btn'>
                            <button className='btn btn-secondary' type='button' onClick={this.handleSearch}>Buscar</button>
                        </span>
                    </div>
                </div>

                <ul className='nav nav-tabs'>
                    <li className='nav-item'>
                        <a className='nav-link active' data-toggle='tab' href='#menus' role='tab'>Menus</a>
                    </li>
                    <li className='nav-item'>
                        <a className='nav-link' href='#' data-toggle='tab' href='#users' role='tab'>Usuarios</a>
                    </li>
                </ul>

                <div className='tab-content'>
                    <div className='tab-pane active' id='menus' role='tabpanel'>
                        <div className='card mt-2'>
                            <ul className='list-group list-group-flush'>
                                {this.state.menus}
                            </ul>
                        </div>
                    </div>
                    <div className='tab-pane' id='users' role='tabpanel'>
                        <div className='card mt-2'>
                            <ul className='list-group list-group-flush'>
                                {this.state.users}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
} 

export default SearchResults;