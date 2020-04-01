module.exports = {
    path: "/base",
    // uncomment this if you want to use logic to determine if this should be used as the handler
    // shouldHandle: (request) => {
    //      return true;
    // },
    handle: (request, response) => {
        response.type("text/plain");
        response.send("This is the base handler. You can extend it and do more things.");
    }
}