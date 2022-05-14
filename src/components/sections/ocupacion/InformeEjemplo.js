import React from 'react';
import Informe from '../../common/Informe';
import SelectInput from '../../common/forms/SelectInput';
import DateInput from '../../common/forms/DateInput';
import ComboBox from '../../common/forms/ComboInput';

class InformeEjemplo extends Informe{
    constructor(props){
        super(props);
        this.name = 'Informe';
        this.pathReport = 'pdf_tui_resumen.php';

        this.state = {
            hotel:'',
            desde:'',
            hasta:'',
            ttoo:'',
            cif:''
        }
    }
    
    render(){
        return(
            <div className='p-3' id={this.name+"-component"}>
                <h3 className='panel-title'>{this.name}</h3>
                <form className="form-inline">
                    <SelectInput resourceUrl='/users/profile/hotels/input' label='Hotel' id='hotel' name='hotel' handleChange={this.handleInput}/>
                    <SelectInput resourceUrl='/users/profile/societies/input' label='Sociedades' id='society' name='society' handleChange={this.handleInput}/>

                    <SelectInput resourceUrl='/client/input' label='Cliente' id='client' name='client' filterValue={this.state.hotel} handleChange={this.handleInput}/>
                    <ComboBox resourceUrl='/ttoo/input' label='TTOO' id='ttoo' name='ttoo' filterValue={this.state.hotel} handleChange={this.handleInput} />
                    <ComboBox resourceUrl='/ttoo/cif/input' label='cif' id='cif' name='cif' handleChange={this.handleInput} filterSearchBy="id" />

                    <DateInput label='Desde' name='desde' id='desde' value={this.state.desde} handleChange={this.handleInput}/>
                    <DateInput label='Hasta' name='hasta' id='hasta' value={this.state.hasta} handleChange={this.handleInput}/>

                    <button type='submit' className='btn btn-primary' onClick={this.handleFormSubmit}>Enviar</button>
                </form>
            </div>
        )
    }
}

export default InformeEjemplo;