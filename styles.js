const crypto = require('crypto')
const secret = prompt("Enter text : ")
const hash = crypto.createHmac('sha256',secret).update('welcome').digest('hex');
console.log(hash)