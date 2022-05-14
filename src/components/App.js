import React from 'react';
import { withRouter } from 'react-router-dom';
import Common from './common/Common';
import Util from './common/utils/Util';
import HeaderMenuApp from './app/HeaderMenu';
import SideMenuApp from './app/SideMenu';
import Dashboard from './app/dashboard/Dashboard';
import ErrorBoundary from './ErrorBoundary';

import * as ModulesApp from './ModulesExports';

class App extends Common {
    constructor(props) {
        super(props);
        this.timeoutSearch = '';

        this.state = {
            hasError: false,
            arrayTabs: [],
            arrayTabsContent: [],
            listMenus: []
        };

        this.addTab = this.addTab.bind(this);
        this.delTab = this.delTab.bind(this);
    }

    componentDidMount() {
        if (localStorage.length === 0) {
            this.props.history.push('/');
        } else {
            this.getRemoteMenus();
        }
    }
    
    getRemoteMenus() {
        const that = this;

        $.ajax({
            type: 'GET',
            url: this.serverUrl+'/menus',
            beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', Util.getCookie('tokenAccess'));
            }
        }).done(function(data, status){
            that.setState({
                listMenus : data.data
            });
            that.setSideMenu();
            that.setMainTabs();
        }).fail(function(data, status){
            that.props.history.push('/');
            that.showAlertError();
        })
    }

    setVisit(moduleName){
        let data = {'module': moduleName};

        $.ajax({
            type: 'POST',
            data: data,
            url: this.serverUrl+'/menus/visits',
            beforeSend: function (xhr) { xhr.setRequestHeader('Authorization', Util.getCookie('tokenAccess'));
            }
        }).done(function(data, status){
            console.log('Visita sumada');
        })
    }

  /*
  * Añade una nueva pestaña a la app, utiliza los componentes personalizados que importamos de ModulesExports.js
  */
    addTab(evt){
        const target = evt.target;    
        const moduleName = target.dataset.module;
        const nameMenu = target.dataset.title;
        const valueModule = target.value;
        const reload = target.dataset.reload;
        var that = this;
        
        console.log("Añadiendo tab "+moduleName);

        if( typeof moduleName !== 'undefined' ){
            //Quitamos seleccion del menu lateral y seleccionamos el del nuevo tab
            $('.list-group-item.list-group-item, .list-group-item.sub-menu').removeClass('selected');

            if( $('#'+moduleName) && $('#'+moduleName).hasClass('selected')){
                $('#'+evt.target.id).removeClass('selected');
            }else{
                $('#'+evt.target.id).addClass('selected');
            }

            //Añadimos tab si no existe, lo mostramos en caso contrario
            if( typeof ModulesApp[moduleName] !== 'undefined' ){
                var arrayTabs = this.state.arrayTabs;
                var arrayTabsContent = this.state.arrayTabsContent;
                var CustomModule = ModulesApp[moduleName];
                var tabLi = (<li key={moduleName} className='nav-item' onClick={this.cleanTabState}>
                                <a className='nav-link tab-section' data-toggle='tab' href={'#'+moduleName+'_content'} id={moduleName}>
                                {nameMenu} <i className='fa fa-times-circle close-tab' aria-hidden='true' onClick={this.delTab} data-module={moduleName}></i>
                                </a>
                            </li>);
                var tabContent = (<div key={moduleName} className='tab-pane tab-module fade' id={moduleName+'_content'} role='tabpanel'>
                                    <div className='loading-gif'>
                                        <span>
                                            <img src='img/loading.gif'/> 
                                        </span>
                                    </div>
                                        <ErrorBoundary>
                                            <CustomModule data={valueModule} onClick={this.addTab}/>
                                        </ErrorBoundary>
                                    </div>);
                var duplicated = false;

                arrayTabs.forEach( (item) => {
                    if( item.key === tabLi.key){
                        duplicated = true;
                    }
                });

                //Si tenemos tab que ya existe comprobamos si debe o no actualizar el contenido, si se añade a las tabs
                if(duplicated) {
                    if(reload) {
                        this.delTab(evt);
                        this.addTab(evt);
                    }
                }else{
                    arrayTabs.push(tabLi);
                    arrayTabsContent.push(tabContent);
                    
                    this.setState({arrayTabs : arrayTabs, arrayTabsContent : arrayTabsContent}, () => {
                        $('.tab-pane.active').removeClass('active');
                        $('.tab-section:last').tab('show');
                        that.setVisit(moduleName);
                    });
                }
            }else{
                that.showAlertError;
            }

            //Si ya existe la mostramos
            if( typeof $('.nav-link.tab-section#'+moduleName).attr('id') !== 'undefined'){
                $('.nav-link.tab-section#'+moduleName).tab('show');
            }
        }

        $('#list-menu-superior').collapse('hide');
        Util.hideSideMenu();
    }

    delTab(evt){
        const target = evt.target;
        const idTab = target.dataset.module;
        var arrayTabs = this.state.arrayTabs;
        var arrayTabsContent = this.state.arrayTabsContent;

        for(var i in arrayTabs){
            if(arrayTabs[i].key === idTab){
                arrayTabs.splice(i,1);
            }
        }

        for(var i in arrayTabsContent){
            if(arrayTabsContent[i].key === idTab){
                arrayTabsContent.splice(i,1);
            }
        }

        this.setState({arrayTabs : arrayTabs, arrayTabsContent : arrayTabsContent}, () =>{
            $('.tab-section:first').tab('show');            
        });  
    }

    cleanTabState(evt){
        if (Object.keys(evt.target).indexOf('href') >= 0) {
            $('.tab-pane:not('+evt.target.href.substring(evt.target.href.indexOf('#'))+')').removeClass('active');            
        }
    }

    /*
    * Añade el menu lateral al estado de la app solo cuando tenemos datos de menus
    */
    setSideMenu(){
        this.setState({
            sideMenu : (<SideMenuApp  listMenus={this.state.listMenus} onClickLinks={this.addTab} />)
        });
    }

    /*
    * Carga el dashboard y los componentes en los que tenemos permiso
    */
    setMainTabs(){
        var arrayTabs = this.state.arrayTabs;
        var arrayTabsContent = this.state.arrayTabsContent;
        var menus = this.state.listMenus;
        var tabLi = (<li key='dashboard' className='nav-item'>
                        <a className='nav-link tab-section' data-toggle='tab' href='#dashboard'><i className='fa fa-home' aria-hidden='true'></i> Dashboard</a>
                    </li>);
        var tabContent = (<div key='dashboard' className='tab-pane fade' id='dashboard' role='tabpanel'>
                                <div className='loading-gif'>
                                    <span>
                                        <img src='img/loading.gif'/> 
                                    </span>
                                </div>
                            <Dashboard onClickVisits={this.addTab}/>
                            </div>);

        arrayTabs.push(tabLi);
        arrayTabsContent.push(tabContent);

        this.setState({arrayTabs : arrayTabs, arrayTabsContent : arrayTabsContent}, () => {
            $('.tab-section:first').tab('show');                               
        }); 
    }

    render (props) {
        return (      
            <div id='app'>
                <HeaderMenuApp onClickLinks={this.addTab} />

                <div className='d-flex justify-content-end' id="app-body">
                    {this.state.sideMenu}

                    <div className='main-content content pt-2'>
                        <ul className='nav nav-tabs'>
                            {this.state.arrayTabs}
                        </ul>

                        <div className='tab-content p-1 bg-faded'>
                            {this.state.arrayTabsContent}
                        </div>
                        <div className='alert alert-success col-sm-3 hidden' role='alert'>
                            <i className="fa fa-check" aria-hidden="true"></i>
                            <div className='message'></div>
                        </div>
                        <div className='alert alert-danger col-sm-3 hidden' role='alert'>
                            <strong className='title'>Error</strong>
                            <div className='message'></div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}

export default withRouter(App);
