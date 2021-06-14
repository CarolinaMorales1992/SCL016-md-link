const fs = require('fs');
const markdownLinkExtractor = require('markdown-link-extractor');
let path = require('path');
const fetch =  require('node-fetch');
const { resolve } = require('path');

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

        let linksFiltered = details.filter(detail => detail.href.includes('http'));

        linksFiltered.forEach(link => {
            let linkObject = {
                'ruta': path.resolve(file),
                'link': link.href,
                'text': link.text
            };

            if (options.find(option => option === '--validate')) {
                fetchHref(link.href)
                .then(status => {
                    linkObject['status'] = status;
                    console.log(linkObject);
                });
                
            } 
            
                response.push(linkObject);
            
            
        }); 

    });
    
    return response;
} 

const fetchHref = (href) => {
    return new Promise((resolve, reject) => {
        fetch(href, { method: 'GET'})            
        .then(res => { 
            resolve(res.status);
        })
        .catch(error => console.log(error));
    });
}

module.exports = {
    mdlinksReading
}