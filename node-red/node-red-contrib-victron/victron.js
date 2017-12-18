var SerialPort = require('serialport');
var victron_mk2 = require('../../io/victron_mk2')
var victron_bmv = require('../../io/victron_bmv')


module.exports = function(RED) {
    function BmvNode(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        var globalContext = this.context().global;
        
        // open serial port
        var bmv = new victron_bmv(config.serialport)
        globalContext.set("victron_bmv", bmv);  // this is now available to other nodes
 
        node.on('input', function(msg) {
            msg.payload = bmv.data;
            node.send(msg);
        });

        node.on('close', function() {
            console.log("bmv port close !");
            bmv.close();
        });



    }
    RED.nodes.registerType("bmv-node",BmvNode);


/***************************************************************************** */

    function BmvNodeValue(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        var globalContext = this.context().global;
        
        node.on('input', function(msg) {
            var bmv = globalContext.get("victron_bmv")
            msg.payload = bmv.data[config.bmvValue].value;
            msg.unit    = bmv.data[config.bmvValue].unit;
            msg.label   = bmv.data[config.bmvValue].label;
            node.send(msg);
        });

        node.on('close', function() {
        });

    }
    RED.nodes.registerType("bmv-node-value",BmvNodeValue);


    /***************************************************************************** */

    function mk2(config) {
        RED.nodes.createNode(this,config);
        var node = this;
        var globalContext = this.context().global;

        var mk2 = globalContext.get("mk2-node")
        if (!mk2) {
            mk2 = new victron_mk2();
        }

        node.on('input', function(msg) {
            console.log("mk2-node input", msg)
            if (msg.payload && typeof msg.payload.set_assist !== 'undefined') {
                mk2.set_assist(msg.payload.set_assist)
            }
            msg.payload = mk2.data;
            node.send(msg);
        });

        node.on('close', function() {
            mk2.close();
        });

    }
    RED.nodes.registerType("mk2-node",mk2);

}




//receiveBmv("/dev/ttyUSB0", (data) => console.log ("data: ", data));
