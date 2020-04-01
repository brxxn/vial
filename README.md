# vial 🧪

Vial is a lightweight vulnerability debugging server designed for making quick and fast handlers for requests, allowing you to find vulnerabilities involving requests to a server and having a place to handle OAuth flows. It's simple and easy to use, allowing you to quickly test something you need to and stay semi-organized when performing tests. It also supports being hosted on free hosting platforms such as Glitch.

## Installing vial

Vial runs on Node.JS and express. You'll need to have node and npm installed on your host. Installation is pretty simple, so here are the instructions for commonly used platforms:

### Installing it locally

You can run vial on localhost if you prefer. Here are the installation instructions:

* Open a terminal and run `git pull git@github.com:brxxn/vial.git`. Then, run `npm install` to gather all dependencies.
* Create a file called `config.json` and put the following inside:

```json
{
    "handlers": [],
    "plaintextNotFound": false
}
```

* (optional) Create a directory called "content" which you can use later.
* Run `npm start` and visit `localhost:8080` to visit vial. (note: if you want to change the port vial runs on, you can add `PORT=1337` before `npm start` to change it)
* If you see any errors in the console, ensure you followed the above steps correctly.

### Installing it on Glitch

If you would like to host vial on [Glitch](https://glitch.com/), you can do so via importing from Git. Glitch will host your project for you when a request is made to your project's server, and it will automatically apply changes you make from inside the Glitch editor. Here are the installation instructions:

* Create a new project (you can select any option as the content will be overwritten).
* **IMPORTANT:** make sure you make your project private (click on project in upper-left > "Make This Project Private") so others cannot see what you're working on.
* Delete the `.gitignore` file so you can see files that are ignored by it in the Glitch editor.
* Create a file called `config.json` and put the following inside:

```json
{
    "handlers": [],
    "plaintextNotFound": false
}
```

* Visit `<project-name>.glitch.me` to visit your vial instance.
* If you see any errors in the console, ensure you followed the above steps correctly.

## Using vial

Using vial is super simple.

### Handlers

There are two types of handlers: static and custom. Static handlers will serve a static file to a specified path in the handler object. Custom handlers will locate a javascript file in the `handlers` directory, which can be used to perform actions.

#### Custom handlers

You can create a custom handler by creating a JS file in the handlers directory. Here's an example of what a handler could look like:

```js
const util = require('../util');

module.exports = {
    path: "/custom-handler",
    handle: (request, response) => {
        if (request.headers['Accept'] && request.headers['Accept'].includes('webhook-bot-thing')) {
            response.type("application/json");
            response.send(JSON.stringify({
                specialRequiredWebhookResponse: {
                    ok: true
                }
            }));
            return;
        }
        // this will serve the file test-file.html in the content directory of the project.
        util.serveStatic(response, './content/test-file.html');
    }
}
```

You can alternatively not include the `path` and replace it with a `shouldHandle(request)` function, which needs to return true or false and will handle the request if it's true. You will then need to register this handler in `config.json`, which you can do by putting the following in the `handlers` key:

```json
{
    "type": "custom",
    "handler": "custom-handler.js"
}
```

(note: you do **not** need to include `./handlers/` before `custom-handler.js`, as this is performed automatically)

#### Static handlers

Static handlers can be used for serving things like webpages you need to quickly serve to test something such as CSRF or an SVG you want to use to test proxying content. To include the actual content, you'll need to create a file in the `content/` directory of the project. If the directory does not exist, create it. You can add a static handler by adding this to the handlers array in your config:

```json
{
    "type": "static",
    "path": "/vial-vuln-demo",
    "content": "test.html",
    "contentType": "text/html"
}
```

### Logging

#### Request logging

Most HTTP requests are logged into the output, including 404s. If there is a program continuously making requests to your vial server that you can't easily stop, you can prevent their requests from being logged while still handling the request normally. You can do this by adding the following to your config:

```json
{
    "ignorePaths": [
        "/weird-webhook"
    ]
}
```

#### Custom logging

If you want colorful logging (not supported in Glitch editor), you can use the logger (`const logger = require('../logger');`) to log things into the console. For example, you can use `logger.error('this isnt working')` to print a colorful `err | hi` into the console. You can also use `logger.logValue('test key', 'test value')` to log a value similar to how the other logged values look in the console.

## Extending vial

Vial is extremely small so you can extend it as much as you'd like. Feel free to fork it and add features or make your own version. It's designed to do whatever you want it to and give you as much control as possible. If you want to add features directly to this repo that improve your workflow, feel free to make a PR. If you wish you could do something with this, feel free to make a feature request on GitHub Issues.

### Contributing

Want to contribute to this project but don't know how? You can fork this repository and make a pull request to have your feature included. Here's a list of things you can do:

* Add support for a config value that you think would be useful
* Add some utils to `util.js` that you would use commonly.
* Support more optional request logging.
* Make something look prettier.
* Anything that improves your experience using vial

### Troubleshooting

Here are some common issues that occur with vial:

* **I'm making a request to my server, but it's not responding.** This means you haven't sent any response data through `response.send` in your custom handler. Make sure your request can reach the `response.send` in the end of your handler.
* **Vial says failed to serve file.** If you're using `util.serveStatic`, make sure you're pointing to the right file. Note that it looks for files from the root of the project.
* **I got an error that says "Invalid or non-existent configuration file". What do I do?** Make sure your config.json is valid and all the files for the handlers are listed.