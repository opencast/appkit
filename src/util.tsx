import { RefObject, useEffect } from "react";
import { bug } from "./err";

/**
 * A switch-case-like expression with exhaustiveness check. A bit like Rust's
 * `match`, but worse.
 *
 * If the given match arms are exhaustive, `Out` is returned. If they are not,
 * `Out | null` is returned, which you need to deal with explicitly. This helps
 * a lot with maintanence as adding a new variant to a union type will throw
 * compile errors in all places that likely need adjustment.
 *
 * ```
 * type Animal = "dog" | "cat" | "fox";
 *
 * const animal = "fox" as Animal;
 * const awesomeness: number = match(animal, {
 *     "dog": () => 7,
 *     "cat": () => 6,
 *     "fox": () => 100,
 * });
 *
 * const maybe: number | null = match(animal, {
 *     "fox": () => 100,
 * });
 * ```
 */
export function match<T extends string | number, Arms extends T, Out>(
  value: T,
  arms: Record<Arms, () => Out>,
): Exclude<T, Arms> extends never ? Out : (Out | null) {
  return value in arms
    ? (arms as Record<T, () => Out>)[value]()
    // This cast is unfortunately necessary
    : null as Exclude<T, Arms> extends never ? Out : (Out | null);
}

// Some tests for `match`
const _dummy0 = () => {
  type Animal = "cat" | "dog" | "fox";
  type SmallNumber = 1 | 2 | 3;

  // No errors
  const _a: number = match("cat" as Animal, { cat: () => 1, dog: () => 2, fox: () => 3 });
  const _b: number | null = match("cat" as Animal, { cat: () => 1, dog: () => 2 });
  const _c: number | null = match("foo" as string, { foo: () => 1, bar: () => 2 });
  const _d: number | null = match("foo" as string, { bar: () => 2 });
  const _e: string = match(1 as SmallNumber, { 1: () => "a", 2: () => "b", 3: () => "c" });
  const _f: string | null = match(1 as SmallNumber, { 1: () => "a", 2: () => "b" });
  const _g: string | null = match(1 as number, { 1: () => "a", 2: () => "b" });

  // Should cause compile errors
  // @ts-expect-error: is nullable
  const _z: number = match("cat" as Animal, { cat: () => 1, dog: () => 2 });
  // @ts-expect-error: is nullable
  const _y: number = match("foo" as string, { foo: () => 1, bar: () => 2 });
  // @ts-expect-error: an arm is not part of the tag type
  const _x: number = match("cat" as Animal, { cat: () => 1, red: () => 2 });
  // @ts-expect-error: is nullable
  const _w: string = match(1 as SmallNumber, { 1: () => "a", 2: () => "b" });
  // @ts-expect-error: is nullable
  const _v: string = match(1 as number, { 1: () => "a", 2: () => "b" });
};

/**
* Similar to `match` for when you need to narrow a type depending on a tag.
*
* In the following example, you can see that we can access `age` and `name`,
* as if we used `if`, for example. Unlike `match`, this fails to compile if
* the given match arms do not cover all possibilities.
*
* ```
* type Foo = { kind: "foo", age: number }
*   | { kind: "bar", name: string };
*
* const obj = { kind: "foo", age: 13 } as Foo;
* const out = matchTag(obj, "kind", {
*     foo: o => o.age,
*     bar: o => o.name.length,
* });
* ```
*/
export function matchTag<
  T extends string | number,
  Tag extends string,
  Obj extends Record<Tag, T>,
  Out,
>(
  obj: Obj,
  tag: Tag,
  arms: { [Key in T]: (value: Extract<Obj, Record<Tag, Key>>) => Out },
): Out {
  // Unfortunately, I haven't figured out how to make TypeScript understand that
  // this is safe.
  // eslint-disable-next-line
  return arms[obj[tag]](obj as any);
}

// Some tests for `matchTag`
const _dummy1 = () => {
  type Foo = { kind: "foo", age: number }
    | { kind: "bar", name: string };

  const obj = { kind: "foo", age: 13 } as Foo;
  const _n: number = matchTag(obj, "kind", {
    foo: o => o.age,
    bar: o => o.name.length,
  });


  // Should cause compile errors
  // @ts-expect-error: missing arms
  // eslint-disable-next-line
  matchTag(obj, "kind", { foo: o => o.age });
  // @ts-expect-error: wrong tag
  // eslint-disable-next-line
  matchTag(obj, "blub", { foo: o => o.age, bar: o => o.name.length });

  type Stringy = { kind: string, name: string };
  const s = { kind: "foo", name: "Peter" } as Stringy;
  // @ts-expect-error: incomplete arms for string tag
  matchTag(s, "kind", { foo: () => true });
};


/** CSS Media query for screens with widths ≤ `w` */
export const screenWidthAtMost = (w: number) => `@media (max-width: ${w}px)`;

/** CSS Media query for screens with widths > `w` */
export const screenWidthAbove = (w: number) => `@media not all and (max-width: ${w}px)`;

/** Helper to react to clicks outside of the DOM element referred to by `ref`. */
export const useOnOutsideClick = (
  ref: RefObject<Node | null>,
  callback: () => void,
): void => {
  useEffect(() => {
    const handler = (event: MouseEvent) => {
      const target = event.target;
      if (ref.current && target instanceof Element && !ref.current.contains(target)) {
        callback();
      }
    };

    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  });
};

/**
 * Accesses the current value of a ref, signaling an error when it is unbound.
 * Note: **Don't** use this if you expect the ref to be unbound temporarily.
 * This is mainly for accessing refs in event handlers for elements
 * that are guaranteed to be alive as long as the ref itself.
 */
export const currentRef = <T, >(ref: React.RefObject<T | null>): T => (
  ref.current ?? bug("ref unexpectedly unbound")
);
