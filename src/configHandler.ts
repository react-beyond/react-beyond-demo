/* eslint-disable */
type ANY = any

export type PathImpl<T, K extends keyof T> = K extends string
  ? T[K] extends Record<string, any>
    ? T[K] extends ArrayLike<any>
      ?
          | K
          | `${K}.${PathImpl<T[K], Exclude<keyof T[K], keyof ANY[]>>}`
          | `${K}[]${'.'}${PathImpl<T[K][number], keyof T[K][number]>}`
      : K | `${K}.${PathImpl<T[K], keyof T[K]>}`
    : K
  : never

export type PathArray<T, K extends keyof T> = K extends string
  ? T[K] extends ArrayLike<infer U>
    ?
        | `${K}[]`
        | `${K}.${PathImpl<T[K], keyof T[K]>}`
        | `${K}[]${'.'}${PathImpl<U, keyof U>}`
    : never
  : never

export type Path<T> = PathImpl<T, keyof T> | PathArray<T, keyof T> | keyof T

export type PathValue<
  T,
  P extends Path<T>
> = P extends `${infer K}.${infer Rest}`
  ? K extends `${infer BaseKey}[]`
    ? BaseKey extends keyof T
      ? T[BaseKey] extends ArrayLike<infer Item>
        ? Rest extends Path<Item>
          ? PathValue<Item, Rest>
          : never
        : never
      : never
    : K extends keyof T
    ? Rest extends Path<T[K]>
      ? PathValue<T[K], Rest>
      : never
    : never
  : P extends `${infer K}[]`
  ? K extends keyof T
    ? T[K] extends ArrayLike<infer Item>
      ? Item
      : never
    : never
  : P extends keyof T
  ? T[P]
  : never

export type PathParent<
  T,
  P extends Path<T>
> = P extends `${infer K}.${infer Rest}`
  ? K extends `${infer BaseKey}[]`
    ? BaseKey extends keyof T
      ? T[BaseKey] extends ArrayLike<infer Item>
        ? Rest extends Path<Item>
          ? PathParent<Item, Rest>
          : T[BaseKey]
        : never
      : never
    : K extends keyof T
    ? Rest extends Path<T[K]>
      ? PathParent<T[K], Rest>
      : T[K]
    : never
  : P extends `${infer K}[]`
  ? K extends keyof T
    ? T[K]
    : never
  : T

////////////////////////////////////////////////

type Assign<
  T,
  Path extends string,
  V
> = Path extends `${infer Start}.${infer Rest}`
  ? Start extends keyof T
    ? { [K in keyof T]: K extends Start ? Assign<T[K], Rest, V> : T[K] }
    : T
  : Path extends keyof T
  ? { [K in keyof T]: K extends Path ? V : T[K] }
  : T

////////////////////////////////////////////////

type PathPrefix = 'path:'
type PrefixedPath<T> = `${PathPrefix}${Path<T>}`

type StripPrefix<T extends string> = T extends `${PathPrefix}${infer U}`
  ? U
  : never

// type Split<S extends string, D extends string> = string extends S
//   ? string[]
//   : S extends `${infer T}${D}${infer Rem}`
//   ? [T, ...Split<Rem, D>]
//   : [S]

type Last<T extends any[]> = T extends [...any[], infer L] ? L : never

export type LastKey<P extends string> = Last<Split<P, '.'>>

/////////////////////

type ReturnTypes<T, Rules extends any[]> = {
  [K in keyof Rules]: Rules[K] extends [
    PrefixedPath<infer U>,
    (...args: any) => infer V
  ]
    ? U extends T
      ? V extends any
        ? U extends `${infer Path}.${infer _}`
          ? Path extends keyof T
            ? { [P in Path]: V }
            : never
          : U extends keyof T
          ? { [P in U]: V }
          : never
        : never
      : never
    : never
}

type Merge<T extends any[]> = T[number]

type Join<T extends string[], D extends string> = T extends []
  ? never
  : T extends [infer F]
  ? F
  : T extends [infer F, ...infer R]
  ? `${F & string}${D}${Join<R & string[], D>}`
  : string

type Split<
  S extends string,
  D extends string
> = S extends `${infer T}${D}${infer Rem}` ? [T, ...Split<Rem, D>] : [S]

type Pop<T extends any[]> = T extends [...infer L, any] ? L : never

type Push<T extends any[], V> = [...T, V]

type Update<T, P extends any[], V> = P extends [infer F, ...infer R]
  ? F extends keyof T
    ? R extends [any, ...any]
      ? { [K in keyof T]: K extends F ? Update<T[K], R, V> : T[K] }
      : { [K in keyof T]: K extends F ? V : T[K] }
    : T
  : T

type TestUpdate = Update<{ a: { b: { c: string } } }, ['a', 'b', 'c'], number>

class ConfigHandler<T> {
  constructor(private config: T) {}

  select<P extends Path<T>, R>(
    path: P,
    fn: (value: PathValue<T, P>, parent: Parent<T, P>, key: keyof any) => R
  ): ConfigHandler<Update<T, Split<P, '.'>, R>> {
    const updatedConfig = handleConfig(this.config, [path, fn])
    return new ConfigHandler(updatedConfig)
  }
}

function handleConfig<T>(config: T): ConfigHandler<T> {
  return new ConfigHandler(config)
}

const table = {
  foo: {
    bar: {
      baz: 1
    }
  },
  rows: [
    {
      abc: {
        source: 'abc'
      }
    }
  ]
}

const result = handleConfig(
  table,
  ['foo.bar', function (value, parent, key) {
      return { c: 'hello' }
  }],
  [() => 'foo.bar.c', function (value, parent, key) {}]
)

// const result = handleConfig(table)
//   .select('foo.bar', function (value, parent, key) {
//     return { c: 'hello' }
//   })
//   .select('foo.bar.c', function (value, parent, key) {
//     // value should be string
//   })

/////////
