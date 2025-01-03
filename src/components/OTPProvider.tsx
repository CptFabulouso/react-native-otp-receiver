import { createContext, useContextSelector } from 'use-context-selector';
import {
  type ReactNode,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import { useOTPInput } from '../hooks';
import type { TextInput } from 'react-native';
import { onSMSReceived, expectSMSWithOTP } from '../modules/OtpReceiver';
import { runCodeCharValidator } from '../helpers';
import type {
  CodeCharValidator,
  OnCodeEnteredData,
  OnSubmitCodeData,
} from '../types';

export type OTPInputContextValue = {
  onValueChange: (key: string, index: number) => void;
  onValuePasted: (value: string) => void;
  onFocus: (index: number) => void;
  onBlur: () => void;
  captureRef: (index: number, ref: TextInput | null) => void;
  getRef: (index: number) => TextInput | null;
};

const OTPInputContext = createContext<OTPInputContextValue>({
  onValueChange: () => {},
  onValuePasted: () => {},
  onFocus: () => {},
  onBlur: () => {},
  captureRef: () => {},
  getRef: () => null,
});

export type OTPContext = {
  focusedIndex: number | null;
  codeValue: string[];
  isCodeValid: boolean;
  codeInputs: number[];
  submitCode: () => void;
};
const Context = createContext<OTPContext>({
  focusedIndex: null,
  codeValue: [],
  isCodeValid: false,
  codeInputs: [],
  submitCode: () => {},
});

type Props = {
  codeInputShape: number[];
  children?: ReactNode;
  onCodeEntered?: (data: OnCodeEnteredData) => void;
  onSubmitCode?: (data: OnSubmitCodeData) => void;
  onSMSError?: (error: string) => void;
  parseSMS?: (sms: string) => string | null | undefined;
  parseEnteredCodeChar?: (char: string) => string;
  parsePastedCode?: (code: string, codeInputShape: number[]) => string[];
  validateCodeChar?: CodeCharValidator;
  value?: string;
  expectSMSOnMount?: boolean;
};

export const useOTPContextSelect = <T,>(selector: (v: OTPContext) => T) =>
  useContextSelector(Context, selector);

export const useOTPInputContextSelect = <T,>(
  selector: (v: OTPInputContextValue) => T
) => useContextSelector(OTPInputContext, selector);

export const useOTPContext = () => useOTPContextSelect((v) => v);
export const useOTPInputContext = () => useOTPInputContextSelect((v) => v);

const defaultPasteParser = (value: string, codeInputShape: number[]) => {
  let startIndex = 0;
  return codeInputShape.map((length) => {
    const val = value ? value.substring(startIndex, startIndex + length) : '';
    startIndex += length;
    return val;
  });
};

export default function OTPProvider({
  codeInputShape,
  onCodeEntered,
  onSubmitCode,
  parseSMS,
  children,
  value,
  expectSMSOnMount,
  parseEnteredCodeChar,
  validateCodeChar,
  onSMSError,
  parsePastedCode = defaultPasteParser,
}: Props) {
  const {
    codeValue,
    submitCode,
    isCodeValid,
    setCodeValue,
    onValueChange,
    isValid,
  } = useOTPInput({
    codeInputShape,
    value,
    handleCodeEntered: onCodeEntered,
    handleSubmitCode: onSubmitCode,
    parseEnteredCodeChar,
    validateCodeChar,
  });
  const [focusedIndex, setFocusedIndex] = useState<number | null>(null);
  const refs = useRef<Record<number, TextInput | null>>({});

  useEffect(() => {
    const listener = onSMSReceived((sms) => {
      if (sms.error) {
        onSMSError?.(sms.error);
        return;
      }
      const code = parseSMS?.(sms.message || '');
      if (code) {
        setCodeValue(code);
        onCodeEntered?.({ code, origin: 'sms' });
        submitCode('sms');
      }
    });
    return () => {
      listener.remove();
    };
  }, [parseSMS, submitCode, setCodeValue, onCodeEntered, onSMSError]);

  useEffect(() => {
    if (expectSMSOnMount) {
      expectSMSWithOTP();
    }
  }, [expectSMSOnMount]);

  const onFocus = useCallback((index: number) => {
    setFocusedIndex(index);
  }, []);

  const onBlur = useCallback(() => {
    setFocusedIndex(null);
  }, []);

  const captureRef = useCallback((index: number, ref: TextInput | null) => {
    if (ref) {
      refs.current[index] = ref;
    }
  }, []);

  const getRef = useCallback((index: number) => {
    return refs.current[index] || null;
  }, []);

  const focusInputAtIndex = useCallback((index: number) => {
    const inputRef = refs.current[index];
    inputRef?.focus();
  }, []);

  const blurInputAtIndex = useCallback((index: number) => {
    const inputRef = refs.current[index];
    inputRef?.blur();
  }, []);

  const handleValueChange = useCallback(
    (key: string, index: number) => {
      const isLegitChar = runCodeCharValidator(key, validateCodeChar);
      if (!isLegitChar) {
        return;
      }
      const nextIndex = onValueChange(key, index);
      // focus next or prev input or submit
      if (nextIndex === null) {
        // do nothing
      } else if (nextIndex === codeInputShape.length) {
        blurInputAtIndex(codeInputShape.length - 1);
      } else if (nextIndex >= 0) {
        focusInputAtIndex(nextIndex);
      }
    },
    [
      validateCodeChar,
      onValueChange,
      codeInputShape.length,
      blurInputAtIndex,
      focusInputAtIndex,
    ]
  );

  const handleTextPasted = useCallback(
    (passedValue: string) => {
      const parsed = parsePastedCode(passedValue, codeInputShape);
      if (isCodeValid(parsed)) {
        setCodeValue(parsed.join(''));
        onCodeEntered?.({ code: passedValue, origin: 'sms' });
        submitCode('sms');
      }
    },
    [
      codeInputShape,
      isCodeValid,
      onCodeEntered,
      parsePastedCode,
      setCodeValue,
      submitCode,
    ]
  );

  const ctaSubmit = useCallback(() => {
    submitCode('cta');
  }, [submitCode]);

  return (
    <Context.Provider
      value={{
        focusedIndex,
        codeValue,
        isCodeValid: isValid,
        codeInputs: codeInputShape,
        submitCode: ctaSubmit,
      }}
    >
      <OTPInputContext.Provider
        value={{
          onValueChange: handleValueChange,
          onValuePasted: handleTextPasted,
          onFocus,
          onBlur,
          captureRef,
          getRef,
        }}
      >
        {children}
      </OTPInputContext.Provider>
    </Context.Provider>
  );
}
