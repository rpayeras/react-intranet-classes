import React, { Component } from 'react';
import {Router, Route, Link, browserHistory } from 'react-router';

class SideMenu extends React.Component {

    constructor(props){
        super(props);
        this.state = {
            listMenus : this.props.listMenus,
            listMenusComp : []
        };

        this.handleClick = this.props.onClickLinks;
    }

    componentDidMount(){
        this.setMenus(this.state.listMenus);
    }

    setMenus(menus){
        var itemsMenus = [];
        var subItemsMenus = [];

        for(let i in menus){
            subItemsMenus[i] = [];

            if( i.length > 0 ){
                //SUBMENUS
                for( let s in menus[i].menus ){
                    if( typeof menus[i].menus[s].menu !== 'undefined' && menus[i].menus[s].menu ){
                        let subElement = (
                            <a href='#' key={i+s} id={menus[i].menus[s].modulo} className='list-group-item sub-menu' onClick={this.handleClick} data-module={menus[i].menus[s].modulo} data-title={menus[i].menus[s].menu}>
                                <i className={'fa fa-'+menus[i].menus[s].icono} aria-hidden='true'></i><span> </span>
                                <span className="menu-text" id={menus[i].menus[s].modulo} onClick={this.handleClick} data-module={menus[i].menus[s].modulo} data-title={menus[i].menus[s].menu}>{menus[i].menus[s].menu}</span>
                            </a>
                        );

                        subItemsMenus[i].push(subElement);
                    }
                };

                //MENUS
                let elem = (
                    <li key = {i.replace(' ','_')} className='nav-item'>
                        <a href={'#'+ i.replace(' ','_')} id={menus[i].menu} className='list-group-item list-group-item' data-toggle='collapse' data-parent='#MainMenu'>
                            <i className={'fa fa-'+menus[i].icono} aria-hidden='true'></i>
                            <span className="menu-text">{menus[i].menu.toUpperCase()}</span>
                        </a>
                        <div className='collapse' id={i.replace(' ','_')}>
                            {subItemsMenus[i]}
                        </div>
                    </li>
                );
                itemsMenus.push(elem);
            }
        };

        this.setState({
            listMenusComp : itemsMenus
        })
    }
    

    //METODO QUE RENDERIZA TODO EL CODIGO HTML CUANDO SE LLAMA AL COMPONENTE
    render(){        
        return(
            <nav className='sidemenu-component fixed-top d-none d-md-block bg-faded' id='menu-izquierda'>
                <ul className='nav flex-column'>
                    {this.state.listMenusComp}
                </ul>
            </nav>
        )
    }

}

export default SideMenu;