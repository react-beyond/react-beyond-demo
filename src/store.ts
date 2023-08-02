import { makeAutoObservable } from 'mobx'
import { ReplaySubject, Subject, map, scan, startWith } from 'rxjs'

export const store = makeAutoObservable({
  _counter: 0,

  get counter() {
    return this._counter
  },
  set counter(value) {
    this._counter = value
  },
  get double() {
    return this._counter * 2
  }
})

export const counterSubject = new ReplaySubject()
export const counter$ = counterSubject.pipe(
  scan((count, value) => count + 1, 0),
  startWith(0)
)
