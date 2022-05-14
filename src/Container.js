import React, { Component } from 'react';

class Container extends Component {
  
  constructor(props){
    super(props);
  }
// Este componente actua como contenedor de las rutas configuradas en index.js, aqui se renderizan las paginas "enteras" de la intranet.
  render (props) {
    return (      
        <div id="container">
            {this.props.children}
        </div>
    )
  }
}

export default Container;
