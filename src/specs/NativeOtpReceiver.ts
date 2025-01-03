import type { TurboModule } from 'react-native';
import { TurboModuleRegistry } from 'react-native';
import type { EventEmitter } from 'react-native/Libraries/Types/CodegenTypes';

export type SMSData = {
  message?: string;
  error?: string;
};
export interface Spec extends TurboModule {
  requestPhoneHint(): Promise<string>;
  expectSMSWithOTP(): Promise<boolean>;
  readonly onSMSReceived: EventEmitter<SMSData>;
}

export default TurboModuleRegistry.getEnforcing<Spec>('OtpReceiver');
