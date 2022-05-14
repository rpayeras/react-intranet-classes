import React, { Component } from 'react';
import Util from '../utils/Util';
import Common from '../Common';
import Table from './Table';
import DateInput from '../forms/DateInput';
import './TableEditable.scss';

class TableEditable extends Table {
    constructor(props){
        super(props);
        this.name = this.props.name ? this.props.name : 'Table_'+Math.random().toString();
        this.idReadOnly = this.props.idReadOnly ? true : false;        
        this.showUtilsHeader = false;
        this.showDuplicate = typeof this.props.showDuplicate !== 'undefined' ? this.props.showDuplicate : true;

        this.state = {
            listHeaders : this.props.listHeaders,
            listTable : this.props.listTable,
            listHeadersElements : [],
            listTableElements : [],
            listTableSearch : [],
            options : []
        };

        this.handleSaveRow = this.props.handleSaveRow;                
        this.handleChangeCol = this.props.handleChangeCol;
        this.handleDuplicateRow = this.props.handleDuplicateRow;
    }

    componentWillReceiveProps(nextProps){
        let data = nextProps.listTable;
        let headers = [];
        let records;

        if(data.headers){
            for(let i in data.headers){
                headers.push(data.headers[i]);
            }
        }
        
        if(headers.length == 0 && nextProps.listHeaders){
            headers = nextProps.listHeaders;                                                
        }else if(headers.length == 0 && data && data.data){
            headers = Object.keys(data.data[0]);     
        }

        records = data;   
        
        this.setState({
            listHeaders : headers,
            listTable : records
        }, () => {
            records = this.filterRecords(records);             
            this.setHeaders(headers);                
            this.setTable(records);
        });
    }

    setTable(list){
        let that = this;
        let idx = -1;
        let listElements = [];
        let counterLazy = 0;
        let listCols = [];
        
        for(let row in list.data){
            listCols = [];                            
            
            if(counterLazy < this.lazyLimit){
                idx++;
                let buttonDelete;
                let buttonDuplicateRow;

                if( typeof this.handleDeleteRow !== 'undefined' && !this.readOnlyInputs ){
                    buttonDelete = (<td className="text-center"><button title="Eliminar fila" type='button' className='btn btn-danger' onClick={this.handleDeleteRow} data-id={list.data[row]['id']} data-row={idx}><i className='fa fa-trash' aria-hidden='true' onClick={this.handleDeleteRow} data-id={list.data[row]['id']} data-row={idx}></i></button></td>);
                }else{
                    buttonDelete = '';
                }

                if( typeof this.handleDuplicateRow !== 'undefined' && !this.readOnlyInputs ){
                    buttonDuplicateRow = (<td className="text-center"><button title="Duplicar fila" type='button' className='btn btn-warning' onClick={this.handleDuplicateRow} data-id={list.data[row]['id']} data-row={idx}><i className='fa fa-files-o' aria-hidden='true' onClick={this.handleDuplicateRow} data-id={list.data[row]['id']} data-row={idx}></i></button></td>);
                }else{
                    buttonDuplicateRow = '';
                }
                
                for(let col in list.data[row]){
                    let colRes = '';

                    if(col === 'id' && !this.idReadOnly){
                        colRes = (
                            <td key={col+row+idx}>
                                <span>{list.data[row][col] || ''}</span>
                            </td>);
                    }else{
                        //Revisamos configuración de la columna en el json
                        if(list.config && list.config[col]){
                            //Tipo de campo
                            if(list.config[col].type){
                                switch(list.config[col].type){
                                    case 'select':
                                        let options = [];

                                        if(list.config[col].data){
                                            options = list.config[col].data.map( (item, index) => {
                                                let id = '';
                                                let value = '';

                                                if(list.config[col].data[index].id && list.config[col].data[index].value){
                                                    id = list.config[col].data[index]['id'];
                                                    value = list.config[col].data[index]['value'];;
                                                }else{
                                                    id = item;
                                                    value = item;
                                                }

                                                return (
                                                    <option key={col+row+idx+index} value={id}>
                                                        {value}
                                                    </option>);
                                            });
                                        }

                                        colRes = (
                                            <td key={col+row+idx}>
                                                <select className="form-control" name={col} value={list.data[row][col] || ''} data-row={idx} onChange={this.handleChangeCol} onBlur={this.handleSaveRow} {...this.commonPropertiesInputs}>
                                                    <option value='0'></option>
                                                    {options}
                                                </select>
                                            </td>
                                        );
                                    break;
                                    case 'checkbox':
                                        colRes = (
                                            <td key={col+row+idx} className="text-center">
                                                <input type='checkbox' name={col} value={list.data[row][col] || ''} data-row={idx} onChange={this.handleChangeCol} onBlur={this.handleSaveRow} {...this.commonPropertiesInputs}/>
                                            </td>);
                                    break;
                                    case 'date':
                                        colRes = (
                                            <td key={col+row+idx} className="text-center">
                                                <DateInput name={col} id={col+row+idx} value={list.data[row][col] || ''} numRow={idx} handleChange={this.handleChangeCol} onBlur={this.handleSaveRow} dateFormat="Y-m-d" displayFormat="YYYY-MM-DD" showDeleteButton="false"/>
                                            </td>);
                                    break;
                                }
                            }

                        }

                        if(colRes.length === 0){
                            colRes = (
                                <td key={col+row+idx}>
                                    <input type='text' className="form-control" name={col} value={list.data[row][col] || ''} data-row={idx} onChange={this.handleChangeCol} onBlur={this.handleSaveRow} {...this.commonPropertiesInputs}/>
                                </td>);
                        }

                    }
                    listCols.push(colRes);
                }

                listElements.push((
                    <tr key={'tr_'+this.name+row}>
                        {listCols}
                        {buttonDelete}         
                        {that.showDuplicate && buttonDuplicateRow}   
                    </tr>
                ));

                counterLazy++;                
            }
        }

        this.setState({
            listTableElements : listElements            
        });
    }

    render(){
        if(this.state.listTableElements.length > 0){
            let buttonNew;
            let buttonSave;
            let buttonReload;
            let headerDelete;
            let headerDuplicate;
    
            if( typeof this.props.handleSave !== 'undefined' && !this.props.readOnlyInputs ){
                buttonSave = (<button type='button' className='btn btn_primary fa fa-save' onClick={this.handleSave}></button>);
            }else{
                buttonSave = (<span></span>);
            }
    
            if( typeof this.props.handleReload !== 'undefined' && !this.props.readOnlyInputs ){
                buttonReload = (<button type='button' className='btn btn-warning pull-right'><i className='fa fa-refresh' aria-hidden='true' onClick={this.handleReloadTable}></i></button>)
            }else{
                buttonReload = (<span></span>);
            }
    
            if( typeof this.props.handleNewRow !== 'undefined' && !this.props.readOnlyInputs ){
                buttonNew = (<button type='button' className='btn btn-primary pull-right fa fa-plus m-1' onClick={this.handleNewRow} data-listname={this.state.listName}></button>)
            }else{
                buttonNew = (<span></span>);
            }
    
            if( typeof this.props.handleDeleteRow !== 'undefined' && !this.readOnlyInputs ){
                headerDelete = (<th>Eliminar</th>);
            }else{
                headerDelete = ('');
            }

            if(this.showDuplicate && typeof this.props.handleDuplicateRow !== 'undefined' && !this.readOnlyInputs){
                headerDuplicate = (<th>Duplicar</th>);
            }else{
                headerDuplicate = ('');
            }
    
            return(
                <div className={'table-component '+this.name+'-component'}>
                    <div>
                        {buttonSave}
                        {buttonNew}
                        {buttonReload}
                    </div>
                    <div className="table-element">
                        <table className='table table-striped table-hover'>
                            <thead>
                                <tr>
                                    {this.state.listHeaderElements}
                                    {headerDelete}
                                    {headerDuplicate}
                                </tr>
                            </thead>
                            <tbody>
                                {this.state.listTableElements}
                            </tbody>
                        </table>
                    </div>
                </div>
                
            )
        }else{
            return ('')
        }
        
    }
}

export default TableEditable;
