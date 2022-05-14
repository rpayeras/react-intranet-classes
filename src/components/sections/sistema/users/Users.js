import React from 'react';
import FormBasicTable from '../../../common/FormBasicTable';
import Modal from './Modal';
import Util from '../../../common/utils/Util';

class Users extends FormBasicTable {
    constructor(props){
        super(props);
        this.nameForm = 'users';
        //Asignamos el modal especifico de bootstrap para que la clase padre pueda montarlo
        this.modalModule = Modal;
    }
}

export default Users;