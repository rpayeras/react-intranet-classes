import React from 'react';
import Common from './Common';
import Util from './utils/Util';
import SelectInput from './forms/SelectInput';
import DateInput from './forms/DateInput';
import SelectYear from './forms/SelectYear';
import SelectMonth from './forms/SelectMonth';

class Informe extends Common{
    constructor(props){
        super(props);
        this.name = this.props.name ? this.props.name : 'informe';
        this.pathReport = this.props.pathReport ? this.props.pathReport : '/pdf_tui_resumen.php';

        this.state = {
            hotel:'',
            desde:'',
            hasta:'',
            mes: new Date().getMonth(),            
            anyo: new Date().getFullYear()
        }
        
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }
    
    handleFormSubmit(e){
        e.preventDefault();
        let strParams = '';

        for(var i in this.state){
            if(this.state[i]){
                strParams += i+'='+this.state[i]+'&';                
            }
        }

        strParams += 'token='+Util.getCookie('tokenAccess');
        window.open(this.serverUrl+"/reports\/"+this.pathReport+"?"+strParams);
    }

    render(){
        let yearInput = this.props.inputMonth ? (<SelectYear label="Año" value={this.state.anyo} handleChange={this.handleInput} />) : '';
        let monthInput = this.props.inputYear ? (<SelectMonth label="Mes" value={this.state.mes} handleChange={this.handleInput} />) : '';
        let hotelInput = this.props.inputHotel ? (<SelectInput resourceUrl='/users/profile/hotels/input' label='Hotel' id='hotel' name='hotel' handleChange={this.handleInput}/>) : '';        
        let rangeDateInput = this.props.inputRangeDate ? (<div className="date-range">
                            <DateInput label='Desde' name='desde' id='desde' value={this.state.desde} handleChange={this.handleInput}/>
                            <DateInput label='Hasta' name='hasta' id='hasta' value={this.state.hasta} handleChange={this.handleInput}/>
                        </div>) : '';
        return(
            <div className='p-1' id={this.name+"-component"}>
                <h5 className='panel-title'>{this.name}</h5>
                <form className="form-inline">
                    {monthInput}
                    {yearInput}
                    {rangeDateInput}
                    {hotelInput}
                    <button type='submit' className='btn btn-primary fa fa-file-pdf-o' onClick={this.handleFormSubmit}></button>
                    <button type='submit' className='btn btn-pdf fa fa-file-pdf-o' onClick={this.handleFormSubmit}></button>
                    <button type='submit' className='btn btn-pdf-alt fa fa-file-pdf-o' onClick={this.handleFormSubmit}></button>
                </form>
            </div>
        )
    }
}

export default Informe;