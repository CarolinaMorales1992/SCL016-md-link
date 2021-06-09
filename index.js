const { mdlinksReading } = require('./manageFile');

const path = process.argv[2];
const options = process.argv.filter(item => item == '--validate' || item == '--stats');

const mdLinks = (path, options) => {
  return new Promise((resolve, reject) => {
    if(path == undefined) {
      reject(new Error('Debe ingresar bien los parametros'));
    } 
      resolve(mdlinksReading(path, options));  
  });
};


mdLinks(path, options)
.then(response => console.log(response))
.catch(error => console.log(error.message));