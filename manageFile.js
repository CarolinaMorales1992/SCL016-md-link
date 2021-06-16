const fs = require('fs');
const markdownLinkExtractor = require('markdown-link-extractor');
let path = require('path');
const fetch =  require('node-fetch');

const mdlinksReading = (path, options) => {
    //Se crea promesa que leerá los directorios
    return new Promise((resolve, reject) => {
        let response = [];
        let files = fs.readdirSync(path); //Leo el directorio con el path recibido por parametro
        files = files.filter(file => file.includes('.md')); //Filtro todos los archivos por los .md

        /*
            Con el Promise.allSettled se resuelve todo el arreglo de objetos creados donde se encuentra toda la información
            y se agregan a un arreglo de respuesta el cual resuelve esta promesa
        */
        Promise.allSettled(linkExtractor(files, options))
        .then((results) => {
            results.forEach((result) => response.push(result.value));
            resolve(response);
        });
    });
}

const linkExtractor = (files, options) => {
    //se crea arreglo de promesas
    let promiseArray = [];
    //recorre todos los archivos filtrados con .md
    files.forEach(file => {
        const markdown = fs.readFileSync(file, {encoding: 'utf8'}); //Leo los archivos

        const details = markdownLinkExtractor(markdown, true); //Extraigo todos los links del archivo

        let linksFiltered = details.filter(detail => detail.href.includes('http')); //Filtro todos los links que contengan http

        //recorro todos los links filtrados
        linksFiltered.forEach(link => {
            //Hago petición al link con la promesa fetch
            let objectResponse = fetch(link.href)
            .then(res => {
                //creo objeto base de links con ruta, link, text
                let linkObject = {
                    'ruta': path.resolve(file),
                    'link': link.href,
                    'text': link.text
                };
                //se busca el validate para agregar status al objeto base
                if (options.find(option => option === '--validate')) {
                    linkObject['status'] = res.status;
                } 
                //retorno el objeto
                return linkObject;
            })
            .catch(error => console.log(error))

            //agrego la promesa con la peticion a mi arreglo de promesas
            promiseArray.push(objectResponse);
        }); 

    });
    
    return promiseArray;
} 

//exporto mi funcion que lee los archivos
module.exports = {
    mdlinksReading
}