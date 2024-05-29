import { MutableRefObject, useEffect } from "react";
import { bug } from "./err";

/**
 * A switch-case-like expression with exhaustiveness check (or fallback value).
 * A bit like Rust's `match`, but worse.
 *
 * If the `fallback` is not given, the given match arms need to be exhaustive.
 * This helps a lot with maintanence as adding a new variant to a union type
 * will throw compile errors in all places that likely need adjustment. You can
 * also pass a fallback (default) value as third parameter, disabling the
 * exhaustiveness check.
 *
 * ```
 * type Animal = "dog" | "cat" | "fox";
 *
 * const animal = "fox" as Animal;
 * const awesomeness = match(animal, {
 *     "dog": () => 7,
 *     "cat": () => 6,
 *     "fox": () => 100,
 * });
 * ```
 */
export function match<T extends string | number, Out>(
  value: T,
  arms: Record<T, () => Out>,
): Out;
export function match<T extends string | number, Out>(
  value: T,
  arms: Partial<Record<T, () => Out>>,
  fallback: () => Out,
): Out;
export function match<T extends string | number, Out>(
  value: T,
  arms: Partial<Record<T, () => Out>>,
  fallback?: () => Out,
): Out {
  return fallback === undefined
    // Unfortunately, we haven't found a way to make the TS typesystem to
    // understand that in the case of `fallback === undefined`, `arms` is
    // not a partial map. But it is, as you can see from the two callable
    // signatures above.
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    ? arms[value]!()
    : (arms[value] as (() => Out) | undefined ?? fallback)();
}


/** CSS Media query for screens with widths ≤ `w` */
export const screenWidthAtMost = (w: number) => `@media (max-width: ${w}px)`;

/** CSS Media query for screens with widths > `w` */
export const screenWidthAbove = (w: number) => `@media not all and (max-width: ${w}px)`;

/** Helper to react to clicks outside of the DOM element referred to by `ref`. */
export const useOnOutsideClick = (
  ref: MutableRefObject<Node | null>,
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
export const currentRef = <T, >(ref: React.RefObject<T>): T => (
  ref.current ?? bug("ref unexpectedly unbound")
);
