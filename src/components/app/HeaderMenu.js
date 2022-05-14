import React from 'react';
import { withRouter } from "react-router-dom";
import SearchInput from './search/SearchInput';
import Common from '../common/Common';
import Util from '../common/utils/Util';

class HeaderMenu extends Common {
    constructor(props){
        super(props);

        this.state = {
            keywords : '',
            oriFontSizeDoc: ''
        };

        this.handleClickLinks = this.props.onClickLinks;
        this.handleClickMenu = this.handleClickMenu.bind(this);
        this.handleLogout = this.handleLogout.bind(this);
        this.handleZoomIn = this.handleZoomIn.bind(this);
    }

    handleLogout(){
        Util.deleteCookies();
        this.props.history.push("/");        
    }

    handleClickMenu(){
        Util.hideSideMenu();
    }

    handleZoomIn(){
        let fontSize = $('html').css('font-size');
        fontSize = fontSize.substr(0, fontSize.indexOf('px'));

        $('html').css('font-size', (parseInt(fontSize)+1)+'px');
    }

    handleZoomOut(){
        let fontSize = $('html').css('font-size');
        fontSize = fontSize.substr(0, fontSize.indexOf('px'));

        $('html').css('font-size', (parseInt(fontSize)-1)+'px');
    }
    
    handleZoomDefault(){
        $('html').css('font-size', '14px');
    }
    
    render (){
        return (
            
            <nav className='header-component navbar navbar-expand-md fixed-top row' id='menu-superior'>
                <a className='navbar-brand white-primary col-sm-12 col-lg-3 text-right' href='#'>
                     <span>Primary Intranet 2.0</span>                
                     <button id='button-menu-responsive' className='navbar-toggler navbar-toggler-right' type='button' data-toggle='collapse' data-target='#list-menu-superior' aria-controls='list-menu-superior' aria-expanded='false' aria-label='Pulse para navegar' onClick={this.handleClickMenu}>
                        <i className='fa fa-bars' aria-hidden='true'></i>
                    </button>
                </a>
                
                <div className='collapse navbar-collapse d-none d-md-block col-sm-3 col-md-6 col-lg-9 d-md-flex justify-content-end text-right' id='list-menu-superior'>
                    <ul className='navbar-nav '>
                        <li className='nav-item'>
                            <a id='UserProfile' className='nav-link link-header' href='#' onClick={this.handleClickLinks} data-module='UserProfile' data-title='Página de usuario'><i className="fa fa-user" aria-hidden="true"></i> Perfil</a>
                        </li>
                        <li className='nav-item'>
                            <a id='link-signout' className='nav-link link-header' href='#' onClick={this.handleLogout}><i className="fa fa-sign-out" aria-hidden="true"></i> Logout</a>
                        </li>
                        <li className='nav-item'>
                            <SearchInput onClick={this.handleClickLinks}/>                        
                        </li>
                        <li className='nav-item'>
                           <div className='nav-link link-header'>
                               <span className="pointer" onClick={this.handleZoomIn}>A</span>
                               <span className="pointer" onClick={this.handleZoomDefault}>/</span>
                               <span className="pointer" onClick={this.handleZoomOut}><sub>A</sub></span>
                            </div>
                        </li>
                    </ul>
                </div>
          </nav>
        )
    }
}

export default withRouter(HeaderMenu);
