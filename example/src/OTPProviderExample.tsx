import { View, Button, TouchableOpacity, Text, Keyboard } from 'react-native';
import {
  OTPInputCell,
  OTPProvider,
  useOTPInputCellState,
} from 'react-native-otp-receiver';
import { useOTPContext } from '../../src/components/OTPProvider';
import styles from './styles';

const getCodeFromSMS = (sms: string) => {
  return sms.match(/\d{6}/)?.[0] || '';
};

const toUpperCase = (char: string) => {
  return char.toUpperCase();
};

const shape = [3, 3];

const isCharValidRegex = /^[a-zA-Z0-9]$/;

export default function OTPProviderExample() {
  return (
    <OTPProvider
      codeInputShape={shape}
      onCodeEntered={(code) => {
        console.log('Code Entered', code);
      }}
      onSubmitCode={(data) => {
        Keyboard.dismiss();
        console.log('Submit Code', data);
      }}
      parseSMS={getCodeFromSMS}
      parseEnteredCodeChar={toUpperCase}
      parsePastedCode={(code) => code.split('-')}
      validateCodeChar={isCharValidRegex}
      expectSMSOnMount
    >
      <CodeInputRenderer />
    </OTPProvider>
  );
}

function CodeInputRenderer() {
  const { isCodeValid, submitCode } = useOTPContext();

  return (
    <>
      <View style={styles.otpContainer}>
        <CodeInputComponent index={0} />
        <Text style={styles.codeInputValue}>-</Text>
        <CodeInputComponent index={1} />
      </View>
      <Button title="Submit" disabled={!isCodeValid} onPress={submitCode} />
    </>
  );
}

function CodeInputComponent({ index }: { index: number }) {
  const { isFocused, value, getRef } = useOTPInputCellState(index);
  const backgroundColor = isFocused ? 'white' : '#DEDEDE';
  const borderColor = isFocused ? '#000000' : '#3A4A3A';
  const width = 90;

  return (
    <TouchableOpacity
      style={[
        styles.otpWrapper,
        {
          width,
          backgroundColor,
          borderColor,
        },
      ]}
      onPress={() => {
        getRef()?.focus();
      }}
    >
      <OTPInputCell style={styles.otpInputHidden} index={index} />
      <Text style={styles.codeInputValue}>{value}</Text>
    </TouchableOpacity>
  );
}
