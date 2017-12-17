// var msg = {};
// msg.payload = {
//     "NewTotalNumberSyncGroups": "1",
//     "NewSyncGroupName": "sync_serial",
//     "NewSyncGroupMode": ["UMTS", "UMTS"],
//     "Newmax_ds": "177878",
//     "Newmax_us": "268614",
//     "Newds_current_bps": "28100,105607,25758,111840,119727,135680,130623,122684,137270,100180,129139,127571,128641,117702,117638,129924,125588,110377,119080,126140",
//     "Newmc_current_bps": "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0",
//     "Newus_current_bps": "11405,18306,13197,24496,28662,30962,28090,25556,32383,31142,28588,23214,26171,28302,25132,28704,37216,46014,38806,39029",
//     "Newprio_realtime_bps": "4483,6752,2522,8501,8533,10080,10027,6805,10875,10027,7928,8437,8554,8575,7642,9773,11935,9699,10165,9179",
//     "Newprio_high_bps": "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0",
//     "Newprio_default_bps": "3953,5003,6572,6519,8087,7494,6741,8289,8437,9190,9137,4759,6126,8522,6635,7557,8734,16355,11066,13122",
//     "Newprio_low_bps": "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0"
// }

msg.payload = [
    
        {
            label: "ds_current_bps",
            backgroundColor: "rgba(50, 248, 0, 0.4)",
            borderColor: "rgba(50, 248, 0, 0.1)",
            data: msg.payload.Newds_current_bps.split(","),
        },

        {
            label: "us_current_bps",
            backgroundColor: "rgba(255, 50, 0, 0.4)",
            borderColor: "rgba(255, 50, 0, 0.1)",
            data: msg.payload.Newus_current_bps.split(","),
        },


        {
            label: "prio_realtime_bps",
            backgroundColor: "rgba(255, 0, 0, 0.4)",
            borderColor: "rgba(255, 0, 0, 0.1)",
            data: msg.payload.Newprio_realtime_bps.split(","),
        },


        {
            label: "prio_high_bps",
            backgroundColor: "rgba(255, 248, 200, 0.4)",
            borderColor: "rgba(255, 248, 200, 0.1)",
            data: msg.payload.Newprio_high_bps.split(","),
        },


        {
            label: "prio_default_bps",
            backgroundColor: "rgba(255, 248, 0, 0.4)",
            borderColor: "rgba(255, 248, 0, 0.1)",
            data: msg.payload.Newprio_default_bps.split(","),
        },


        {
            label: "prio_low_bps",
            backgroundColor: "rgba(255, 248, 0, 0.6)",
            borderColor: "rgba(255, 248, 0, 0.1)",
            data: msg.payload.Newprio_low_bps.split(","),
        },

]


return msg

