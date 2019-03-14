function objectToStringOr (object, adder, operator) {
    
    var str = "";
    if(adder == null) {
        
        Object.keys(object).map( (key) => {
                  
            str += key+operator+object[key]+" or ";
        })
    
    } else {
        Object.keys(object).map( (key) => {
                  
            str += adder+key+operator+object[key]+" or ";
        })
    }

    var len = str.length - 4;
    return str.substr(0, len);
}

function objectToStringAnd (Object, adder, operator) {

    var str = "";
    if(adder == null) {
        
        Object.keys(object).map( (key) => {
                  
            str += key+operator+object[key]+" and ";
        })
    
    } else {
        Object.keys(object).map( (key) => {
                  
            str += adder+key+operator+object[key]+" and ";
        })
    }

    var len = str.length - 5;
    return str.substr(0, len);
}

module.exports = {
    objectToStringOr,
    objectToStringAnd
}