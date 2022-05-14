import React from 'react';
import PropTypes from 'prop-types';

class SelectMonth extends React.Component{

    constructor(props){
        super(props);
        this.name = ''
        this.label = this.props.label ? this.props.label : 'Mes',        
        this.id = this.props.id && this.props.id > 0 ? this.props.id : 'mes',
        this.name = this.props.name && this.props.name > 0 ? this.props.name : 'mes',
        
        this.state = {
            list : this.setMonths(),
            value : this.props.value ? this.props.value : new Date().getMonth()
        };
        this.handleInput = this.handleInput.bind(this);
        this.handleChange = this.props.handlesChange;
    };

    setMonths(){
        var optionsMonths = [];
        var arrMonths = [];
        arrMonths[1] = 'Enero';
        arrMonths[2] = 'Febrero';
        arrMonths[3] = 'Marzo';
        arrMonths[4] = 'Abril';
        arrMonths[5] = 'Mayo';
        arrMonths[6] = 'Junio';
        arrMonths[7] = 'Julio';
        arrMonths[8] = 'Agosto';
        arrMonths[9] = 'Septiembre';
        arrMonths[10] = 'Octubre';
        arrMonths[11] = 'Noviembre';
        arrMonths[12] = 'Diciembre';
        
        for(let i in arrMonths){
            let elem = (<option key={i} value={i}>{arrMonths[i]}</option>);
            optionsMonths.push(elem);
        }
        
        return optionsMonths;
    };

    handleInput(evt){
        evt.persist();        
        const value = evt.target.value;
        var postState = this.state;
        postState['value'] = value;

        this.setState(postState, ()=>{
            this.handleChange(evt);
        });
    }

    render(){
        return(
            <div className='form-group mr-2'>
                <label htmlFor="input-month" className="mr-1">{this.label} </label>
                <select id="input-month" className="form-control" name={this.name} id={this.id} value={this.state.value} onChange={this.handleInput}>
                    {this.state.list}
                </select>
            </div>
        )
    }
}

// SelectMonth.propTypes = {  
//   label: PropTypes.string.isRequired,
//   name: PropTypes.string.isRequired,
//   selectedOption: PropTypes.string,
//   handleFunction: PropTypes.func.isRequired,
// };


export default SelectMonth;