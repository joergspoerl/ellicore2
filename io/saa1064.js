// const raspi = require('raspi');
// const I2C = require('raspi-i2c').I2C;
const saa_ascii = require("./saa1064_ascii")

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

    self.write = (str) => {
        return new Promise ( (resolve, reject) => {
            var a = str.padStart(4, " ");
            //let b = str.padEnd(4, " ")
            var characters = a.split('');
            var digitNumber = 1;
            var currentChar = "";
        
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
                self.i2c.writeByteSync(self.address, digitNumber, saa_ascii[currentChar.charCodeAt(0)] + 0b10000000);
              } else {
                self.i2c.writeByteSync(self.address, digitNumber, saa_ascii[currentChar.charCodeAt(0)]);
              }
              digitNumber++
            }
            resolve ({
                value: str
            })
        } )
    }
    

    return self
}



module.exports = saa1064;