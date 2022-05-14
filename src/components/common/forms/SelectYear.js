import React from 'react';
import PropTypes from 'prop-types';

class SelectYear extends React.Component{

    constructor(props){
        super(props);

        this.label = this.props.label ? this.props.label : 'Año';
        this.id = this.props.id && this.props.id > 0 ? this.props.id : 'anyo';
        this.name = this.props.name && this.props.name > 0 ? this.props.name : 'anyo';
        this.maxYear = this.props.maxYear ? this.props.maxYear : new Date().getFullYear()
        this.minYear = this.props.minYear ? this.props.minYear : 2000;
        this.maxVisibleYears = this.props.maxVisibleYears ?  this.props.maxVisibleYears : this.maxYear - this.minYear;
        this.numFutureYears = this.props.numFutureYears ? this.props.numFutureYears : 0;

        this.state = {
            list : this.setYears(),
            value : this.props.value ? this.props.value : new Date().getFullYear()
        };

        this.handleInput = this.handleInput.bind(this);
        this.handleChange = this.props.handleChange;
    }

    handleInput(evt){
        evt.persist();        
        const value = evt.target.value;
        var postState = this.state;
        postState['value'] = value;

        this.setState(postState, ()=>{
            this.handleChange(evt);
        });
    }

    setYears(){
        var optionsYears = [];

        for(let i = this.maxYear+this.numFutureYears; i >= this.minYear; i--){
            if(optionsYears.length <= this.maxVisibleYears){
                let elem = (
                    <option key={i} value={i}>{i}</option>
                );
                optionsYears.push(elem);
            }
        };

        return optionsYears;
    }

    render(){
        return(
            <div className='form-group mr-2'>
                <label htmlFor="input-year" className="mr-1">{this.label} </label>
                <select id="input-year" className="form-control" name={this.name} id={this.id} value={this.state.value} onChange={this.handleInput}>
                    {this.state.list}
                </select>
            </div>
        )
    }
}

// SelectYear.propTypes = {  
//   label: PropTypes.string.isRequired,
//   name: PropTypes.string.isRequired,
//   selectedOption: PropTypes.string,
//   handleFunction: PropTypes.func.isRequired,
// };

export default SelectYear;