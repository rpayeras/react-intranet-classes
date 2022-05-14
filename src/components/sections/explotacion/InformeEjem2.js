import React from 'react';
import Informe from '../../common/Informe';
import SelectInput from '../../common/forms/SelectInput';
import DateInput from '../../common/forms/DateInput';
import ComboTtoo from '../../common/forms/ComboInput';

class InformeEjem2 extends Informe{
    constructor(props){
        super(props);
        this.name = 'Informe';
        this.pathReport = '/pdf/pdf_tui_resumen.php';

        this.state = {
            hotel:'',
            desde:'',
            hasta:'',
            ttoo:''
        }
        
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
    }
    
    handleFormSubmit(e){
        e.preventDefault();
        let strParams = '';
        for(var i in this.state){
            strParams += i+'='+this.state[i]+'&';
        }

        window.open(this.serverURL+this.pathReport+"?"+strParams);
    }

    render(){
        return(
            <div className='p-3' id={this.name+"-component"}>
                <h3 className='panel-title'>{this.name}</h3>
                <form className="form-inline">
                    <SelectInput resourceUrl='/users/profile/hotels/input' label='Hotel' id='hotel' name='hotel' handleChange={this.handleInput}/>
                    <SelectInput resourceUrl='/client/input' label='Cliente' id='client' name='client' filterValue={this.state.hotel} handleChange={this.handleInput}/>
                    <ComboTtoo resourceUrl='/ttoo/input' label='TTOO' id='ttoo' name='ttoo' filterValue={this.state.hotel} handleChange={this.handleInput} />
                    <DateInput label='Desde' name='desde' id='desde' value={this.state.desde} handleChange={this.handleInput}/>
                    <DateInput label='Hasta' name='hasta' id='hasta' value={this.state.hasta} handleChange={this.handleInput}/>

                    <button type='submit' className='btn btn-primary' onClick={this.handleFormSubmit}>Enviar</button>
                </form>
            </div>
        )
    }
}

export default InformeEjem2;