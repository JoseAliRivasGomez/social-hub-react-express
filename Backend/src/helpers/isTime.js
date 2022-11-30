const moment = require('moment');

const isTime = (value) => {
    if (!value) {
        return false;
    }

    const fecha = moment(value, 'HH:mm', true);
    if (fecha.isValid()){
        return true;
    }else{
        return false;
    }
}

module.exports = {
    isTime
}