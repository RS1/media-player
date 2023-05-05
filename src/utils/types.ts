/* ┐
   │ File: types.ts [/src/utils/types.ts]
   │ Package: @rs1/media-player | RS1 Project
   │ Author: Andrea Corsini
   │ Created: April 27th, 2023 - 12:08:55
   │ Modified: April 28th, 2023 - 12:14:15
   │ 
   │ Copyright (c) 2023 Andrea Corsini T/A RS1 Project.
   │ This work is licensed under the terms of the MIT License.
   │ For a copy, see https://opensource.org/licenses/MIT
   │ or the LICENSE file in the root of this project.
   └ */

/**
 * Force a particular key to be required in a type
 * @example type Foo = { a?: string, b?: number }
 *          type Bar = WithRequired<Foo, 'a'> // { a: string, b?: number }
 * @see https://stackoverflow.com/a/69328045
 */
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] }

/**
 * Returns all keys of T whose value type extends V
 * @example type Foo = { a: string, b: number, c: string }
 *          type Bar = PickByValue<Foo, string> // { a: string, c: string }
 * @see https://stackoverflow.com/a/55153000
 */
export type PickByValue<T, V> = Pick<T, { [K in keyof T]: T[K] extends V ? K : never }[keyof T]>

export type Entry<T> = [keyof PickByValue<T, T[keyof T]>, T[keyof T]]

/**
 * Get the entries of an object as a tuple, preserving the key and value types
 * @example type Foo = { a: string, b: number, c: string }
 *          type Bar = Entries<Foo> // ['a' | 'c', string] | ['b', number]
 * @see https://stackoverflow.com/a/60142095
 */
export type Entries<T> = {
    [K in keyof T]: [keyof PickByValue<T, T[K]>, T[K]]
}[keyof T][]

/**
 * Make all properties of an object forbidden
 * @example type Foo = { a: string, b: number }
 *          type Bar = Forbidden<Foo> // { a?: never, b?: never }
 * @see https://stackoverflow.com/a/62099607
 */
export type Forbidden<K> = {
    [P in keyof K]: never
}

/**
 * Make all properties not included in the object literal forbidden
 * @example type Foo = { a: string, b: number }
 *          type Bar = NoExtraProperties<Foo>
 *          const x: Bar = { a: 'foo', b: 123 } // OK
 *          const y: Bar = { a: 'foo', b: 123, c: true } // Error
 * @see https://stackoverflow.com/a/62099607
 */
export type ObjectLiteral<T, U extends T = T> = U & Forbidden<Exclude<keyof U, keyof T>>

/**
 * Convert all keys of an object from camelCase to kebab-case
 * @example type Foo = { fooBar: string, baz: number }
 *          type Bar = CamelToKebabCase<Foo> // { 'foo-bar': string, baz: number }
 * @see https://stackoverflow.com/a/65642944
 */
export type CamelToKebabCase<S extends string> = S extends `${infer T}${infer U}`
    ? `${T extends Lowercase<T> | `${number}` ? '' : '-'}${Lowercase<T>}${CamelToKebabCase<U>}`
    : S

/**
 * From T, set to never all keys that are present in U
 * @see https://stackoverflow.com/a/66605669
 */
export type Only<T, U> = {
    [P in keyof T]: T[P]
} & {
    [P in keyof U]?: never
}

/**
 * Extending from Only<T, U>, return a union type where an object can be either T or U
 * @see https://stackoverflow.com/a/66605669
 */
export type Either<T, U> = Only<T, U> | Only<U, T>
