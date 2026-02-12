import { useRef } from "react";

type noop = (...args: any[]) => any;

/**
 * A stable-reference callback that always calls the latest closure,
 * avoiding the need for useCallback dependency arrays.
 */
export function usePersistFn<T extends noop>(fn: T) {
  const fnRef = useRef<T>(fn);
  fnRef.current = fn;

  const persistFn = useRef<T>(null);
  if (!persistFn.current) {
    persistFn.current = function (this: unknown, ...args) {
      return fnRef.current!.apply(this, args);
    } as T;
  }

  return persistFn.current!;
}
