var http = require('http');

var options = {
  host: '192.168.1.10',
  port: 8082,
  path: '/api/v1/history/get/0/3'
};

var blessed = require('blessed')
, contrib = require('blessed-contrib')
, screen = blessed.screen()
, line = contrib.line(
    { style:
      { line: "yellow"
      , text: "green"
      , baseline: "black"}
    , xLabelPadding: 3
    , xPadding: 5
    , label: 'Current'})
, data = {
    x: ['t1', 't2', 't3', 't4'],
    y: [5, 1, 7, 5]
 }
screen.append(line) //must append before setting data
line.setData([data])

screen.key(['escape', 'q', 'C-c'], function(ch, key) {
return process.exit(0);
});

setInterval(() => {
    http.get(options, function (resp) {
      resp.on('data', function (chunk) {
        //do something with chunk
        //console.log("chunk", chunk)
        data = JSON.parse(chunk)

        let y = data.map((v) => parseInt(v[0]))
        let x = data.map((v,i) => i.toString())
        let newData = { x: x, y: y}

        //console.log("newData", newData)
        line.setData([newData])
        screen.render()
    });
    }).on("error", function (e) {
      console.log("Got error: " + e.message);
    });
  }, 1000)
  
screen.render()