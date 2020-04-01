const fs = require('fs');
const logger = require ('./logger');

module.exports = {
    serveStatic: function(response, file, type='text/html') {
        let fileContent = "<h1>Internal Server Error</h1><p>Failed to serve file. Check server logs for more information.</p>";
        try {
            fileContent = fs.readFileSync(file, 'utf8');
        } catch (ex) {
            logger.error(`error while reading file ${file}: ` + ex.message);
            console.error(ex);
        }
        response.type(type);
        response.send(fileContent);
    }
};