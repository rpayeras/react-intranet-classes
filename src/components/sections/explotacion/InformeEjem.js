import Informe from '../../common/Informe';

class InformeEjem extends Informe{
    constructor(props){
        super(props);        
        this.name = 'InformeEjem';
        this.pathReport = '/pdf/pdf_tui_resumen.php';
    }
}

export default InformeEjem;