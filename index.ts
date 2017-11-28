import * as fetch from 'node-fetch-polyfill'
import * as Rx from 'rxjs/Rx'
import * as tty from 'tty'

var stdin = process.stdin;
stdin.resume();
stdin.setEncoding( 'utf8' );

// on any data into stdin
const inputStream = Rx.Observable.fromEvent(stdin, 'data')

const startingReqStream = Rx.Observable.of('https://api.github.com/users')

var interactiveReqStream = inputStream
  .map(function() {
    var randomOffset = Math.floor(Math.random()*500)
    return 'https://api.github.com/users?since=' + randomOffset
  })

const requestStream = Rx.Observable.merge(startingReqStream, interactiveReqStream)

var responseStream = requestStream.flatMap(url => {
    const textedResponse = fetch(url).then(res => res.text())
    return Rx.Observable.fromPromise(textedResponse)
}).subscribe(response => {
    console.log(response)
})

