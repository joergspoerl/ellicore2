// Test crypto js

var CryptoJS = require("crypto-js");

// from here: https://groups.google.com/forum/#!topic/crypto-js/TOb92tcJlU0
CryptoJS.enc.u8array = {
    /**
     * Converts a word array to a Uint8Array.
     *
     * @param {WordArray} wordArray The word array.
     *
     * @return {Uint8Array} The Uint8Array.
     *
     * @static
     *
     * @example
     *
     *     var u8arr = CryptoJS.enc.u8array.stringify(wordArray);
     */
    stringify: function (wordArray) {
        // Shortcuts
        var words = wordArray.words;
        var sigBytes = wordArray.sigBytes;

        // Convert
        var u8 = new Uint8Array(sigBytes);
        for (var i = 0; i < sigBytes; i++) {
            var byte = (words[i >>> 2] >>> (24 - (i % 4) * 8)) & 0xff;
            u8[i] = byte;
        }

        return u8;
    },

    /**
     * Converts a Uint8Array to a word array.
     *
     * @param {string} u8Str The Uint8Array.
     *
     * @return {WordArray} The word array.
     *
     * @static
     *
     * @example
     *
     *     var wordArray = CryptoJS.enc.u8array.parse(u8arr);
     */
    parse: function (u8arr) {
        // Shortcut
        var len = u8arr.length;

        // Convert
        var words = [];
        for (var i = 0; i < len; i++) {
            words[i >>> 2] |= (u8arr[i] & 0xff) << (24 - (i % 4) * 8);
        }

        return CryptoJS.lib.WordArray.create(words, len);
    }
};






var encKey = 'optronojena07745';
var fixed_CUSTOMER_ID = 'WM#*!';
var CUSTOMER_ID = "20301";

var command = 0xA2;//"162";
var command = 160;


var buffer = new ArrayBuffer(15);
var data_bytes = new Uint8Array(buffer);


data_bytes[0] = command;
data_bytes[1] = 5; //random
data_bytes[2] = 2; //random
data_bytes[3] = 4; //random
data_bytes[4] = 7; //random
data_bytes[5] = fixed_CUSTOMER_ID.charCodeAt(0);
data_bytes[6] = fixed_CUSTOMER_ID.charCodeAt(1);
data_bytes[7] = fixed_CUSTOMER_ID.charCodeAt(2);
data_bytes[8] = fixed_CUSTOMER_ID.charCodeAt(3);
data_bytes[9] = fixed_CUSTOMER_ID.charCodeAt(4);
data_bytes[10] = CUSTOMER_ID.charCodeAt(0);
data_bytes[11] = CUSTOMER_ID.charCodeAt(1);
data_bytes[12] = CUSTOMER_ID.charCodeAt(2);
data_bytes[13] = CUSTOMER_ID.charCodeAt(3);
data_bytes[14] = CUSTOMER_ID.charCodeAt(4);


var wordArray = CryptoJS.lib.WordArray.create(buffer);


//var wordArray = CryptoJS.enc.u8array.parse(data_bytes);


// from here http://stackoverflow.com/questions/11889329/word-array-to-string
function wordToByteArray(wordArray) {
    var byteArray = [], word, i, j;
    for (i = 0; i < wordArray.length; ++i) {
        word = wordArray[i];
        for (j = 3; j >= 0; --j) {
            byteArray.push((word >> 8 * j) & 0xFF);
        }
    }
    return byteArray;
}



// Encrypt
//var ciphertext = CryptoJS.AES.encrypt(wordArray, 'test');

var message = 'Hallo Welt';
var key = '0000000000000000';
console.log("message: ", message);
console.log("key: ", key);


var ciphertext = CryptoJS.AES.encrypt(message, key);
//var b = CryptoJS.enc.u8array.stringify(ciphertext.ciphertext);

var dcBase64String = ciphertext.toString(); // to Base64-String
console.log('dcBase64String', dcBase64String);

console.log('ciphertext wordarray', ciphertext.ciphertext.words);
console.log('ciphertext wordToByteArray', wordToByteArray(ciphertext.ciphertext.words));

var words = CryptoJS.enc.Base64.parse(dcBase64String);
console.log('ciphertext hex from word', CryptoJS.enc.Hex.stringify(words));

console.log('ciphertext hex from ciphertext.ciphertext', CryptoJS.enc.Hex.stringify(ciphertext.ciphertext));


//var dcArrayBuffer = base64DecToArr(dcBase64String).buffer; // to ArrayBuffer

//console.log('ciphertext', ciphertext);
//console.log('ciphertext dcArrayBuffer', dcArrayBuffer);

// Decrypt
var words_decrypt = CryptoJS.AES.decrypt(ciphertext, '0000000000000000');

console.log('bytes', CryptoJS.enc.Hex.stringify(words_decrypt));


//console.log("u8arr", u8arr);
//var plaintext = bytes.toString(CryptoJS.enc.Utf8);
//console.log("plaintext",plaintext);