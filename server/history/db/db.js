const Client = require('mariasql');

var c = new Client({
  host: '127.0.0.1',
  user: 'root',
  password: 'raspberry',
  db: "history"
});

c.history = {}  // container own db functions

c.history.showTableSize = () => {
    return new Promise((resolve, reject) => {
        var prep_source = c.prepare(
            `SELECT 
                table_name AS "Table", 
                round(((data_length + index_length) / 1024 / 1024), 2) "Size (MB)"
            FROM information_schema.TABLES 
            WHERE table_schema = "history"
        `)
    
        c.query(prep_source({}), function(err, rows) {
            if (err)
                reject (err);
            resolve(rows)
        });    
    
    })
}

c.history.calc_level1 = () => {
    return new Promise((resolve, reject) => {
        var prep_source = c.prepare(
            `
            call calc_level1
        `)
    
        c.query(prep_source({}), function(err, rows) {
            if (err)
                reject (err);
            resolve(rows)
        });    
    })
}

c.history.iter_timer = (type, cb) => {
    var prep_source = c.prepare(
        `
        SELECT * FROM timer
        WHERE type = :type
        `);
    
    c.query(prep_source({type: type}), function(err, rows) {
        if (err)
            throw err;
    
        rows.some((row) => {
            cb(row)
        })
    });    
}

c.history.iter_source = (timer_id, cb) => {
    var prep_source = c.prepare(
        'SELECT * FROM source WHERE timer_id = :timer_id');
    
    c.query(prep_source({timer_id: timer_id}), function(err, rows) {
        if (err)
            throw err;
    
        rows.some((row) => {
            cb(row)
        })
    });    
}


c.history.insert_value  = (source, value) => {
    return new Promise((resolve, reject) => {
        var prep_source = c.prepare(
            `
            INSERT INTO history.data (time, source_id, level, value) 
            VALUES (now(), :source_id, :level, :value)
            `)
    
        c.query(prep_source({ source_id: source.id, level:0, value: value }), function(err, rows) {
            if (err)
                reject (err);
            resolve(rows)
        });    
    })
}


c.history.run_sql  = (sql) => {
    return new Promise((resolve, reject) => {
        var prep_source = c.prepare(sql)
    
        c.query(prep_source({}), function(err, rows) {
            if (err)
                reject (err);
            resolve(rows)
        });    
    })
}

c.history.data  = (level, source_id, limit) => {
    return new Promise((resolve, reject) => {
        var sql = 
            `
            SELECT time, value from data
            WHERE 
                 level     = :level
             AND source_id = :source_id
            ORDER BY id DESC
            LIMIT ` + limit
            
    
        c.query(sql, { level: level, source_id: source_id,limit: limit  }, { useArray: true, metadata: true,  }, function(err, rows) {
            if (err)
                reject (err);
            //console.log("rows", rows)
            resolve(rows)
        });    
    })
}





c.history.source  = () => {
    return new Promise((resolve, reject) => {
        var sql = 
            `
            SELECT * from source
            ORDER BY id
            `            
    
        c.query(sql, {  }, { useArray: true, metadata: true,  }, function(err, rows) {
            if (err)
                reject (err);
            //console.log("rows", rows)
            resolve(rows)
        });    
    })
}



//c.end();


module.exports = c
