import React from 'react';
import Informe from '../../common/Informe';
import SelectInput from '../../common/forms/SelectInput';
import SelectYear from '../../common/forms/SelectYear';
import SelectMonth from '../../common/forms/SelectMonth';

class OcupacionMensual extends Informe{
    constructor(props){
        super(props);        
        this.name = 'Informe Ocupación Mensual';
        this.pathReport = 'ocupacion/ocupacion_mensual.php';
        let date = new Date();

        this.state = {
            mes: date.getMonth(),            
            anyo: date.getFullYear(),
            filtroGrupo:'',
            idGrupo:'',
            tipoInforme: 1,
            tipoOcupacion: 1
        }

        this.handleInputReportType = this.handleInputReportType.bind(this);
    }

    handleInputReportType(evt){
        const target = evt.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        let postSelected = this.state;   

        if(value === 1){
            this.pathReport = this.pathReport;
        }else{
            this.pathReport = 'ocupacion/ocupacion_comparativo_presupuesto.php';        
        }

        postSelected['tipoInforme'] = value;
        this.setState(postSelected);
    }

    render(){
        return(
            <div id={this.name+"-component"}>
                <h5 className='panel-title'>{this.name}</h5>
                <div className="form-inline">
                    <SelectMonth value={this.state.mes} handleChange={this.handleInput} />
                    <SelectYear value={this.state.anyo} handleChange={this.handleInput} />
                    <label className="mr-2" htmlFor="tipoInforme">Tipo de informe</label>
                    <select name="tipoInforme" value={this.state.tipoInforme} onChange={this.handleInputReportType} className="form-control mr-1">
                        <option value="1">Ocupacion mensual</option>
                        <option value="2">Comparativo Presupuesto</option>
                    </select>
                </div>
                <div className="form-inline p-2">
                    <input className="form-control mr-2" type="checkbox" name="filtroGrupo" value={this.state.filtroGrupo} onChange={this.handleInput}/><label className="mr-2" htmlFor="filtraGrupos">Filtrar por grupos ocupación</label>
                </div>
                <div className="form-inline">
                    <div className="form-group">
                        <SelectInput resourceUrl='/reports/groups' label='Grupos' id='grupos' name='idGrupo' handleChange={this.handleInput} disabled={!this.state.filtroGrupo}/>
                        <label className="mr-2" htmlFor="tipoOcupacion">Tipo de ocupación</label>
                        <select name="tipoOcupacion" label="Tipo de ocupación" value={this.state.tipoOcupacion} onChange={this.handleInput} className="form-control mr-1">
                            <option value="1">Habitaciones</option>
                            <option value="2">Estancias</option>
                        </select>
                    </div>   
                    <button type='submit' className='btn btn-primary fa fa-file-pdf-o' onClick={this.handleFormSubmit}> PDF</button>
                    <button type='submit' className='btn btn-pdf fa fa-file-pdf-o' onClick={this.handleFormSubmit}> PDF</button>
                    <button type='submit' className='btn btn-pdf-alt fa fa-file-pdf-o' onClick={this.handleFormSubmit}> PDF</button>
                </div>
            </div>
        )
    }
}

export default OcupacionMensual;