import React, { Component } from 'react';

class TableEditableOld extends Component {
    constructor(props){
        super(props);
        this.propertiesInputs = [];
        this.state = {
            nameIdRow : this.props.nameIdRow,
            listName : this.props.listName,
            className : this.props.className,
            tableName : this.props.tableName,
            listHeaders : this.props.listHeaders,
            listTable : this.props.listTable,
            readOnlyInputs : this.props.readOnlyInputs
        };

        this.handleClickRow = this.props.handleClickRow;
        this.handleEditCol = this.props.handleEditCol;
        this.handleNewRow = this.props.handleNewRow;
        this.handleDeleteRow = this.props.handleDeleteRow;
        this.handleReloadTable = this.props.handleReloadTable;
        this.handleSave = this.props.handleSave;
        this.handleInputBlur = this.props.handleInputBlur;
    }

    /*
    * Al recibir nuevos parametros en el componente ya creado reconstruimos headers y tables.
    */
    componentWillReceiveProps(nextProps){
        this.setReadOnly(nextProps.readOnlyInputs);
        this.setHeaders(nextProps.listHeaders);
        this.setTable(nextProps.listTable);
    }

    setHeaders(list){
        var headers = list.map((item, index) => {
            return (<th key={index}>{item.toUpperCase()}</th>);
        });
        
        this.setState({
            listHeaders : headers
        });
    }

    setTable(list){
        var idx = -1;
        
        var table = list.map((item, index) => {
            idx++;
            return (
                <tr key={'tr_'+this.state.listName+index}>
                    {this.setCols(index, idx, item)}
                    <td>
                        <button type='button' className='btn btn-danger fa fa-trash' data-id={item[this.state.nameIdRow]} data-listname={this.state.listName} onClick={this.handleDeleteRow}></button>
                    </td>
                </tr>
            );
            
        });

        this.setState({
            listTable : table
        });
    }

    setReadOnly(isReadOnly){
        if( isReadOnly ){
            this.propertiesInputs['readOnly'] = 'readOnly';
        }
    }

    setCols(indexList, idxList, row){
        var listCols = [];

        for(let i in row){
            let col = (
                <td key={i+indexList+idxList}>
                    <input type='text' name={i} value={row[i] || ''} data-index={idxList} data-listname={this.state.listName} onChange={this.handleEditCol} onBlur={this.handleInputBlur} {...this.propertiesInputs}/>
                </td>);
            listCols.push(col);
        }
        return listCols;
    }

    render(){
        if( typeof this.props.handleSave !== 'undefined' && !this.props.readOnlyInputs ){
            var buttonSave = (<button type='button' className='btn btn_primary fa fa-save' onClick={this.handleSave}></button>);
        }else{
            var buttonSave = (<span></span>);
        }

        if( typeof this.props.handleReload !== 'undefined' && !this.props.readOnlyInputs ){
            var buttonReload = (<button type='button' className='btn btn-warning pull-right'><i className='fa fa-refresh' aria-hidden='true' onClick={this.handleReloadTable}></i></button>)
        }else{
            var buttonReload = (<span></span>);
        }

        if( typeof this.props.handleNewRow !== 'undefined' && !this.props.readOnlyInputs ){
            var buttonNew = (<button type='button' className='btn btn-primary pull-right fa fa-plus' onClick={this.handleNewRow} data-listname={this.state.listName}></button>)
        }else{
            var buttonNew = (<span></span>);
        }

        return(
            <div className={this.state.className}>
                {buttonSave}
                <span className='col-sm-9 text-center'>{this.state.tableName}</span>
                {buttonNew}
                {buttonReload}
                <table className='table table-striped table-hover'>
                    <thead>
                        <tr>
                            {this.state.listHeaders}
                            <th>Eliminar</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.state.listTable}
                    </tbody>
                </table>
            </div>
            
        )
    }
}

export default TableEditableOld;
