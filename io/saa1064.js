// const raspi = require('raspi');
// const I2C = require('raspi-i2c').I2C;


function saa1064 (i2c, address) {
    var self = this;
    console.log("saa1064 init")
    console.log("saa1064 address", address)
    
    self.address = address;
    self.i2c     = i2c
    
    self.meta    = { }
    self.data    = { };



    console.log("address", self.address)

    // init display
    self.i2c.writeByteSync(self.address, 0, 0b00110111);
    

    self.set_register =  (register, value) => {
        self.i2c.writeByteSync(self.address, Number.parseInt(register), Number.parseInt(value));
        return new Promise ((resolve, reject) => {
            resolve({
                register:  Number.parseInt(register),
                value:     Number.parseInt(value)
            });
        })
    }

    return self
}



module.exports = saa1064;