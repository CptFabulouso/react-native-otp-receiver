import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { runCodeCharValidator } from '../helpers';
import type {
  CodeCharValidator,
  CodeInputOrigin,
  OnCodeEnteredData,
  OnSubmitCodeData,
} from '../types';

function stringValueToArray(
  value: string,
  codeInputShape: number[],
  validator?: CodeCharValidator
) {
  let startIndex = 0;
  return codeInputShape.map((length) => {
    const val = value.substring(startIndex, startIndex + length);
    startIndex += length;
    if (val.split('').every((char) => runCodeCharValidator(char, validator))) {
      return val;
    }
    return '';
  });
}

export function useOTPInput({
  value,
  codeInputShape,
  automaticallySubmit = true,
  handleSubmitCode,
  handleCodeEntered,
  parseEnteredCodeChar,
  validateCodeChar,
}: {
  codeInputShape: number[];
  value?: string;
  automaticallySubmit?: boolean;
  handleCodeEntered?: (data: OnCodeEnteredData) => void;
  handleSubmitCode?: (data: OnSubmitCodeData) => void;
  parseEnteredCodeChar?: (code: string) => string;
  validateCodeChar?: CodeCharValidator;
}) {
  const [codeValue, setCodeValue] = useState<string[]>(
    stringValueToArray(value || '', codeInputShape, validateCodeChar)
  );
  const codeValueRef = useRef<string[]>(codeValue);

  const _setCodeValue = useCallback(
    (code: string) => {
      codeValueRef.current = stringValueToArray(
        code || '',
        codeInputShape,
        validateCodeChar
      );
      setCodeValue(codeValueRef.current);
    },
    [codeInputShape, validateCodeChar]
  );

  useEffect(() => {
    _setCodeValue(value || '');
  }, [_setCodeValue, value]);

  const isCodeValid = useCallback(
    (code: string | string[]) => {
      if (typeof code === 'string') {
        code = stringValueToArray(code, codeInputShape, validateCodeChar);
      }
      return code.every((val, index) => {
        if (val.length !== codeInputShape[index]) {
          return false;
        }
        return val
          .split('')
          .every((char) => runCodeCharValidator(char, validateCodeChar));
      });
    },
    [codeInputShape, validateCodeChar]
  );

  const submitCode = useCallback(
    (origin: CodeInputOrigin) => {
      const code = codeValueRef.current;
      const isValid = isCodeValid(code);
      handleSubmitCode?.({ isValid, code: code.join(''), origin });
    },
    [handleSubmitCode, isCodeValid]
  );

  const onValueChange = useCallback(
    (key: string, index: number) => {
      // update code value
      const cellLength = codeInputShape[index];
      const nextCodeValue = [...codeValueRef.current];
      let nextCellValue = nextCodeValue[index] || '';
      if (key === 'Backspace') {
        nextCellValue = nextCellValue.slice(0, -1);
      } else {
        const parsedKey = parseEnteredCodeChar?.(key) || key;
        nextCellValue =
          nextCellValue?.length === cellLength
            ? parsedKey
            : nextCellValue + parsedKey;
      }

      nextCodeValue[index] = nextCellValue;
      codeValueRef.current = nextCodeValue;
      setCodeValue(codeValueRef.current);

      let nextIndex: number | null = null;
      if (key === 'Backspace' && nextCellValue.length === 0) {
        nextIndex = index - 1;
      } else if (nextCellValue.length === cellLength) {
        nextIndex = index + 1;
      }
      if (nextIndex === codeInputShape.length && isCodeValid(nextCodeValue)) {
        handleCodeEntered?.({
          code: codeValueRef.current.join(''),
          origin: 'manual',
        });
        if (automaticallySubmit) {
          submitCode('manual');
        }
      }
      return nextIndex;
    },
    [
      codeInputShape,
      isCodeValid,
      parseEnteredCodeChar,
      handleCodeEntered,
      automaticallySubmit,
      submitCode,
    ]
  );

  const codeIsValid = useMemo(() => {
    return codeValue.every((val) => val.length > 0);
  }, [codeValue]);

  return {
    codeValue,
    isValid: codeIsValid,
    submitCode,
    isCodeValid,
    onValueChange,
    setCodeValue: _setCodeValue,
  };
}
