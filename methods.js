let fn = require('date-fns');
let uuid = require('uuid')
function getdate() {
    return fn.format(new Date(), "dd/MM/yyyy");
}

function gettime() {
    return fn.format(new Date(), "HH:mm:ss");
}

function uid() {
    return uuid.v4();
}

function get4id() {
    return uid().substring(0, 4)

}
module.exports = { getdate, uid, gettime, get4id }