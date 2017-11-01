var prettyjson = require('prettyjson');


function debug(args) {
    var content = ''
    for (var i = 0, j = arguments.length; i < j; i++) {
      content += (prettyjson.render(arguments[i]) + '\r\n');
    }
    console.log(getDateTimeString(), ' ---> ', content)
}

function getDateTimeString () {
    var myDate = new Date();
    var myDateString = 
        myDate.getFullYear() + '-' +
        ('0' + (myDate.getMonth()+1)).slice(-2) + '-' +
        ('0' + myDate.getDate()).slice(-2) + ' ' +
        ('0' + myDate.getHours()).slice(-2) + ':' +
        ('0' + myDate.getMinutes()).slice(-2) + ':' +
        ('0' + myDate.getSeconds()).slice(-2) + '.' +
        myDate.getMilliseconds() 
        
    return myDateString;
        
}


module.exports = debug
