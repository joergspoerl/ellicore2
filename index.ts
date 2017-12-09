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

    // const a = new SAA1064(i2c, SAA_Address.first);
    // a.ziffer(1,SAA_digit[12])

    // const b = new SAA1064(i2c, SAA_Address.second);
    // b.ziffer(1,SAA_digit[12])

    // const c = new SAA1064(i2c, SAA_Address.fourth);
    // c.ziffer(1,SAA_digit[10])
    
    // a.ziffer(1,SAA_digit[10])
    // a.ziffer(2,SAA_digit[11])
    // a.ziffer(3,SAA_digit[12])
    // a.ziffer(4,SAA_digit[13])

    function scan() {
        console.log("scan ...")
        for (let i=0;i<127;i++) {
            try {
                console.log(i, i2c.readByteSync(i));
            }
            catch (exception) {
                console.log(i, exception.message)
            }
        }
    }

    //scan();


    async function counter (display:SAA1064) {
        for (let i = 0; i < 9999; i++) {
            display.write(i.toString());
            await sleep(10);
        }
    }

    async function showArray (display:SAA1064) {
        let array = [
            "abcd",
            "ef00",
            "ABCD",
            "ef  ",
            "0000",
            "1   ",
            " 2  ",
            "  3 ",
            "   4",
            "1   ",
            " 2  ",
            "  3 ",
            "   4",
            "1   ",
            " 2  ",
            "  3 ",
            "   4",
            "A  1",
            "   2",
            "B  3",
            "   4",
            "C  5",
            "   6",
            "D  7",
            "   8",
            "E  9",
            "   a",
            "F  b",
            "   c",
        ]
        while (true) {
            for (let i = 0; i < array.length; i++) {
                display.write(array[i]);
                await sleep(1000);
            }
        }
    }

    async function scroll (display:SAA1064) {
        let longString: string = "abc    def    012345   67890  abcdef        012 34  567890  abcdef   01234567890  ";
        while(true) {
            for (let i = 0; i<longString.length;i++) {
                display.write(longString.substring(i,i+4));
                await sleep(500);
            }
        }
    }

    let task1 = counter(new SAA1064(i2c, SAA_Address.first));
    let task2 = showArray(new SAA1064(i2c, SAA_Address.second));
    let task3 = scroll(new SAA1064(i2c, SAA_Address.thrid));
    let task4 = scroll(new SAA1064(i2c, SAA_Address.fourth));
    
    let r = Promise.all([task1,task2,task3,task4]);
})

