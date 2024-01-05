
export function isObject(val: unknown): val is Record<string, unknown> {
  return (
    (val !== null)
    && ((typeof val) === 'object')
  );
}

export function isPromise(val: unknown): val is Promise<unknown> {
  if(!isObject(val)) {
    return false;
  }
  if(val instanceof Promise) {
    return true;
  }
  return ((typeof (val as any)?.then) === 'function');
}
