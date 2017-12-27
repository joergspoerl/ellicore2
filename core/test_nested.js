var nestedProperty = require("nested-property");

var data = {};
var data1 = {
    a: "Hallo",
    b: {
        c: "Welt",
        d: 12,
        jk: {
            hallo: {
                welt: 1,
                wo: 100
            }
        }
    }
}

data.mk2 = {
    "dc_info": {
        "ubat": "13.45",
        "ibat": "0.00",
        "cbat": "6.59",
        "finv": "0.14",
        "frame": {
            "type": "Buffer",
            "data": [
                15,
                32,
                181,
                154,
                34,
                70,
                12,
                65,
                5,
                0,
                0,
                0,
                147,
                2,
                0,
                137,
                170
            ]
        }
    },
    "error": "no ac_info frame",
    "led_status": {
        "mains": "on",
        "absorption": "off",
        "bulk": "off",
        "float": "on",
        "inverter": "off",
        "overload": "off",
        "low bat": "off",
        "temp": "off"
    },
    "get_state": {
        "state": "charge storage"
    },
    "ac_info": {
        "umains": "227.3",
        "imains": "1.1",
        "uinv": "227.3",
        "iinv": "0.6",
        "fmains": "50.1"
    }
}

data.bmv = {
    "V": 13.439,
    "VS": -0.026,
    "I": 0.713,
    "CE": 0,
    "SOC": 100,
    "TTG": -0.016666666666666666,
    "Alarm": "OFF",
    "Relay": "OFF",
    "AR": "0",
    "BMV": "602S",
    "FW": "211",
    "H1": -387.483,
    "H2": 0,
    "H3": 0,
    "H4": 0,
    "H5": 0,
    "H6": "-898812",
    "H7": 11.828,
    "H8": 15.087,
    "H9": 0,
    "H10": "2",
    "H11": "0",
    "H12": "0",
    "H13": "0",
    "H14": "0",
    "H15": -0.03,
    "H16": 0
}


data.mppt = {
    "adc": {
        "adc_vb_f_med": 13.3648681640625,
        "adc_vbterm_f": 13.458251953125,
        "adc_vbs_f": 13.3648681640625,
        "adc_va_f": 1.131591796875,
        "adc_ib_f_shadow": 0,
        "adc_ia_f_shadow": 0,
        "adc_p12_f": 13.387598876953124,
        "adc_p3_f": 3.61783447265625,
        "adc_pmeter_f": 12.97069189453125,
        "adc_p18_f": 1.7794189453125,
        "adc_v_ref": 2.04254150390625
    },
    "temp": {
        "T_hs": 11,
        "T_rts": 11,
        "T_batt": 11
    },
    "state": {
        "adc_vb_f_1m": 2433,
        "adc_ib_f_1m": 65533,
        "vb_min": 2128,
        "vb_max": 2735,
        "hourmeter_HI": 0,
        "hourmeter_LO": 51763,
        "fault": 0,
        "alarm_HI": 0,
        "alarm_LO": 0,
        "dip": 188,
        "led": 6
    },
    "batt": {
        "battsV": 13.3648681640625,
        "battsSensedV": 13.3648681640625,
        "battsI": 0,
        "arrayV": 1.131591796875,
        "arrayI": 0,
        "statenum": 3,
        "hsTemp": 11,
        "rtsTemp": 11,
        "outPower": 0,
        "inPower": 0
    },
    "today": {
        "vb_min_daily": 11.689453125,
        "vb_max_daily": 14.4525146484375,
        "va_max_daily": 41.37451171875,
        "Ahc_daily": 29.3,
        "whc_daily": 380,
        "flags_daily": 4,
        "Pout_max_daily": 5.548095703125,
        "Tb_min_daily": 8,
        "Tb_max_daily": 11,
        "fault_daily": 0
    }
}

var target = {}

function iterObj(obj, path, target) {
    for (var key in obj) {
      if (obj[key] !== null && typeof obj[key] === "object") {
        // Recurse into children
        iterObj(obj[key], path + "." + key, target);
      } else {
          if (typeof obj[key] === 'number' ) {
              var full_name = path + "." + key
              console.log("path: ", full_name + ': ' + obj[key]);
              nestedProperty.set(target, full_name, obj[key])
              }
      }
    }
}

iterObj (data, "data", target);

console.log("target", target)