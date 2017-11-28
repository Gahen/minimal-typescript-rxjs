import * as fetch from 'node-fetch-polyfill'
import * as Rx from 'rxjs/Rx'
import * as tty from 'tty'

var stdin = process.stdin;
stdin.resume();
stdin.setEncoding( 'utf8' );

// on any data into stdin
const inputStream = Rx.Observable.fromEvent(stdin, 'data')

const inputStreamClose = inputStream.filter(r => r === 'x')
const inputStreamElse = inputStream.filter(r => r !== 'x')

var interactiveReqStream = inputStreamElse
  .startWith('startup click')
  .map(() => {
    var randomOffset = Math.floor(Math.random()*500)
    return 'https://api.github.com/users?since=' + randomOffset
  })

var responseStream: Rx.Observable<any[]> = interactiveReqStream.flatMap(url => {
    const jsonResponse = fetch(url).then(res => res.json())
    return Rx.Observable.fromPromise(jsonResponse)
})

var suggestion1Stream = responseStream.map(listUsers => {
    return listUsers[Math.floor(Math.random()*listUsers.length)]
})
.merge(interactiveReqStream.map(() => null))
.subscribe(r => console.log('stream 1', r))

var suggestion2Stream = responseStream.map(listUsers => {
    return listUsers[Math.floor(Math.random()*listUsers.length)]
})
.merge(interactiveReqStream.map(() => null))
.subscribe(r => console.log('stream 2', r))

var suggestion3Stream = responseStream.map(listUsers => {
    return listUsers[Math.floor(Math.random()*listUsers.length)]
})
.merge(interactiveReqStream.map(() => null))
.subscribe(r => console.log('stream 3', r))
