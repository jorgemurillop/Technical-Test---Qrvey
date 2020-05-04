'use strict'

const jwt = require('jwt-simple');
//modulo para el manejo de fechas
const moment = require('moment');
const config = require('../config');

function createToken(user) {
    const payload = {
        sub: user._id,
        iat: moment().unix(),
        exp: moment().add(1, 'days').unix(),
    }

    return jwt.encode(payload, config.SECRET_TOKEN);
}

function decodeToken(token) {
    const decoded = new Promise((resolve, reject) => {
        try {
            const payload = jwt.decode(token, config.SECRET_TOKEN);

            if (payload.exp <= moment().unix) {
                reject({
                    status: 401,
                    message: 'El token a expirado'
                });
            }
            resolve(payload);
        } catch (err) {
            reject({
                status: 500,
                message: `${err}`
            });
        }
    });

    return decoded;
}

function diff_minutes(dt2, dt1) {
    var diff = (dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    return Math.abs(Math.round(diff));
}


async function asyncForEach(array, callback) {
    for (let index = 0; index < array.length; index++) {
        await callback(array[index], index, array);
    }
}

//extension para arrays
Array.prototype.sum = function (prop) {
    var total = 0
    for (var i = 0, _len = this.length; i < _len; i++) {
        total += this[i][prop]
    }
    return total
}

Array.prototype.groupBy = function (prop) {
    return this.reduce(function (groups, item) {
        const val = item[prop];
        groups[val] = groups[val] || [];
        groups[val].push(item);
        return groups;
    }, {})
}

module.exports = {
    createToken,
    decodeToken,
    diff_minutes,    
    asyncForEach
};