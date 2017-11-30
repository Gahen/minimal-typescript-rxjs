import * as fetch from 'node-fetch-polyfill'
import * as Rx from 'rxjs/Rx'
import * as tty from 'tty'

var stdin = process.stdin;
stdin.resume();
stdin.setEncoding( 'utf8' );

const getRand = listUsers => listUsers[Math.floor(Math.random()*listUsers.length)]

// on any data into stdin
const inputStream: Rx.Observable<string> = Rx.Observable.fromEvent(stdin, 'data')

const inputStream1Close = inputStream.filter(r => r.indexOf('x1') !== -1)
const inputStream2Close = inputStream.filter(r => r.indexOf('x2') !== -1)
const inputStream3Close = inputStream.filter(r => r.indexOf('x3') !== -1)
const inputStreamRefresh = inputStream.filter(r => r.indexOf('x') === -1)

// inputStreamRefresh.subscribe(() => console.log('refreshing!'))
// inputStream.subscribe(() => console.log('input detected!'))

const username = process.argv[2]
const pass = process.argv[3]

var interactiveReqStream = inputStreamRefresh
  .startWith('startup click')
  .map(() => {
    var randomOffset = Math.floor(Math.random()*500)
    return `https://${username}:${pass}@api.github.com/users?since=${randomOffset}`
  })

var responseStream: Rx.Observable<any[]> = interactiveReqStream.flatMap(url => {
    const jsonResponse = fetch(url).then(res => res.json())
    return Rx.Observable.fromPromise(jsonResponse)
})

var suggestion1Stream = inputStream1Close
.startWith('startup click')
.combineLatest(responseStream, (click, listUsers) => getRand(listUsers))
.merge(interactiveReqStream.map(() => null))
// .startWith(null)
.subscribe(r => console.log('stream 1', r))

var suggestion2Stream = inputStream2Close
.startWith('startup click')
.combineLatest(responseStream, (click, listUsers) => getRand(listUsers))
.merge(interactiveReqStream.map(() => null))
// .startWith(null)
.subscribe(r => console.log('stream 2', r))

var suggestion3Stream = inputStream3Close
.startWith('startup click')
.combineLatest(responseStream, (click, listUsers) => getRand(listUsers))
.merge(interactiveReqStream.map(() => null))
// .startWith(null)
.subscribe(r => console.log('stream 3', r))

