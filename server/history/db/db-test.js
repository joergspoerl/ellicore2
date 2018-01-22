db = require("./db")

//console.log("db", db)

db.history.iter_timer (1, (timer) => {
    console.log("timer:", timer)

    db.history.iter_source (timer.id, (source) => {
        console.log("source:", source)
    })
    
})

db.history.showTableSize().then(
    (data) => {
        console.log("data:", data)
    },
    (error) => {
        console.log("error:", error)        
    } 
)

// db.history.calc_level1().then(
//     (data) => {
//         console.log("data:", data)
//     },
//     (error) => {
//         console.log("error:", error)        
//     } 
// )

db.history.get(0,3,10).then(
    (data) => {
        console.log("data:", data)
    },
    (error) => {
        console.log("error:", error)        
    } 
)
