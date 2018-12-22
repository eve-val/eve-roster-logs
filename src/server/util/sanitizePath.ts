import * as path from 'path';

export function sanitizePath(unsafePath: string) {
  const normalized = path.normalize(unsafePath);
  if (WINDOWS_RESERVED_NAMES_PATTERN.test(normalized)
      || BAD_CHARS_PATTERN.test(normalized)) {
    return null;
  }
  return normalized.replace(/\/+$/, '');
}

// Overly conservative. Fix this if it becomes a problem.
const BAD_CHARS_PATTERN = /[^a-zA-Z0-9/.\-_]|\.\./;

const WINDOWS_RESERVED_NAMES_PATTERN =
    /(^|\/)CON|PRN|AUX|NUL|COM1|COM2|COM3|COM4|COM5|COM6|COM7|COM8|COM9|LPT1|LPT2|LPT3|LPT4|LPT5|LPT6|LPT7|LPT8|LPT9($|\/)/gi;
