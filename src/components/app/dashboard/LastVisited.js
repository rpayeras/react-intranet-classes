import React from 'react';
import Common from '../../common/Common';
import Util from '../../common/utils/Util';
import './LastVisited.scss';

class LastVisited extends Common{
    constructor(props){
        super(props);
        this.state = {
            listLastVisited:[]
        };

        this.handleShowDetails = this.handleShowDetails.bind(this);
    }

    componentDidMount(){
        this.getLastVisited();
    }

    handleShowDetails(){
        if( $('#ultimos-visitados .list-widget:hidden').length > 0 ){
            $('#ultimos-visitados .list-widget').slideDown();
        }else{
            $('#ultimos-visitados .list-widget').slideUp();
        }
    }

    getLastVisited(){
        let that = this;
        
        $.ajax({
        type: 'GET',
        url: this.serverUrl+'/menus/last',
        beforeSend: (xhr) => {xhr.setRequestHeader('Authorization', Util.getCookie('tokenAccess'));}
        }).done(function(data, status){
            that.setState({
                listLastVisited : that.setLastVisited(data.data)
            });
        }).fail(function(data, status){ that.showAlertError(); })
    }

    setLastVisited(data){
        var  listElem = [];

        for( let i in data ){
            if(typeof data[i].menu !== 'undefined' && data[i].menu){
                var elem = (
                    <li key = {i+'_ult'} className='card'>
                        <div className='card-block'>
                            <a href='#' className='card-link link-ultimos'>
                                <p className='card-text' id={data[i].modulo} onClick={this.props.handleClick} data-module={data[i].modulo} data-title={data[i].menu}>{data[i].grupo}</p>
                                <h4 className='card-title' id={data[i].modulo} onClick={this.props.handleClick} data-module={data[i].modulo} data-title={data[i].menu}>{data[i].menu.toUpperCase()}</h4>
                            </a>
                        </div>
                    </li>
                );
                
                listElem.push(elem);
            }
        }

        return listElem;
    }
        
    render(){
        return(
            <div id='ultimos-visitados' className='card card-inverse card-primary o-hidden'>
                <div className='card-block'>
                    <div className='card-block-icon'>
                        <i className='fa fa-fw fa-comments'></i>
                    </div>
                    <div className='mr-4'>
                        Ultimos visitados
                    </div>
                </div>

                <div className='list-widget'>
                    <ul className='list-group list-group-flush'>
                        {this.state.listLastVisited}
                    </ul>
                </div>
                
                <a href='#' className='card-footer clearfix small z-1' onClick={this.handleShowDetails}>
                    <span className='float-left'>Ver detalles</span>
                    <span className='float-right'><i className='fa fa-angle-right'></i></span>
                </a>
            </div>
        )
    }
}

export default LastVisited;