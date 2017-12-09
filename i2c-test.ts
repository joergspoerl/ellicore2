const raspi = require('raspi');
const I2C = require('raspi-i2c').I2C;
const gpio = require('raspi-gpio');

/* ------------------------------------------------------------------ */
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

async function demo() {
  console.log('Taking a break...');
  await sleep(2000);
  console.log('Two second later');
}
/* ------------------------------------------------------------------ */

function randomIntInc (low, high) {
  return Math.floor(Math.random() * (high - low + 1) + low);
}

// raspi.init(() => {
//   const output = new gpio.DigitalOutput('GPIO17');
  
//   //ouput.write(0);

//   var o = false;
//   var interval = setInterval (() => {
//     o = !o;
//     if (o)
//       output.write(gpio.LOW);
//     else
//       output.write(gpio.HIGH);
    
//   }, 2000)
// })

async function scan () {
  raspi.init(async () => {
    const i2c = new I2C();
  
    console.log("Start ...")
    await sleep(1000);
    console.log("---------")
    
    var i = 0
  
    // for (ziffer=0;ziffer<255;ziffer++) {
    //   i2c.writeByte(i,1,ziffer, (err, data) => {
    //     if (err)
    //       console.log(i, ziffer, " Error: ", err);
    //     else
    //       console.log(i, ziffer, data)
    //   })
  
    //   await sleep(500);
    // }
  
    var interval = setInterval(async () => {
      //console.log(i, i2c.readByteSync(i));
      await sleep(100);
      
      // for (ziffer=0;ziffer<255;ziffer++) {
      //   i2c.writeByte(i,1,ziffer, (err, data) => {
      //     if (err)
      //       console.log(i, " Error: ", err);
      //     else
      //       console.log(i, data)
      //   })
    
      //   await sleep(100);
      // }
  
      
  
      i2c.readByte(i, (err, data) => {
        if (err)
          console.log(i, " Error: ", err);
        else
          console.log(i, data)
      })
      i = i + 1;
      if (i > 127)
        clearInterval(interval);  
    }, 300)
  
  });
  
}

async function initSAA(address) {
  const i2c = new I2C();
  raspi.init(async () => {
    i2c.writeByte(address, 0, 0b00110111, async (err, data) => {
      if (err)
        console.log(address, " Error: ", err);
      else {

        while (true) {
          console.log(address, "ok")
          // i2c.writeByteSync(address, 0, randomIntInc(0,255))
          // await sleep(randomIntInc(0,255));     
          i2c.writeByteSync(address, 1, randomIntInc(0,255))
          await sleep(randomIntInc(0,255));     
          i2c.writeByteSync(address, 2, randomIntInc(0,255))     
          await sleep(randomIntInc(0,255));     
          i2c.writeByteSync(address, 3, randomIntInc(0,255))     
          await sleep(randomIntInc(0,255));     
          i2c.writeByteSync(address, 4, randomIntInc(0,255))     
          await sleep(randomIntInc(0,255));     
          }
      }
    })
  })
}


//scan();

initSAA(56);