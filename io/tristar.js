// Tristar MODBUS

var modbus = require('jsmodbus');

var tristar = {};


// create a modbus client
var client = modbus.client.tcp.complete({
    'host': "TSMPPT10480676",
    'port': 502,
    'autoReconnect': true,
    'reconnectTimeout': 4000,
    'timeout': 8000,
    'unitId': 1
});


var tristarHoldingRegister = {};

client.connect();

// reconnect with client.reconnect()

client.on('connect', function () {

    console.log("begin connect");

});


setInterval(function () {

    //console.log("begin setTimout");

    client.readHoldingRegisters(0, 80).then(function (tristarHoldingRegister) {

        readTristar(tristarHoldingRegister);

    }, console.error);
}, 2000);



client.on('error', function (err) {

    console.log(err);

})


function readTristar(hr) {

    // for all indexes, subtract 1 from what's in the manual

    // scaling values
    var V_PU_hi = hr.register[0];
    var V_PU_lo = hr.register[1];
    var I_PU_hi = hr.register[2];
    var I_PU_lo = hr.register[3];

    var V_PU = V_PU_hi + V_PU_lo;
    var I_PU = I_PU_hi + I_PU_lo;

    var v_scale = V_PU * Math.pow(2, -15);
    var i_scale = I_PU * Math.pow(2, -15);
    var p_scale = V_PU * I_PU * Math.pow(2, -17);


    tristar = {

        // Filtered ADC        adc_vb_f_med: {
            value: hr.register[24] * v_scale,
            descr: 'Battery voltage, filtered',
            unit: 'V'
        },

        adc_vbterm_f: {
            value: hr.register[25] * v_scale,
            descr: 'Batt.Terminal voltage, filtered',
            unit: 'V'
        },

        adc_vbs_f: {
            value: hr.register[26] * v_scale,
            descr: 'Battery Sense voltage, filtered',
            unit: 'V'
        },

        adc_va_f: {
            value: hr.register[27] * v_scale,
            descr: "Array voltage, filtered",
            unit: "V"
        },


        adc_ib_f_shadow: {
            value: hr.register[28] * v_scale,
            descr: "Battery current, filtered",
            unit: "V"
        },

        adc_ia_f_shadow: {
            value: hr.register[29] * v_scale,
            descr: "Array current, filtered",
            unit: "A"
        },
        adc_p12_f :   { value: hr.register[30] * 18.612 * Math.pow(2, -15), descr: "12 volt supply, filtered", unit: "V"},
        adc_p3_f :    { value: hr.register[31] * 6.6 * Math.pow(2, -15), descr: "3 volt supply, filtered", unit: "V" },
        adc_pmeter_f: { value: hr.register[32] * 18.612 * Math.pow(2, -15), descr: "MeterBus voltage, filtered", unit: "V" },
        adc_p18_f:    { value: hr.register[33] * 3 * Math.pow(2, -15), descr: "1.8 volt supply, filtered", unit: "V" },
        adc_v_ref:    { value: hr.register[34] * 3 * Math.pow(2, -15), descr: "reference voltage", unit: "V" }    }

    // Temperatures    tristar.T_hs   = hr.register[35]; // Heatsink temperature C √ -127 to + 127
    tristar.T_rts  = hr.register[36]; // RTS temperature (0x80 = disconnect)  C √ -127 to + 127
    tristar.T_batt = hr.register[37]; // Battery regulation temperature C √ -127 to + 127

    // status
    tristar.adc_vb_f_1m = hr.register[38]; // Battery voltage, filtered(τ ≈ 1min) V √ n·V_PU·2 - 15
    tristar.adc_ib_f_1m = hr.register[39]; // Charging current, filtered(τ ≈       1min)    A √ n·I_PU·2 - 15
    tristar.vb_min = hr.register[40]; // Minimum battery voltage V √ n·V_PU·2 - 15
    tristar.vb_max = hr.register[41]; // Minimum battery voltage V √ n·V_PU·2 - 15
    tristar.hourmeter_HI = hr.register[42]; // hourmeter, HI word h -
    tristar.hourmeter_LO = hr.register[43]; // hourmeter, LO word h -
    tristar.fault = hr.register[44]; // all Controller faults bitfield - -
    tristar.alarm_HI = hr.register[46]; // alarm bitfield – HI word - -
    tristar.alarm_LO = hr.register[47]; // alarm bitfield – LO word - -
    tristar.dip = hr.register[48]; // all DIP switch positions bitfield - -
    tristar.led = hr.register[49]; // State of LED indications - -






    // battery sense voltage, filtered
    tristar.battsV       = hr.register[24] * v_scale;
    tristar.battsSensedV = hr.register[26] * v_scale;
    tristar.battsI       = hr.register[28] * v_scale;
    tristar.arrayV       = hr.register[27] * v_scale;
    tristar.arrayI       = hr.register[29] * v_scale;
    tristar.statenum     = hr.register[50];
    tristar.hsTemp       = hr.register[35];
    tristar.rtsTemp      = hr.register[36];
    tristar.outPower     = hr.register[58] * v_scale;
    tristar.inPower      = hr.register[59] * v_scale;

    // Logger – Today’s values
    tristar.vb_min_daily   = hr.register[64] * v_scale;
    tristar.vb_max_daily   = hr.register[65] * v_scale;
    tristar.va_max_daily   = hr.register[66] * v_scale;
    tristar.Ahc_daily      = hr.register[67] * 0.1;
    tristar.whc_daily      = hr.register[68];
    tristar.flags_daily    = hr.register[69];
    tristar.Pout_max_daily = hr.register[70] * v_scale;
    tristar.Tb_min_daily   = hr.register[71];
    tristar.Tb_max_daily   = hr.register[72];
    tristar.fault_daily    = hr.register[73];



    // dipswitches = bin(rr.registers[48])[::-1][:-2].zfill(8)
    


    // debug
    //console.log("---> tristar:", tristar);
}


module.exports = function () { return tristar };