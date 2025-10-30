import type { TurboModule, CodegenTypes } from 'react-native';
import { TurboModuleRegistry } from 'react-native';

export type SMSData = {
  message?: string;
  error?: string;
};
export interface Spec extends TurboModule {
  requestPhoneHint(): Promise<string>;
  expectSMSWithOTP(): Promise<boolean>;
  readonly onSMSReceived: CodegenTypes.EventEmitter<SMSData>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('OtpReceiver');
