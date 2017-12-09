
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
  second = 58,
  thrid  = 60,
  fourth = 62
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
}

//scan();

//initSAA(56);