  
class Util{

    static getCookieBK(cname){
        var name = cname + '=';
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        for(var i = 0; i <ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return '';   
    }

    static setCookieBK(cname, cvalue, exdays) {
        var d = new Date();
        d.setTime(d.getTime() + (exdays*24*60*60*1000));
        var expires = 'expires='+ d.toUTCString();
        document.cookie = cname + '=' + cvalue + ';' + expires + ';path=/ httponly';
    }

    static deleteCookiesBK(){
        document.cookie = 'username=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/ httponly;';
    }

    static getCookie(cname){
        return localStorage.getItem(cname);        
    }

    static setCookie(cname, cvalue, exdays){
        localStorage.setItem(cname, cvalue);        
    }

    static deleteCookies(){
        localStorage.clear();      
    }
    
    static hideSideMenu(){
        let element = document.getElementById('menu-izquierda');

        if( !$('#menu-izquierda').is(':visible') || element.style.width === '104%'){
            if( element.style.display.lenght === 0 || element.style.display === 'block' ){
                element.style.cssText = 'display: none; position: initial;';
            }else{
                element.style.cssText = 'display: block !important; position: absolute;z-index: 10; width: 104%;';
            }
        }else{
            $('#menu-izquierda').show();
        }
    }

    /*
    *Comprueba que tiene la estructura y los objetos, ademas de tener contenido, cada argumento es un nivel
    */
    static checkPropObject(obj /*, level1, level2, ... levelN*/) {
        var args = Array.prototype.slice.call(arguments, 1);

        for (var i = 0; i < args.length; i++) {
            if (!obj || !obj.hasOwnProperty(args[i])) {
                return false;
            }
            obj = obj[args[i]];
        }
        return true;
    }

    static sortCollection(collection){
        let sortable = [];
        let res = [];

        if(typeof collection === "object") {
            for(let item in collection){
                let subItem = collection[item];
                for( let prop in subItem){
                    sortable[subItem['nombre']] = subItem;
                }
            }
        }else{
            sortable = collection;
        }

        //Ordenamos la propiedad
        let keys = Object.keys(sortable);
        keys.sort();
        for(let i in keys){
            res.push(sortable[keys[i]]);
        }
        
        return res;
    }

    static removeValueArray(array, value){
        if(typeof array === "object"){
            Array.prototype.remove = function() {
                var what, a = arguments, L = a.length, ax;
                while (L && this.length) {
                    what = a[--L];
                    while ((ax = this.indexOf(what)) !== -1) {
                        this.splice(ax, 1);
                    }
                }
                return this;
            };

            array.remove(value);
        }
        return array;
    }

    static validateField(field, type){
        let re;
        
        switch(type){   
            case 'alphanumeric':
                re = /^(?=.*[0-9])(?=.*[a-z])([a-z0-9_-]+)$/;       
                return re.test(field);                
            break;   
            case 'ip':
                re = /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;       
                return re.test(field);                
            break;       
            case 'name':
                re = /.+/;
                return re.test(field);
            break;

            case 'email':
                re = /^[\w!#$%&\'*+\/=?^`{|}~.-]+@(?:[a-z\d][a-z\d-]*(?:\.[a-z\d][a-z\d-]*)?)+\.(?:[a-z][a-z\d-]+$)/i;
                return re.test(field);
            break;
            
            case 'tel':
                re = /^[\s()+-]*([0-9][\s()+-]*){6,20}$/;
                return re.test(field);
            break;

            case 'cif':
                re = /^[a-zA-Z]{1}\d{7}[a-zA-Z0-9]{1}$/;
                return re.test(field);
            break;

            case 'postalCode':
                re = /^([1-9]{2}|[0-9][1-9]|[1-9][0-9])[0-9]{3}$/;
                return re.test(field);
            break;

            default:
                return field;
            break;
        }
    }

}

export default Util;

