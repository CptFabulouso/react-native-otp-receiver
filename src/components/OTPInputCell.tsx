import type { TextInputProps } from 'react-native';
import { TextInput, Platform } from 'react-native';
import { useOTPInputCell } from '../hooks';

export type OTPInputProps = {
  /** Index of the cell component */
  index: number;
};

type Props = Omit<TextInputProps, 'onFocus' | 'onBlur'> & OTPInputProps;

export default function OTPInput({ index, ...props }: Props) {
  const inputHandles = useOTPInputCell({
    index,
  });

  return (
    <TextInput
      autoComplete={Platform.OS === 'ios' ? 'one-time-code' : 'sms-otp'}
      {...inputHandles}
      {...props}
    />
  );
}
