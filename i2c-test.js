const raspi = require('raspi');
const I2C = require('raspi-i2c').I2C;
 
raspi.init(() => {
  const i2c = new I2C();

  // console.log(i2c.writeByteSync(0x70,0,0xFF));
  // console.log(i2c.writeByteSync(0x72,0,0xFF));
  // console.log(i2c.writeByteSync(0x73,0,0xFF));
  // console.log(i2c.writeByteSync(0x75,0,0xFF));

  // console.log(i2c.readByteSync(0x70));
  // console.log(i2c.readByteSync(0x72));                                               
  // console.log(i2c.readByteSync(0x74));                                               
  // console.log(i2c.readByteSync(0x76));                                               
  // console.log(i2c.readByteSync(0x78));                                               

  // for (i = 0; i < 128; i++) {
  //   console.log(i, i2c.readByteSync(i));
  // }

  var i = 0
  var interval = setInterval(() => {
    //console.log(i, i2c.readByteSync(i));

    i2c.writeByte(i,255, (err, data) => {
      if (err)
        console.log(i, " Error: ", err);
      else
        console.log(i, data)
    })
    

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
