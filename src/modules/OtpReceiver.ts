import { Platform } from 'react-native';
import OtpReceiver from '../specs/NativeOtpReceiver';

export const requestPhoneHint = async () => {
  if (Platform.OS === 'ios') {
    return Promise.reject(new Error('Unavailable on iOS'));
  }
  return OtpReceiver.requestPhoneHint();
};

export const expectSMSWithOTP = () => {
  if (Platform.OS === 'ios') {
    return false;
  }
  return OtpReceiver.expectSMSWithOTP();
};

export const onSMSReceived = (
  ...args: Parameters<typeof OtpReceiver.onSMSReceived>
) => {
  if (Platform.OS === 'ios') {
    return {
      remove: () => {},
    };
  }
  return OtpReceiver.onSMSReceived(...args);
};
