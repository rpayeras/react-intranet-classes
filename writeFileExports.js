/**
* En cada build o start se revisan las nuevas secciones y se hace "export" 
* con ellas para que el sistema de TABS las use dinamicamente
* https://developer.mozilla.org/es/docs/Web/JavaScript/Referencia/Sentencias/export
*/

const fs = require('fs');
var folderExports = './src/components/sections';
var targetExports = './src/components/ModulesExports.js';

var result = [];
var statics = [ 
    "export {default as Dashboard} from './app/dashboard/Dashboard';"    
];

/**
 * Escribe el fichero con todas las secciones encontradas
 * @param {Array} list
 * @return {void} 
 */
function writeExports(list){
    if(typeof list !== "undefined")

    fs.writeFile(targetExports, '/**Archivo generado automaticamente para el funcionamiento de TABS en la app en writeFileExports.js*/ \r\n', function(err) {
        if(err) throw err;

        for(var i in statics){
            var str = statics[i]+"\r\n";
            
            fs.appendFileSync(targetExports, str, function(err) {
                console.log("OK");
            });                
        }

        for(var i in list){
            var path = list[i].path.replace('src/components/','');
            var str = "export {default as "+list[i].value+"} from '"+path+"/"+list[i].value+"';\r\n";
            
            fs.appendFileSync(targetExports, str, function(err) {
                console.log("OK");
            });                
        }
    });
}

/** 
 * Lee la carpeta dada y devuelve una lista de secciones
 * @param {String} folder
 * @return {void}
*/
function readModulesExports(folder){
    var list = fs.readdirSync(folder);

    for(var i in list){
        var nameFile = list[i].split('.');
        if(nameFile[1] === 'js' && nameFile[0] !== 'Modal'){
            let value = {path: folder, value: nameFile[0]};
            result.push(value);
        }else if (list[i].split('.')[1] === undefined){
          readModulesExports(folder+'/'+list[i]);
        }
    }

}

readModulesExports(folderExports);
writeExports(result);
