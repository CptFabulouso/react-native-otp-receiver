import { View, Button, TouchableOpacity, Keyboard } from 'react-native';
import {
  OTPInputHandler,
  OTPInputCell,
  type CodeInputCellComponentProps,
  useOTPInputCellState,
} from 'react-native-otp-receiver';
import styles from './styles';

const getCodeFromSMS = (sms: string) => {
  return sms.match(/\d{6}/)?.[0] || '';
};

const isCharValidRegex = /^[a-zA-Z0-9]$|^Backspace$/;

export default function OTPInputHandlerExample() {
  return (
    <OTPInputHandler
      codeInputShape={[1, 1, 1, 1, 1, 1]}
      CodeInputCellComponent={CodeInputComponent}
      onCodeEntered={(code) => {
        console.log('Code Entered', code);
      }}
      onSubmitCode={(data) => {
        Keyboard.dismiss();
        console.log('Submit Code', data);
      }}
      parseSMS={getCodeFromSMS}
      validateCodeChar={isCharValidRegex}
      expectSMSOnMount
    >
      {({ renderOTPInput, submitCode, isValid }) => (
        <>
          <View style={styles.otpContainer}>{renderOTPInput()}</View>
          <Button title="Submit" disabled={!isValid} onPress={submitCode} />
        </>
      )}
    </OTPInputHandler>
  );
}

function CodeInputComponent(inputHandles: CodeInputCellComponentProps) {
  const { isFocused, getRef } = useOTPInputCellState(inputHandles.index);
  const backgroundColor = isFocused ? 'white' : '#DEDEDE';
  const borderColor = isFocused ? '#000000' : '#3A4A3A';

  return (
    <TouchableOpacity
      key={inputHandles.index}
      style={[
        styles.otpWrapper,
        {
          backgroundColor,
          borderColor,
        },
      ]}
      onPress={() => {
        getRef()?.focus();
      }}
    >
      <OTPInputCell {...inputHandles} style={styles.otpInput} />
    </TouchableOpacity>
  );
}
