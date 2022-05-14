import React, { Component } from 'react';
import './Table.scss';

class Table extends Component {
    constructor(props){
        //Recuperamos propiedades pasadas al componente
        super(props);
        //Propiedades del componente
        this.rowIdName = this.props.rowIdName;
        this.readOnlyInputs = this.props.readOnlyInputs ? this.props.readOnlyInputs : false;
        this.showUtilsHeader = this.props.showUtilsHeader ? this.props.showUtilsHeader : true;
        this.excludeCols = (this.props.excludeCols ? this.props.excludeCols : []);
        this.filters = [];
        this.commonInputProperties = [];        
        this.lazyRows = true;
        this.lazyLimit = 20;
        
        //Estado del componente, cambios aqui provocan recargar el renderizado del componente
        this.state = {
            listHeaders : this.props.listHeaders,
            listTable : this.props.listTable,
            listHeaderElements : [],
            listTableElements : [],
            listTableSearch : [],
            options : []
        };

        this.handleReloadTable = this.props.handleReloadTable;        
        this.handleClickRow = this.props.handleClickRow;
        this.handleNewRow = this.props.handleNewRow;
        this.handleDeleteRow = this.props.handleDeleteRow;
        this.handleClickHeaderTable = this.handleClickHeaderTable.bind(this);
        this.handleChangeSearch = this.handleChangeSearch.bind(this);
        this.handleClickOrderTable = this.handleClickOrderTable.bind(this);
        this.handleClickHeaderBlank = this.handleClickHeaderBlank.bind(this);
    }

    componentWillMount(){
        this.setHeaders(this.props.listHeaders);
        this.setTable(this.props.listTable);
    }

    componentDidMount(){
        //Vamos cargando el contenido de la tabla a medida que bajamos el scroll aplicando siempre filtros
        let that = this;
        $('.tab-pane').on('scroll', function() {
            if($(this).scrollTop() + $(this).innerHeight() >= $(this)[0].scrollHeight) {
                let list = that.filterRecords(that.props.listTable);                                
                that.lazyLimit += 20;
                that.setTable(list);              
            }
        });
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

        records = data.data ? data.data : data;
                               
        this.setState({
            listHeaders : headers,
            listTable : records
        }, () => {
            records = this.filterRecords(records);             
            this.setHeaders(headers);                
            this.setTable(records);
        });
    }

    handleClickHeaderBlank(evt){
        evt.stopPropagation();
        let className = evt.target.className.substr(0, evt.target.className.indexOf(' '));

    }

    handleClickHeaderTable(evt){
        evt.stopPropagation();
        let target;
        let childrens;

        if(evt.target.className === 'container-header'){
            target = evt.target.children[0];
            childrens = evt.target.children;
        }else{
            target = evt.target;
            childrens = evt.target.parentNode.children;
        }
        
        for( let i = 0; i < childrens.length; i++) {
            let child = childrens[i];
            if( this.isHidden(target) ){
                child.style.display = 'inline-block';

                if(child.children[0]){
                    child.children[0].focus();
                }
            }else{
                child.style.display = 'none';
            }

            if( child.className === 'utils-header'){
                child.style.display = 'inline-block';
            }
        }
    }

    handleChangeSearch(evt){
        const target = evt.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const id = evt.target.dataset.id;
        this.filters[id] = value;
        this.setTable(this.filterRecords(this.state.listTable));
    }

    filterRecords(list){     
        if (list && Object.keys(this.filters).length > 0) {

            return list.map( (item, index) => {
                let valid = true;

                for(let i in this.filters) {
                    if (item[i] !== null && valid) {
                        let itemTemp = item[i].toUpperCase();
                        let valueTemp = this.filters[i].toUpperCase();
        
                        if (itemTemp.indexOf(valueTemp) >= 0) {
                            valid = true;
                        }else{
                            valid = false;
                        }
                    }
                }

                if (valid) {
                    return item;                    
                }
            });
        }else{
            return list;
        }
    }

    handleClickOrderTable(evt){
        evt.stopPropagation();
        let that = this;
        const id = evt.target.dataset.id;
        const order = evt.target.dataset.order;
        let list = that.state.listTable.data ? that.state.listTable.data : that.state.listTable;
        let element =  $('[class*="'+id+'_th"]')        
        
        //Verifica si el string es un date por formato YYYY-MM-DD o DD-MM-YYYY 
        function checkIsDate(str){
            if(typeof str === 'string'){
                return str.match(/^\d{2}[./-]\d{2}[./-]\d{4}$/) || str.match(/^\d{4}[./-]\d{2}[./-]\d{2}$/);
            }else{
                return false;
            }
        }
        
        switch (order){
            case 'alpha':
            console.log(id);
            console.log(list[0]);

                list.sort( (a,b) =>{
                    a = checkIsDate(a) ? new Date(a) : a[id].toLowerCase();
                    b = checkIsDate(b) ? new Date(b) : b[id].toLowerCase();

                    if(typeof a === "object" && typeof b === "object"){
                        if (a < b) return -1;
                        if (a > b) return 1;
                        return 0;
                    }else{
                        if(a >= 0 && b >= 0){
                            return a - b;
                        }else{
                            if (a < b) return -1;
                            if (a > b) return 1;
                            return 0;
                        }
                    }
                });
                
                element.find('.fa.fa-sort').hide();
                element.find('.fa.fa-sort-alpha-asc').show();
            break;

            case 'reverse':
                list.sort( (a,b) =>{
                    a = checkIsDate(a) ? new Date(a) : a[id].toLowerCase();
                    b = checkIsDate(b) ? new Date(b) : b[id].toLowerCase();
                    
                    if(typeof a === "object" && typeof b === "object"){
                        if (a > b) return -1;
                        if (a < b) return 1;
                        return 0;
                    }else{
                        if(a >= 0 && b >= 0){
                            return b - a;
                        }else{
                            if (a > b) return -1;
                            if (a < b) return 1;
                            return 0;
                        }
                    }
                });
                
                element.find('.fa.fa-sort-alpha-asc').hide();
                element.find('.fa.fa-sort-alpha-desc').show();
            break;
            
            default:
                list.sort( (a,b) =>{
                    if (a['id'] < b['id'])
                        return -1;
                    if (a['id'] > b['id'])
                        return 1;
                    return 0;
                });

                element.find('.fa.fa-sort-alpha-desc').hide();
                element.find('.fa.fa-sort-alpha-asc').hide();
                element.find('.fa.fa-sort').show();
            break;
        }

        that.setTable(list);
    }

    setHeaders(list){
        if(list){
            let headers = list.map((item, index) => {
                let utilsHeader = (<span className='utils-header'></span>);
    
                if (this.showUtilsHeader) {
                    utilsHeader = (<span className='utils-header'>
                                    <i className='fa fa-sort' onClick={this.handleClickOrderTable} data-order='alpha' data-id={item} > </i>
                                    <i className='fa fa-sort-alpha-asc' onClick={this.handleClickOrderTable} data-order='reverse' data-id={item} > </i>
                                    <i className='fa fa-sort-alpha-desc' onClick={this.handleClickOrderTable} data-id={item} > </i>
                                </span>);
                }
    
                if (this.excludeCols.indexOf(item) < 0 ) {
                    return (<th key={index} className={item+'_th'}>
                                <div className="container-header" onClick={this.handleClickHeaderTable}>
                                    <span className="text-header" onClick={this.handleClickHeaderTable}>{item.toUpperCase()}</span>
                                    <span className='search-header'>
                                        <input type='text' placeholder={item.toUpperCase()} onChange={this.handleChangeSearch} onClick={(evt) =>{evt.stopPropagation()}} data-id={item}/>
                                    </span>
                                    {utilsHeader}
                                </div>
                            </th>);
                }
            });
        
            this.setState({
                listHeaderElements : headers
            });
        }
    }

    setTable(list){
        if(list){
            let counterLazy = 0;

            let table = list.map((item, index) => {
                if(typeof item !== 'undefined' && counterLazy < this.lazyLimit){
                    let buttonDelete;

                    if( typeof this.props.handleDeleteRow !== 'undefined' && !this.readOnlyInputs ){
                        buttonDelete = (<td className="text-center"><button type='button' className='btn btn-danger' onClick={this.handleDeleteRow} data-id={item.id}><i className='fa fa-trash' aria-hidden='true' onClick={this.handleDeleteRow} data-id={item.id}></i></button></td>);
                    }else{
                        buttonDelete = '';
                    }

                    counterLazy++;
                    return (
                        <tr key={'tr_'+Math.random()+'_'+item.id}>
                            {this.setCols(item)}
                            {buttonDelete}
                        </tr>
                    );
                }
            });
            
            if(table){
                this.setState({
                    listTableElements : table
                });
            }
        }
    }

    setReadOnly(isReadOnly){
        if(isReadOnly){
            this.commonInputProperties['readOnly'] = 'readOnly';
        }
    }

    setCols(row){
        var listCols = [];

        for (var i in row) {
            let tdClass = '';
            //React no permite incluir objetos en el jsx, evitamos esto
            if(typeof row[i] === "object"){
                row[i] = '';
            }
            
            if((row[i] % 1) >= 0){
                tdClass = 'text-right';
            }
            
            //Exclusion de columnas
            if( typeof this.excludeCols === "undefined") {
                let col = (<td key={'td_'+Math.random()+'_'+i} className={tdClass} onClick={this.handleClickRow} data-id={row[this.rowIdName]}>{row[i]}</td>);
                listCols.push(col);
            }else{
                if( this.excludeCols.indexOf(i) < 0 ) {
                    let col = (<td key={'td_'+Math.random()+'_'+i} className={tdClass} onClick={this.handleClickRow} data-id={row[this.rowIdName]}>{row[i]}</td>);
                    listCols.push(col);
                }
            }
        }

        return listCols;
    }
    
    isHidden(el) {
        return (el.offsetParent === null)
    }

    render(){
        let buttonNew;
        let buttonReload;
        let headerDelete;

        if( typeof this.props.handleNewRow !== 'undefined' && !this.readOnlyInputs ){
            buttonNew = (<button type='button' className='btn btn-primary pull-right m-2 fa fa-plus' onClick={this.handleNewRow}></button>);
        }else{
            buttonNew = (<span></span>);
        }

        if( typeof this.props.handleReloadTable !== 'undefined' && !this.readOnlyInputs ){
            buttonReload = (<button type='button' className='btn btn-warning pull-right m-2 fa fa-refresh' onClick={this.handleReloadTable}></button>);
        }else{
            buttonReload = (<span></span>);
        }

        if( typeof this.props.handleDeleteRow !== 'undefined' && !this.readOnlyInputs ){
            headerDelete = (<th>Eliminar</th>);
        }else{
            headerDelete = ('');
        }

        return( 
            <div className={'table-component '+this.state.className}>
                {buttonNew}
                {buttonReload}
                <div className="table-element">
                    <table className='table table-striped table-hover'>
                        <thead>
                            <tr>
                                {this.state.listHeaderElements}
                                {headerDelete}
                            </tr>
                        </thead>
                        <tbody>
                            {this.state.listTableElements}
                        </tbody>
                    </table>
                </div>
            </div>
        )
    }
}

export default Table;
