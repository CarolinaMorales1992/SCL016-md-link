const fs = require('fs');
const markdownLinkExtractor = require('markdown-link-extractor');
let path = require('path');

const mdlinksReading = (path, options) => {

    let files = fs.readdirSync(path);
    files = files.filter(file => file.includes('.md'));

    return linkExtractor(files, options);
}

const linkExtractor = (files, options) => {
    let response = [];
    files.forEach(file => {
        const markdown = fs.readFileSync(file, {encoding: 'utf8'});

        const details = markdownLinkExtractor(markdown, true);
        let linksFiltered = details.filter(detail => detail.includes('http'));
        
        linksFiltered.forEach(link => {
            let linkObject = {
                'ruta': path.resolve(file),
                'link': link
            };

            //console.log(options);
           //if(options == ) 

            response.push(linkObject);

        }); 
        
    });
    return response;
} 


module.exports = {
    mdlinksReading
}