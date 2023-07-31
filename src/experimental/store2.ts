// type GetFunction<T> = <K extends keyof T>(path: K) => T[K]

// type Store<T> = {
//   [K in keyof T]: T[K] extends (get: GetFunction<infer S>) => infer R ? R : T[K]
// }

// type StateFactory<T, S extends Store<T>> = {
//   [K in keyof T]: T[K] | ((get: GetFunction<S>) => Store<S>[K])
// }

// declare function createStore<T, S extends Store<T>>(state: StateFactory<T, S>): S

// const store = createStore({
//   first: 6,
//   last: '',
//   obj: {
//     a: 1
//   },
//   fullName: (get) => get('first') + get('last')
// })

// const str: string = store.fullName // string
