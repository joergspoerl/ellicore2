var Client = require('mariasql');

var c = new Client({
  host: '127.0.0.1',
  user: 'root',
  password: 'raspberry'
});

var prep = c.prepare(
    'insert into history.data (time, name, level, value) values (now(), :name, :level, :value) ');

let i = 0
setInterval ( () => {
    i++
    console.log("Insert: ", i)

    c.query(prep({ name: 'test4js', level:0, value: Math.random() }), function(err, rows) {
        if (err)
            throw err;
        console.dir(rows);
        });
    
}, 100)
      

c.end();
