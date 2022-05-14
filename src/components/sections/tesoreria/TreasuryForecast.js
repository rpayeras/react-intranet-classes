import React from 'react';
import Common from '../../common/Common';
import TableEditable from '../../common/FormTableEditable';
import SelectInput from '../../common/forms/SelectInput';

class TreasuryForecast extends Common{
    constructor(props){
        super(props);
        this.name = 'Previsión tesorería';        

        this.state = {
            hotel: 0,
            operationsUrl : this.serverUrl+'/treasury/forecast'
        }
    }

    render(){
        return(
            <div className={this.name}>
                <div className="col-sm-3 form-inline p-2">
                    <SelectInput resourceUrl='/users/profile/hotels/input' label='Hotel' id='hotel' name='hotel' handleChange={this.handleInput}/>  
                </div>
                <TableEditable name="TreasuryForecast" getUrl={this.state.operationsUrl+'/form/'+this.state.hotel} saveUrl={this.state.operationsUrl+'/'+this.state.hotel} deleteUrl={this.state.operationsUrl} autoStart={true}/>
            </div>
        )
    }
}

export default TreasuryForecast;
