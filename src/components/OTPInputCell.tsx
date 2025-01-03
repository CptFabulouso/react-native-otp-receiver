import type { TextInputProps } from 'react-native';
import { TextInput, Platform } from 'react-native';
import { useOTPInputCell } from '../hooks';
import { useOTPContextSelect } from './OTPProvider';

export type OTPInputProps = {
  index: number;
};

type Props = Omit<TextInputProps, 'onFocus' | 'onBlur'> & OTPInputProps;

export default function OTPInput({ index }: Props) {
  const codeInputs = useOTPContextSelect((v) => v.codeInputs);
  const inputHandles = useOTPInputCell({
    index,
  });

  return (
    <TextInput
      autoComplete={Platform.OS === 'ios' ? 'one-time-code' : 'sms-otp'}
      submitBehavior={
        codeInputs.length - 1 === index ? 'blurAndSubmit' : 'submit'
      }
      {...inputHandles}
    />
  );
}
