import React from 'react';
import Common from '../../common/Common';
import LastVisited from './LastVisited';
import MostVisited from './MostVisited';
import Util from '../../common/utils/Util';

class Dashboard extends Common {
    
    constructor(props){
        super(props);
        this.state = {
            dataRevenue: []
        }     
    }

    render () {
        return (
        //TABS
        <div className='tab-pane active' id='first' role='tabpanel'>
            <div className='row p-1'>
                <div className='col-sm-3 col-xl-3 mb-3 p-1'>
                    <LastVisited handleClick={this.props.onClickVisits} />
                </div>
                <div className='col-sm-3 col-xl-3 mb-3 p-1'>
                    <MostVisited handleClick={this.props.onClickVisits} />
                </div>

                {/*<div className='col-sm-3 col-xl-3  mb-3 p-1'>
                    <div className='card card-inverse card-warning o-hidden'>
                        <div className='card-block'>
                            <div className='card-block-icon'>
                                <i className='fa fa-fw fa-shopping-cart'></i>
                            </div>
                            <div className='mr-5'>
                                4 fallos en replicaciones
                            </div>
                        </div>
                        <div className='card-block'>
                            <div className='mr-5'>
                                
                            </div>
                        </div>
                        <a href='#' className='card-footer clearfix small z-1'>
                            <span className='float-left'>Ver detalles</span>
                            <span className='float-right'><i className='fa fa-angle-right'></i></span>
                        </a>
                    </div>
                </div>
                */}
            </div>
        </div>

        )
    }
}

export default Dashboard;
