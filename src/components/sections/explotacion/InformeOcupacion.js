import React from 'react';
import Informe from '../../common/Informe';
import SelectInput from '../../common/forms/SelectInput';
import SelectYear from '../../common/forms/SelectYear';
import SelectMonth from '../../common/forms/SelectMonth';

class InformeOcupacion extends Informe{
    constructor(props){
        super(props);        
        this.name = 'InformeEjem';
        this.pathReport = '/pdf/pdf_ocupacion.php';

        this.state = {
            hotel:'',
            anyo: 2005,
            mes: 9,
            tipo:''
        }
    }

    render(){
        return(
            <div className='p-3' id={this.name+"-component"}>
                <h3 className='panel-title'>{this.name}</h3>
                <form className="form-inline">
                    <SelectInput resourceUrl='/users/profile/hotels/input' label='Hotel' id='hotel' name='hotel' handleChange={this.handleInput}/>
                    <SelectYear label="Año" name="anyo" id="selectYear" value={this.state.anyo} handleChange={this.handleInput} />
                    <SelectMonth label="Year" name="mes" id="selectMonth" value={this.state.anyo} handleChange={this.handleInput} />
                    <select name="tipo" value={this.state.tipo} onChange={this.handleInput} className="mr-1">
                        <option value="1">Ocupacion</option>
                        <option value="2">Presu</option>
                    </select>
                        <button type='submit' className='btn btn-primary' onClick={this.handleFormSubmit}>Enviar</button>
                </form>
            </div>
        )
    }
}

export default InformeOcupacion;