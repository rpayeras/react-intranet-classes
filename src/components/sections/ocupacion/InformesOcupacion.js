import React from 'react';
import Informe from '../../common/Informe';
import OcupacionMensual from './OcupacionMensual';

class InformesOcupacion extends React.Component{
    constructor(props){
        super(props);        
        this.name = 'Informes Explotacion';
    }

    render(){
        return(
            <div>
                <div className="row">
                    <div className="col-sm-10 m-1 card-report">
                        <OcupacionMensual />
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-2 m-1 card-report">
                        <Informe pathReport="ocupacion/estancias_pax_anual.php" name="Estancia media anual" />
                    </div>
                    <div className="col-sm-4 m-1 card-report">
                        <Informe pathReport="ocupacion/estancias_anuales.php" name="Resumen anual de estancias" inputYear="true" />
                    </div>
                    <div className="col-sm-4 m-1 card-report">
                        <Informe pathReport="ocupacion/habitaciones_anuales.php" name="Resumen anual de habitaciones" inputYear="true"/>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-5 m-1 card-report">
                        <Informe pathReport="ocupacion/estancias_pax.php" name="Estancia media" inputMonth="true" inputYear="true" />
                    </div>
                </div>
            </div>
        )
    }
}

export default InformesOcupacion;