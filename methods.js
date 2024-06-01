const fs = require("fs");
let fn = require('date-fns');
let uuid = require('uuid')
const path = require("path");
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

function fileexist(code) {
    let p = new Promise((resolve, reject) => {
        fs.readdir(path.join(__dirname, 'Files'), (err, dir) => {
            if (dir.includes(code)) {
                resolve(true)
            }
            else {
                resolve(false)
            }
        })
    })
    return p
}
module.exports = { getdate, uid, gettime, get4id, fileexist }