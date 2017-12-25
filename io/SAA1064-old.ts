
import { init as raspiInit }  from 'raspi';
import { I2C }  from 'raspi-i2c';
import { DigitalInput } from 'raspi-gpio'
import { sleep } from '../helper/sleep'
import { randomIntInc } from '../helper/random'


async function initSAA(address) {
  const i2c = new I2C();
  raspiInit(async () => {
    i2c.writeByteSync(address, 0, 0b00110111);
    while (true) {
      console.log(address, "ok")
      i2c.writeByteSync(address, 1, randomIntInc(0,255))
      await sleep(randomIntInc(0,255));     
      i2c.writeByteSync(address, 2, randomIntInc(0,255))     
      await sleep(randomIntInc(0,255));     
      i2c.writeByteSync(address, 3, randomIntInc(0,255))     
      await sleep(randomIntInc(0,255));     
      i2c.writeByteSync(address, 4, randomIntInc(0,255))     
      await sleep(randomIntInc(0,255));     
      }
  });
}

export enum SAA_Address {
  first  = 56,
  second = 57,
  thrid  = 58,
  fourth = 59
}

export const SAA_digit = [
  0b0111111/*0*/,
  0b0000110/*1*/,
  0b1011011/*2*/,
  0b1001111/*3*/,
  0b1100110/*4*/,
  0b1101101/*5*/,
  0b1111101/*6*/,
  0b0000111/*7*/,
  0b1111111/*8*/,
  0b1101111/*9*/,
  0b1110111/*A*/,
  0b1111100/*B*/,
  0b0111001/*C*/,
  0b1011110/*D*/,
  0b1111001/*E*/,
  0b1110001/*F*/
];

export const SAA_ascii = [
  0b0000000 /* ASCII 0 */,
  0b0000000 /* ASCII 1*/,
  0b0000000 /* ASCII 2*/,
  0b0000000 /* ASCII 3*/,
  0b0000000 /* ASCII 4*/,
  0b0000000 /* ASCII 5*/,
  0b0000000 /* ASCII 6*/,
  0b0000000 /* ASCII 7*/,
  0b0000000 /* ASCII 8*/,
  0b0000000 /* ASCII 9 */,

  0b0000000 /* ASCII 10 */,
  0b0000000 /* ASCII 11*/,
  0b0000000 /* ASCII 12*/,
  0b0000000 /* ASCII 13*/,
  0b0000000 /* ASCII 14*/,
  0b0000000 /* ASCII 15*/,
  0b0000000 /* ASCII 16*/,
  0b0000000 /* ASCII 17*/,
  0b0000000 /* ASCII 18*/,
  0b0000000 /* ASCII 19 */,

  0b0000000 /* ASCII 20 */,
  0b0000000 /* ASCII 21*/,
  0b0000000 /* ASCII 22*/,
  0b0000000 /* ASCII 23*/,
  0b0000000 /* ASCII 24*/,
  0b0000000 /* ASCII 25*/,
  0b0000000 /* ASCII 26*/,
  0b0000000 /* ASCII 27*/,
  0b0000000 /* ASCII 28*/,
  0b0000000 /* ASCII 29 */,

  0b0000000 /* ASCII 30 */,
  0b0000000 /* ASCII 31*/,
  0b0000000 /* ASCII 32*/,
  0b0000000 /* ASCII 33*/,
  0b0000000 /* ASCII 34*/,
  0b0000000 /* ASCII 35*/,
  0b0000000 /* ASCII 36*/,
  0b0000000 /* ASCII 37*/,
  0b0000000 /* ASCII 38*/,
  0b0000000 /* ASCII 39 */,

  0b0000000 /* ASCII 40 */,
  0b0000000 /* ASCII 41*/,
  0b0000000 /* ASCII 42*/,
  0b0000000 /* ASCII 43*/,
  0b0000000 /* ASCII 44*/,
  0b0000000 /* ASCII 45*/,
  0b0000000 /* ASCII 46*/,
  0b0000000 /* ASCII 47*/,

  0b0111111/* ASCII 48 */ /*0*/,
  0b0000110/* ASCII 49 */ /*1*/,
  0b1011011/* ASCII 50 */ /*2*/,
  0b1001111/* ASCII 51 */ /*3*/,
  0b1100110/* ASCII 52 */ /*4*/,
  0b1101101/* ASCII 53 */ /*5*/,
  0b1111101/* ASCII 54 */ /*6*/,
  0b0000111/* ASCII 55 */ /*7*/,
  0b1111111/* ASCII 56 */ /*8*/,
  0b1101111/* ASCII 57 */ /*9*/,

  0b0000000 /* ASCII 58*/,
  0b0000000 /* ASCII 59*/,
  0b0000000 /* ASCII 60*/,
  0b0000000 /* ASCII 61*/,
  0b0000000 /* ASCII 62*/,
  0b0000000 /* ASCII 63*/,

  0b0000000 /* ASCII 64*/,
  
  0b1110111 /* ASCII 65*/ /* A */,
  0b1111100 /* ASCII 66*/ /* B */,
  0b0111001 /* ASCII 67*/ /* C */,
  0b1011110 /* ASCII 68*/ /* D */,
  0b1111001 /* ASCII 69*/ /* E */,
  0b1110001 /* ASCII 70*/ /* F */,

  0b0000000 /* ASCII 70*/,
  0b0000000 /* ASCII 71*/,
  0b0000000 /* ASCII 72*/,
  0b0000000 /* ASCII 73*/,
  0b0000000 /* ASCII 74*/,
  0b0000000 /* ASCII 75*/,
  0b0000000 /* ASCII 76*/,
  0b0000000 /* ASCII 77*/,
  0b0000000 /* ASCII 78*/,
  0b0000000 /* ASCII 79*/,

  0b0000000 /* ASCII 80*/,
  0b0000000 /* ASCII 81*/,
  0b0000000 /* ASCII 82*/,
  0b0000000 /* ASCII 83*/,
  0b0000000 /* ASCII 84*/,
  0b0000000 /* ASCII 85*/,
  0b0000000 /* ASCII 86*/,
  0b0000000 /* ASCII 87*/,
  0b0000000 /* ASCII 88*/,
  0b0000000 /* ASCII 89*/,

  0b0000000 /* ASCII 90*/,
  0b0000000 /* ASCII 91*/,
  0b0000000 /* ASCII 92*/,
  0b0000000 /* ASCII 93*/,
  0b0000000 /* ASCII 94*/,
  0b0000000 /* ASCII 95*/,
  0b0000000 /* ASCII 96*/,
  0b1110111 /* ASCII 97*/ /* A */,
  0b1111100 /* ASCII 98*/ /* B */,
  0b0111001 /* ASCII 99*/ /* C */,
  0b1011110 /* ASCII 100*//* D */,
  0b1111001 /* ASCII 101*//* E */,
  0b1110001 /* ASCII 102*//* F */,
  0b0000000 /* ASCII 103 */,
  0b0000000 /* ASCII 104*/,
  0b0000000 /* ASCII 105*/,
  0b0000000 /* ASCII 106*/,
  0b0000000 /* ASCII 107*/,
  0b0000000 /* ASCII 108*/,
  0b0000000 /* ASCII 109*/,

  0b0000000 /* ASCII 110*/,
  0b0000000 /* ASCII 111*/,
  0b0000000 /* ASCII 112*/,
  0b0000000 /* ASCII 113*/,
  0b0000000 /* ASCII 114*/,
  0b0000000 /* ASCII 115*/,
  0b0000000 /* ASCII 116*/,
  0b0000000 /* ASCII 117*/,
  0b0000000 /* ASCII 118*/,
  0b0000000 /* ASCII 119*/,

  0b0000000 /* ASCII 120*/,
  0b0000000 /* ASCII 121*/,
  0b0000000 /* ASCII 122*/,
  0b0000000 /* ASCII 123*/,
  0b0000000 /* ASCII 124*/,
  0b0000000 /* ASCII 125*/,
  0b0000000 /* ASCII 126*/,
  0b0000000 /* ASCII 127*/,
];

export class SAA1064 {
  i2c:I2C;
  address:SAA_Address;

  constructor (i2c:I2C, address:SAA_Address) {
    this.i2c = i2c;
    this.address = address;
    this.init();
  }

  init () {
    this.i2c.writeByteSync(this.address, 0, 0b00110111);

    this.i2c.writeByteSync(this.address, 1, 0b00000000);
    this.i2c.writeByteSync(this.address, 2, 0b00000000);
    this.i2c.writeByteSync(this.address, 3, 0b00000000);
    this.i2c.writeByteSync(this.address, 4, 0b00000000);
  }

  ziffer (pos:number, digit:number) {
    this.i2c.writeByteSync(this.address, pos, digit);
  }

  write (str:string) {
    let a = str.padStart(4, " ");
    //let b = str.padEnd(4, " ")
    let characters = a.split('');
    let digitNumber = 1;
    let currentChar:any = "";

    // console.log("a:", a);    
    // console.log("a:", a);    
    // console.log("characters:", characters);

    while (digitNumber <= 4 ){
      currentChar = characters.shift();
      while (currentChar == ".") {
        currentChar = characters.shift()
      }
      // console.log("currentChar:", currentChar);
      // console.log("digitNumber:", digitNumber);
      if (characters[0] == ".") {
        //characters.shift();
        this.ziffer (digitNumber, SAA_ascii[currentChar.charCodeAt(0)] + 0b10000000)
      } else {
        this.ziffer (digitNumber, SAA_ascii[currentChar.charCodeAt(0)])
      }
      digitNumber++
    }
  }
}

//scan();

//initSAA(56);