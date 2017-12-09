/*

    Hello World Node App

*/
console.log ("Begin program ...");


// import { DbCurrent } from './db/db'
// var tristar = require ('./io/tristar')
// var bmv = require('./io/bmv')

// let dbCurrent = new DbCurrent();

// dbCurrent.getInfo();

// console.log ("Hello World");
// dbCurrent.startTimer(tristar, () => {});

console.log("Start ...");

import { SAA1064 } from "./io/SAA1064"
import { SAA_Address } from "./io/SAA1064"
import { SAA_digit } from "./io/SAA1064"

import { init as raspiInit }  from 'raspi';
import { I2C }  from 'raspi-i2c';
import { sleep } from "./helper/sleep";

console.log(SAA_Address.first)

raspiInit (async ()=> {
    const i2c = new I2C();
    const a = new SAA1064(i2c, SAA_Address.first);

    // a.ziffer(1,SAA_digit[10])
    // a.ziffer(2,SAA_digit[11])
    // a.ziffer(3,SAA_digit[12])
    // a.ziffer(4,SAA_digit[13])

    // for (let i= 0; i<9999;i++) {
    //     a.write(i.toString());
    //     await sleep(10);
    // }

    // let array = [
    //     "abcd",
    //     "ef00",
    //     "ABCD",
    //     "ef  ",
    //     "0000",
    //     "1 2 ",
    // ]
    // while(true) {
    //     for (let i = 0; i<array.length;i++) {
    //         a.write(array[i]);
    //         await sleep(1000);
    //     }
    // }

    let longString: string = "abcdef01234567890  abcdef01234567890  abcdef01234567890  ";
    while(true) {
        for (let i = 0; i<longString.length;i++) {
            a.write(longString.substring(i,i+4));
            await sleep(1000);
        }
    }

})

