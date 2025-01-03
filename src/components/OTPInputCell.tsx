import { useCallback, useMemo, useRef } from 'react';
import type {
  TextInputProps,
  NativeSyntheticEvent,
  TextInputKeyPressEventData,
} from 'react-native';
import { TextInput, Platform } from 'react-native';
import { getPastedText } from '../helpers';
import {
  useOTPContextSelect,
  useOTPInputContext,
  useOTPInputContextSelect,
} from './OTPProvider';

export type OTPInputProps = {
  index: number;
};

type Props = Omit<TextInputProps, 'onFocus' | 'onBlur'> & OTPInputProps;

function useOTPInputCell({ index }: { index: number }) {
  const { onValueChange, onValuePasted, onBlur, onFocus, captureRef } =
    useOTPInputContext();
  const codeValue = useOTPContextSelect((v) => v.codeValue);
  const codeInputShape = useOTPContextSelect((v) => v.codeInputs);

  const fullCodeLength = useMemo(() => {
    return codeInputShape.reduce((acc, val) => acc + val, 0);
  }, [codeInputShape]);

  const value = codeValue[index] || '';
  const currentValue = useRef(value);
  currentValue.current = value;

  const handleKeyPress = ({
    nativeEvent,
  }: NativeSyntheticEvent<TextInputKeyPressEventData>) => {
    // use last entered character
    onValueChange?.(nativeEvent.key, index);
  };

  const handleFocus = useCallback(() => {
    onFocus(index);
  }, [index, onFocus]);

  const handleChangeText = useCallback(
    (changedValue: string) => {
      // handle user pasting copied text into the text input (or suggested by the system)
      if (!changedValue || changedValue.length < fullCodeLength) {
        return;
      }
      const passedText = getPastedText(currentValue.current, changedValue);
      if (passedText) {
        onValuePasted(passedText);
      }
    },
    [onValuePasted, fullCodeLength]
  );

  const ref = useCallback(
    (_ref: TextInput | null) => {
      captureRef(index, _ref);
    },
    [captureRef, index]
  );

  return {
    onKeyPress: handleKeyPress,
    onFocus: handleFocus,
    onBlur,
    onChangeText: handleChangeText,
    ref,
    value,
  };
}

export function useOTPInputCellState(index: number) {
  const focusedIndex = useOTPContextSelect((v) => v.focusedIndex);
  const getRef = useOTPInputContextSelect((v) => v.getRef);
  const codeValue = useOTPContextSelect((v) => v.codeValue);

  const _getRef = useCallback(() => {
    return getRef(index);
  }, [getRef, index]);

  return {
    isFocused: focusedIndex === index,
    getRef: _getRef,
    value: codeValue[index] || '',
  };
}

export default function OTPInput({ index, ...props }: Props) {
  const currentValue = useRef(props.value);
  currentValue.current = props.value;

  const inputHandles = useOTPInputCell({
    index,
  });

  return (
    <TextInput
      autoComplete={Platform.OS === 'ios' ? 'one-time-code' : 'sms-otp'}
      {...props}
      {...inputHandles}
    />
  );
}
