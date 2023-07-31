import { makeAutoObservable } from 'mobx'

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

import { of, Observable } from 'rxjs'

const initialState = {
  counter: 0
}

export const state$ = of(initialState)

console.log(state$)
console.log(state$ instanceof Observable)
state$.subscribe(console.log)
