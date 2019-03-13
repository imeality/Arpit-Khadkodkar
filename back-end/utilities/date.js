var moment = require ('moment');

function yesterdayDate () {

    var date = moment().format('LLL');
     date = date.split(" ");
     var mm = date[1].split(",");
      mm[0] = parseInt(mm[0]) -1;
      
    var str = ""+date[0]+" "+mm[0]+", "+date[2]; 

    return str;
}

module.exports = {
    yesterdayDate
}