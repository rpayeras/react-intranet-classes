import React from 'react';
import FormBasicTable from '../../../common/FormBasicTable';
import Modal from './Modal';

class Departments extends FormBasicTable {
    constructor(props){
        super(props);
        this.nameForm = 'departments';
        //Asignamos el modal especifico de bootstrap para que la clase padre pueda montarlo
        this.modalModule = Modal;
    }
}

export default Departments;