const { mdlinksReading } = require('./manageFile');

//Leo los parametros de la consola
const path = process.argv[2];
const options = process.argv.filter(item => item == '--validate' || item == '--stats');

//Declaro mi promesa principal
const mdLinks = (path, options) => {
  return new Promise((resolve, reject) => {
    if(path == undefined) {
      reject(new Error('Debe ingresar bien los parametros'));
    } 
      resolve(mdlinksReading(path, options));  
  });
};

//Hago llamado de mi promesa principal
mdLinks(path, options)
.then(response => console.log(response))
.catch(error => console.log(error.message));