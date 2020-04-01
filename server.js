const express = require("express");
const bodyParser = require("body-parser");
const app = express();
const logger = require("./logger");
const fs = require("fs")
const util = require('./util');

let handlers = [];
let config = {};

app.use(bodyParser.text({
    type: "*/*"
}));

app.all("*", function(request, response) {
    if (!(config.ignorePaths && config.ignorePaths.includes(request.path))) {
        logger.createLine();
        logger.logValue('URL', request.url);
        logger.logValue('Headers', '');
        console.dir(request.headers);
        if (request.body && request.body.length) {
            logger.logValue('Body', request.body);
        }
    }

    for (const handler of handlers) {
        if (handler.type === "static" && handler.path === request.path) {
            response.type(handler.contentType);
            response.send(handler.content);
            return;
        }
        if (handler.type === "custom") {
            if (handler.path) {
                if (handler.path === request.path) {
                    handler.handle(request, response);
                    return;
                }
                continue;
            } else if (handler.shouldHandle) {
                if (handler.shouldHandle(request)) {
                    handler.handle(request, response);
                    return;
                }
            }
        }
    }

    if (config.plaintextNotFound) {
        response.type('text/plain');
        response.send('route not found');
        return;
    }

    if (request.path === "/") {
        util.serveStatic(response, './static/main.html');
        return;
    }
    
    response.statusCode = 404;
    util.serveStatic(response, './static/not-found.html');
    
});

const listener = app.listen(process.env.PORT || 8080, function() {
    logger.info("Listening on: " + listener.address().port);
    try {
        const file = fs.readFileSync('./config.json', 'utf8');
        config = JSON.parse(file);
        for (let handler of config.handlers) {
            if (handler.type === "static") {
                const content = fs.readFileSync('./content/' + handler.content);
                const contentType = handler.contentType || 'text/html';
                handlers.push({
                    type: 'static',
                    path: handler.path || '/',
                    content,
                    contentType
                });
            } else if (handler.type === "custom") {
                let handlerObject = require('./handlers/' + handler.handler);
                handlerObject.type = "custom";
                handlers.push(handlerObject);
            }
        }
    } catch (ex) {
        logger.error('Invalid or non-existent configuration file (config.json)');
        logger.error(ex.message);
        console.error(ex);
    }
});
