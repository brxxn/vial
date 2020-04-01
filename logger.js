const constants = require('./constants');

module.exports = {
    info: (text) => {
        console.log(constants.GREEN + 'info | ' + constants.RESET + text);
    },
    warn: (text) => {
        console.log(constants.YELLOW + 'warn | ' + text + constants.RESET);
    },
    error: (text) => {
        console.log(constants.RED + 'err | ' + text + constants.RESET);
    },
    createLine: ()=> {
        console.log(constants.BLUE + '-------------------------------------------------------------------------');
    },
    logValue: (key, value) => {
        console.log(`${constants.GREEN}${key}: ${constants.YELLOW}${value}${constants.RESET}`);
    }
}