import * as fetch from 'node-fetch-polyfill'
import * as Rx from 'rxjs/Rx'

const req = Rx.Observable.of('https://api.github.com/users')

req.subscribe(url => {
    var res = Rx.Observable.create(observer => {
        fetch(url)
            .then(res => res.text())
            .then(res => observer.next(res))
            .catch(err => observer.error(err))
    })

    res.subscribe(response => {
        console.log(response)
    })
})
