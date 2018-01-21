const Client = require('mariasql');
const http   = require('http');
const https  = require('https');
const url    = require('url')

var c = new Client({
  host: '127.0.0.1',
  user: 'root',
  password: 'raspberry',
  db: "history"
});

function iter_source (timer_id, cb) {
    var prep_source = c.prepare(
        'SELECT * FROM source WHERE timer_id = :timer_id');
    
    c.query(prep_source({timer_id: timer_id}), function(err, rows) {
        if (err)
            throw err;
        console.dir(rows);
    
        rows.some((row) => {
            cb(row)
        })
    });    
}



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

            insert_value(source, data)  
        });
 
    }).on("error", (err) => {
    console.log("Error: " + err.message);
    });

}

function insert_value (source, value) {

    var prep = c.prepare(
    'insert into history.data (time, source_id, level, value) values (now(), :source_id, :level, :value) ');

    c.query(prep({ source_id: source.id, level:0, value: value }), function(err, rows) {
        if (err)
            throw err;
        console.dir(rows);
    });
    
}


setInterval(() => {
    iter_source (1, (source) => {
        get_value(source)
    })  
}, 1000);

setInterval(() => {
    iter_source (2, (source) => {
        get_value(source)
    })  
}, 60000);


c.end();
