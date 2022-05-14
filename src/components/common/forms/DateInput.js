import React from 'react';
import moment from 'moment';
import Flatpickr from '../../../lib/flatpickr/dist/flatpickr';
import languageFlatpickr from "flatpickr/dist/l10n/es.js";
import "flatpickr/dist/flatpickr.css";

class DateInput extends React.Component{
    constructor(props){
        super(props);
        this.label = this.props.label;        
        this.name = this.props.name;
        this.id = this.props.id;
        this.numRow = this.props.numRow;
        this.dateFormat = this.props.dateFormat ? this.props.dateFormat : 'd-m-Y';
        this.displayFormat = this.props.displayFormat ? this.props.displayFormat : 'DD-MM-YYYY';
        this.showDeleteButton = this.props.showDeleteButton ? this.props.showDeleteButton : true;
        
        this.state = {
            value : this.props.value
        };

        this.handleInputDate = this.handleInputDate.bind(this);                
        this.handleInputFlat = this.handleInputFlat.bind(this);                
    };

    componentDidMount(){
        moment.locale('es-ES');        
        Flatpickr('#'+this.id, {allowInput: true, dateFormat: this.dateFormat, onChange: this.handleInputFlat, parseDate: this.parseCustomDate, locale: languageFlatpickr.es});    
    }

    /*
    * Recibe un string y lo pasa a date con moment js, lo utiliza flatpickr
    */
    parseCustomDate(dateString) {
        let customDate;
        let result;

        if (typeof dateString === 'string') {
            switch (dateString) {
                case 'h':
                    customDate = moment();
                break;
                case 'm':
                    customDate = moment().add(1,'d');
                break;
                case 'a':
                    customDate = moment().subtract(1,'d');
                break;
            }
            
            if (dateString.indexOf('..') >= 0) {                
                let date1 = moment(dateString.substr(0, dateString.indexOf('..')), ['DDMM','DDMMYY','DDMMYYYY']);
                let date2 = moment(dateString.substr(dateString.indexOf('..') + 2), ['DDMM','DDMMYY','DDMMYYYY']);

                if (date1.isValid() && date2.isValid()) {
                    customDate = [date1.toDate(), date2.toDate()];                    
                }

                this.handleDateReservation(customDate);
                return customDate;  
            }

            if (typeof customDate === "undefined"){
                switch(dateString.length){
                    case 2:
                        customDate = moment(dateString, ['DD','YY']);
                    break;
    
                    case 4:
                        customDate = moment(dateString,['DDMM','MMYY','YYYY']);      
                    break;
    
                    case 6:
                        customDate = moment(dateString,['DDMMYY','YYMMDD']);
                    break;
    
                    case 8:
                        customDate = moment(dateString,['DDMMYYYY','YYYYMMDD']);
                    break;
                }
            }
        }

        if (typeof dateString === 'object' || typeof customDate === "undefined"){            
            customDate = moment(dateString);
            
            if (typeof customDate === "undefined"){                
                customDate = moment();
            }            
        }
        
        if(customDate.isValid()) {
            if (customDate.length > 1) {
                this.handleDateReservation(customDate);
                result = null;          
            }else{
                result = customDate.toDate();
            }
        } else{
            result = false;
        }
        return result;
    }

    dateToMomentDate(date) {
        let customDate = '';
        
        if(date.length === 1) {
            customDate = date ? date[0] : '';
            customDate = moment(customDate).format(this.displayFormat);   
        } else if (date.length > 1) {
            customDate = [];
            for(let i = 0; i <= date.length; i++) {
                if(typeof date[i] !== "undefined") {
                    customDate.push(date[i]);                    
                }
            }
        }

        return customDate;
    }

    handleInputDate(evt){
        evt.persist();
        this.props.handleChange(evt);   
        this.setState({value:evt.target.value});        
    }

    handleInputFlat(date) {        
        date = this.dateToMomentDate(date);
        let evt = {target:{value:date, name:this.name, dataset : {row: this.numRow}}};
        this.props.handleChange(evt);        
        this.setState({value:evt.target.value});
    }
    
    render(){
        return(
            <div className="form-group d-flex">
                <label htmlFor={this.name} className='align-middle mr-1'>{this.label}</label><br />
                <input className="datepicker form-control" name={this.name} data-row={this.numRow} id={this.id} value={this.state.value} onChange={this.handleInputDate} onBlur={this.props.onBlur} />
                <button type="button" className="btn btn-primary fa fa-times" onClick={this.handleInputFlat}></button>
            </div>
        )
    }
}    

export default DateInput;