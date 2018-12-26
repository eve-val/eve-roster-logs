import { nil } from './coreTypes';

export function checkNotNil<T>(value: T | nil) {
  if (value == undefined) {
    throw new Error(`Value cannot be undefined or null.`);
  }
  return value;
}
