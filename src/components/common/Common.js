import React, {Component} from 'react';

/*
* Common
* Aqui van los metodos utiles a todos los componentes que extienda
*/
class Common extends Component{
    constructor(props){
        super(props);
        this.serverUrl = 'http://intranet_new/server';   
        this.serverPciUrl = 'http://192.168.0.11/index.php';             
        this.handleInput = this.handleInput.bind(this);
        this.classLoading = '';
        this.classLoadingData = '';
    }

    handleInput(evt){
        const target = evt.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        let postSelected = this.state;        
        postSelected[name] = value;
        this.setState(postSelected);
    }

    showAlertSuccess(message){
        $('.alert-success .message').html(message);
        $('.alert-success').fadeIn();
        setTimeout( () => {
            $('.alert-success').fadeOut();
        },1000);
    }

    showAlertError(message){
        if(typeof(message) !== 'string'){
            message = '';
        }
        
        $('.alert-danger .message').html(message);
        $('.alert-danger').fadeIn();
        setTimeout( () => {
            $('.alert-danger').fadeOut();
        },3000);
    }

    showLoadingData(idElement){       
        if(document.getElementById(idElement)){
            document.getElementById(idElement).style.display = "block";            
        } 
    }

    hideLoadingData(idElement){
        console.log(idElement);
        if(document.getElementById(idElement)){
            document.getElementById(idElement).style.display = "none";
        }
    }

    showLoading(nameElement){
        if(typeof nameElement !== "undefined" && nameElement[0]){
            let nameElementMayus = nameElement;
            nameElementMayus = nameElementMayus[0].toUpperCase()+nameElementMayus.substring(1);
            
            if (typeof nameElement !== "undefined" && typeof nameElementMayus !== "undefined"){
                $('#'+nameElement+' .loading-gif, #'+nameElement+'_content .loading-gif, #'+nameElementMayus+' .loading-gif, #'+nameElementMayus+'_content .loading-gif, .'+nameElementMayus+'_content .loading-gif').fadeIn('fast');            
            }
        }
    }
    
    hideLoading(nameElement){
        if(typeof nameElement !== "undefined"){
            let nameElementMayus = nameElement;
            nameElementMayus = nameElementMayus[0].toUpperCase()+nameElementMayus.substring(1);

            if (typeof nameElement !== "undefined" && typeof nameElementMayus !== "undefined"){
                $('#'+nameElement+' .loading-gif, #'+nameElement+'_content .loading-gif, #'+nameElementMayus+' .loading-gif, #'+nameElementMayus+'_content .loading-gif, .'+nameElementMayus+'_content .loading-gif').fadeOut('fast');            
            }
        }     
    }

    /**
     * Clona un objeto con todas sus propiedades internas sin ninguna referencia al objeto original
     * @param {Object} obj 
     * @return {Object}
     */
    clone(obj){
        let that = this;

        if(obj===null || typeof obj !== "object"){
          return obj;
        }
       
        if(obj instanceof Date){
          return new Date(obj.getTime());
        }
       
        if(Array.isArray(obj)){
          var clonedArr = [];
          obj.forEach(function(element){
            clonedArr.push(that.clone(element))
          });
          return clonedArr;
        }
       
        let clonedObj = new obj.constructor();
        for(var prop in obj){
          if(obj.hasOwnProperty(prop)){
            clonedObj[prop] = that.clone(obj[prop]);
          }
        }
        return clonedObj;
      }
}

export default Common;
