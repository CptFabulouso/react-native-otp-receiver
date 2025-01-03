export function getPastedText(current: string | undefined, next: string) {
  if (!next || next.length <= 1) {
    return;
  }
  if (!current) {
    return next;
  }
  const startsWith = next.startsWith(current);
  const endsWith = next.endsWith(current);
  if (startsWith && endsWith) {
    // There is no way to be sure which part of the string was really copied, assume it's the end
    return next.substring(current.length);
  } else if (startsWith) {
    return next.substring(current.length);
  } else if (endsWith) {
    return next.substring(0, next.length - current.length);
  } else {
    return next;
  }
}

type CodeCharValidator = RegExp | ((char: string) => boolean);

export function runCodeCharValidator(
  char: string,
  validator?: CodeCharValidator
) {
  if (!validator) {
    return true;
  }
  if (/^Backspace$/.test(char)) {
    return true;
  }
  if (validator instanceof RegExp) {
    return validator.test(char);
  }
  return validator(char);
}
