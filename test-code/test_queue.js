

var queue = []
var busy = false

function add_queue (cb){
    console.log("add_queue")
    return new Promise ( (resolve, reject) => {
        queue.push({ 
            cb: cb, 
            resolve: resolve, 
            reject: reject
        })
        
        if (busy == false) {
            prozess ()
        }
    })

}


function prozess () {
    
    var item = queue.shift();
    if (item) {
        busy = true
        setTimeout(() => {
            item.cb();
            item.resolve("resolve")
            busy = false
            prozess();
        }, 1000);
    }
}


function create_requests () {
    add_queue(()=>{
        console.log("1")
    })
    add_queue(()=>{
        console.log("2")
    })
    add_queue(()=>{
        console.log("3")
    })
    add_queue(()=>{
        console.log("4")
    })
    add_queue(()=>{
        console.log("5")
    })
}

var count = 0;
create_requests()
var int = setInterval(() => {
    count++;
    create_requests()
    if (count > 5) clearInterval(int);
}, 1000);

