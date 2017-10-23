var  Rx = require( 'rxjs/Rx' );

// var s = "Hallo"
// var o = Rx.Observable.of(s);

// for (var i = 0;i<10;i++) {
//     s = i;
// }

// o.subscribe(result => {
//     console.log(result);
// })

// var myObservableOne = Rx.Observable.create(observer => {
//     setTimeout(() => {
//         observer.next("Start");
//     }, 5000);
// })


var message = "Hallo"
var myObservable = Rx.Observable.create(observer => {
    var i = 0;
    observer.next('foo');
    setInterval(() => {
        i = i + 1;
        observer.next({ number: i, text: message })
    }, 1000);
  });

//   myObservableOne
//   .map(value1 => {
//       value1= value1.toUpperCase();
//       myObservable.subscribe(value => console.log("myObservable", value));
//     })
//   .subscribe(value => console.log(value));

// //   myObservableOne
// //   .subscribe(value => console.log(value));
  






//example promise that will resolve or reject based on input
const myPromise = (willReject) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            if (willReject) {
                reject('Rejected!');
            }
            resolve('Resolved!');
        }, 5000);
    })
}
//emit true, then false
const source = Rx.Observable.of(true, false);
const example = myObservable
    .mergeMap(val => Rx.Observable
        //turn promise into observable
        .fromPromise(myPromise(val))
        //catch and gracefully handle rejections
        .catch(error => Rx.Observable.of(`Error: ${error}`))
    )
//output: 'Error: Rejected!', 'Resolved!'
const subscribe = example.subscribe(val => console.log(val));
