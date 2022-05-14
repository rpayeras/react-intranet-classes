// Bootstrap 4.x
import 'bootstrap';

import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Route, Switch } from 'react-router-dom';

import "./scss/main.scss";
import Container from "./Container";
import Login from "./components/app/login/Login";
import NewPassword from "./components/app/login/NewPassword";
import App from "./components/App";

//Archivo de inicio, definimos rutas de la app
ReactDOM.render(
    <BrowserRouter>
        <div>
            <Switch>
                <Route exact path='/' component={Login} />
                <Route path='/app' component={App} />
                <Route path='/newpassword' component={NewPassword} />
            </Switch>
        </div>
    </BrowserRouter>
    , document.getElementById('container')
);