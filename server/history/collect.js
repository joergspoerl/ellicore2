const db     = require('./db/db');
const http   = require('http');
const https  = require('https');
const url    = require('url')


function get_value (source) {
    let u = url.parse(source.url);
    let client = http

    if (u.protocol == "https:"){
        client = https;
    }

    client.get(u, (resp) => {
        let data = ''

        // A chunk of data has been recieved.
        resp.on('data', (chunk) => {
            data += chunk;
        });
 
        // The whole response has been received. Print out the result.
        resp.on('end', () => {
            // console.log(JSON.parse(data));            
            console.log(data);

            if (source.func && source.func != "") {
                data = eval(source.func)(data)
            }

            db.history.insert_value(source, data)  
        });
 
    }).on("error", (err) => {
    console.log("Error: " + err.message);
    });

}

function create_timer () {
    db.history.iter_timer (1, (timer) => {
        console.log("timer (1):", timer)
    
        setInterval(() => {
            db.history.iter_source (timer.id, (source) => {
                get_value(source)
            })  
        }, timer.time);
        
    })

    db.history.iter_timer (2, (timer) => {
        console.log("timer (2):", timer)
    
        setInterval(() => {
            db.history.run_sql (timer.sql, (result) => {
                console.log(result)
            })  
        }, timer.time);
        
    })
    
    
}

create_timer()

//c.end();
