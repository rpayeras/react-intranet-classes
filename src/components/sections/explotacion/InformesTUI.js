import React from 'react';
import SelectYear from '../../common/forms/SelectYear';
import SelectMonth from '../../common/forms/SelectMonth';

class InformesTUI extends React.Component{

    constructor(props){
        super(props);
        this.serverURL = 'http://192.168.0.10';
        var d = new Date();
        var month = '';

        if(d.getMonth() === 0) {
            month = 1;
        }else{
            month = d.getMonth();
        }

        this.state = {
            anyo : d.getFullYear(),
            mes : month
        }
        
        this.handleFormSubmit = this.handleFormSubmit.bind(this);
        this.handleSelectYear = this.handleSelectYear.bind(this);
        this.handleSelectMonth = this.handleSelectMonth.bind(this);
    }

    componentDidMount(){
    }

    componentWillUnmount() {
    }
    
    handleFormSubmit(e){
        e.preventDefault();
        window.open(this.serverURL+'/pdf/pdf_tui_resumen.php?mes='+this.state.mes+'&anyo='+this.state.anyo+'&IdUs=1');
    }

    handleSelectYear(evt){
        this.setState({ anyo : evt.target.value })
    }

    handleSelectMonth(evt){
        this.setState({ mes : parseInt(evt.target.value)})
    }
        
    render(){
        return(
            <div className='p-3' id="informes-tui-component">
                <h3 className='panel-title'>Resumen</h3>
                <form className="form-inline">
                    <SelectMonth label='Mes' name={'select-month'} id={'select-month'} handleChange={this.handleSelectMonth} />
                    <SelectYear label='Año' name={'select-year'} id={'select-year'} handleChange={this.handleSelectYear} />
                    <button type='submit' className='btn btn-primary' onClick={this.handleFormSubmit}>Enviar</button>
                </form>
            </div>
        )
    }
}

export default InformesTUI;