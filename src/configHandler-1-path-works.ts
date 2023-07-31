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

type Split<S extends string, D extends string> = string extends S
  ? string[]
  : S extends `${infer T}${D}${infer Rem}`
  ? [T, ...Split<Rem, D>]
  : [S]

type Last<T extends any[]> = T extends [...any[], infer L] ? L : never

export type LastKey<P extends string> = Last<Split<P, '.'>>

// prettier-ignore
interface HandleConfig {
  <T, P1 extends PrefixedPath<T>, P2 extends PrefixedPath<T>>(
    table: T,
    rule1: [P1, (value: PathValue<T, StripPrefix<P1>>, parent: PathParent<T, StripPrefix<P1>>, key: LastKey<StripPrefix<P1>>) => void],
    rule2: [P2, (value: PathValue<T, StripPrefix<P2>>, parent: PathParent<T, StripPrefix<P2>>, key: LastKey<StripPrefix<P2>>) => void]
  ): void;
  <T, P1 extends PrefixedPath<T>>(
    table: T,
    rule1: [P1, (value: PathValue<T, StripPrefix<P1>>, parent: PathParent<T, StripPrefix<P1>>, key: LastKey<StripPrefix<P1>>) => void]
  ): void;
}

const handleConfig = ((table, rules) => {}) as unknown as HandleConfig

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

handleConfig(
  table,
  [
    'path:foo.bar',
    function (value, parent, key) {
      return 'what'
    }
  ],
  ['path:rows[].abc', function (value, parent, key) {}]
)
