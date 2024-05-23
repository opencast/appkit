import React from "react";
import { bug } from ".";

/**
 * Accesses the current value of a ref, signaling an error when it is unbound.
 * Note: **Don't** use this if you expect the ref to be unbound temporarily.
 * This is mainly for accessing refs in event handlers for elements
 * that are guaranteed to be alive as long as the ref itself.
 */
export const currentRef = <T>(ref: React.RefObject<T>): T => (
  ref.current ?? bug("ref unexpectedly unbound")
);
