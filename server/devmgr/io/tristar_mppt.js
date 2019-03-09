var modbus = require('jsmodbus');

// Tristar MODBUS

var roundObj = function(obj) {
    for(var i in obj) {
        if(obj.hasOwnProperty(i)){
            //console.log("-", obj[i])
            if (!isNaN(obj[i])) {
                obj[i] = Math.round(obj[i] * 100) / 100; 
            }
            if (typeof obj[i] === 'object') {
                roundObj(obj[i]);
            }
        }
    }
    return obj;
};



function tristar_mppt(tristar_address) {

    var self = this;
    self.data = {};


    // create a modbus client
    var client = modbus.client.tcp.complete({
        'host': tristar_address, //192.168.1.32 TSMPPT10480676
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

            self.data = roundObj(readTristar(tristarHoldingRegister));

        }, console.error);
    }, 2000);



    client.on('error', function (err) {
        console.log(err);
    })


    self.meta = {

        adc: {
            // Filtered ADC
            adc_vb_f_med:    { descr: 'Battery voltage, filtered',       unit: 'V' },
            adc_vbterm_f:    { descr: 'Batt.Terminal voltage, filtered', unit: 'V' },
            adc_vbs_f:       { descr: 'Battery Sense voltage, filtered', unit: 'V' },
            adc_va_f:        { descr: "Array voltage, filtered",         unit: "V" },
            adc_ib_f_shadow: { descr: "Battery current, filtered",       unit: "V" },
            adc_ia_f_shadow: { descr: "Array current, filtered",         unit: "A" },
            adc_p12_f:       { descr: "12 volt supply, filtered",        unit: "V" },
            adc_p3_f:        { descr: "3 volt supply, filtered",         unit: "V" },
            adc_pmeter_f:    { descr: "MeterBus voltage, filtered",      unit: "V" },
            adc_p18_f:       { descr: "1.8 volt supply, filtered",       unit: "V" },
            adc_v_ref:       { descr: "reference voltage",               unit: "V" }
        },

        temp: {
            // Temperatures
            T_hs:   { decr: "Heatsink temperature C √ -127 to + 127",                 unit: "°C" },
            T_rts:  { decr: "RTS temperature (0x80 = disconnect)  C √ -127 to + 127", unit: "°C" },
            T_batt: { decr: "Battery regulation temperature C √ -127 to + 127",       unit: "°C" },
        },

        batt: {
            // battery sense voltage, filtered
            battsV:       { decr: "Battery voltage",         unit: "V" },
            battsSensedV: { decr: "Battery sensed voltage",  unit: "V" },
            battsI:       { decr: "Battery charge current",  unit: "A" },
            arrayV:       { decr: "Array voltage",           unit: "V" },
            arrayI:       { decr: "Array current",           unit: "A" },
            statenum:     { decr: "State number",            unit: ""  },
            hsTemp:       { decr: "hs temperature",          unit: "°C"},
            rtsTemp:      { decr: "rts temperature",         unit: "°C"},
            outPower:     { decr: "Output power",            unit: "W" },
            inPower:      { decr: "Input power",             unit: "W" },
        },

        today: {
            // Logger – Today’s values
            vb_min_daily:   { decr: "battery minimal voltage",   unit: "V"  },
            vb_max_daily:   { decr: "battery maximal voltage",   unit: "V"  },
            va_max_daily:   { decr: "battery maximal current",   unit: "A"  },
            Ahc_daily:      { decr: "Amper hours",               unit: "Ah" },
            whc_daily:      { decr: "watt hours",                unit: "Wh" },
            flags_daily:    { decr: "flags",                     unit: ""   },
            Pout_max_daily: { decr: "max power output",          unit: "W"  },
            Tb_min_daily:   { decr: "min",                       unit: ""   },
            Tb_max_daily:   { decr: "max",                       unit: ""   },
            fault_daily:    { decr: "fault",                     unit: "W"  },
        }

    }


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

        return {

            adc: {
                // Filtered ADC
                adc_vb_f_med:    hr.register[24] * v_scale,
                adc_vbterm_f:    hr.register[25] * v_scale,
                adc_vbs_f:       hr.register[26] * v_scale,
                adc_va_f:        hr.register[27] * v_scale,
                adc_ib_f_shadow: hr.register[28] * v_scale,
                adc_ia_f_shadow: hr.register[29] * v_scale,
                adc_p12_f:       hr.register[30] * 18.612 * Math.pow(2, -15),
                adc_p3_f:        hr.register[31] * 6.6 * Math.pow(2, -15),
                adc_pmeter_f:    hr.register[32] * 18.612 * Math.pow(2, -15),
                adc_p18_f:       hr.register[33] * 3 * Math.pow(2, -15), 
                adc_v_ref:       hr.register[34] * 3 * Math.pow(2, -15),
            },

            temp: {
                // Temperatures
                T_hs:   hr.register[35], // Heatsink temperature C √ -127 to + 127
                T_rts:  hr.register[36], // RTS temperature (0x80 = disconnect)  C √ -127 to + 127
                T_batt: hr.register[37], // Battery regulation temperature C √ -127 to + 127
            },

            state: {
                // status
                adc_vb_f_1m:  hr.register[38], // Battery voltage, filtered(τ ≈ 1min) V √ n·V_PU·2 - 15
                adc_ib_f_1m:  hr.register[39], // Charging current, filtered(τ ≈       1min)    A √ n·I_PU·2 - 15
                vb_min:       hr.register[40], // Minimum battery voltage V √ n·V_PU·2 - 15
                vb_max:       hr.register[41], // Minimum battery voltage V √ n·V_PU·2 - 15
                hourmeter_HI: hr.register[42], // hourmeter, HI word h -
                hourmeter_LO: hr.register[43], // hourmeter, LO word h -
                fault:        hr.register[44], // all Controller faults bitfield - -
                alarm_HI:     hr.register[46], // alarm bitfield – HI word - -
                alarm_LO:     hr.register[47], // alarm bitfield – LO word - -
                dip:          hr.register[48], // all DIP switch positions bitfield - -
                led:          hr.register[49], // State of LED indications - -
            },

            batt: {
                // battery sense voltage, filtered
                battsV:       hr.register[24] * v_scale,
                battsSensedV: hr.register[26] * v_scale,
                battsI:       hr.register[28] * v_scale,
                arrayV:       hr.register[27] * v_scale,
                arrayI:       hr.register[29] * v_scale,
                statenum:     hr.register[50],
                hsTemp:       hr.register[35],
                rtsTemp:      hr.register[36],
                outPower:     hr.register[58] * v_scale,
                inPower:      hr.register[59] * v_scale,
            },

            today: {
                // Logger – Today’s values
                vb_min_daily:   hr.register[64] * v_scale,
                vb_max_daily:   hr.register[65] * v_scale,
                va_max_daily:   hr.register[66] * v_scale,
                Ahc_daily:      hr.register[67] * 0.1,
                whc_daily:      hr.register[68],
                flags_daily:    hr.register[69],
                Pout_max_daily: hr.register[70] * v_scale,
                Tb_min_daily:   hr.register[71],
                Tb_max_daily:   hr.register[72],
                fault_daily:    hr.register[73],
            }

        }
        // dipswitches = bin(rr.registers[48])[::-1][:-2].zfill(8)

        //console.log("DATA", self.data)
    }

    return this
}



module.exports = tristar_mppt;
