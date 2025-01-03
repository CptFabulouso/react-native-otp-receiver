export * from './modules/OtpReceiver';
export * from './types';

export type { SMSData } from './specs/NativeOtpReceiver';
export {
  default as OTPInputHandler,
  type CodeInputCellComponentProps,
} from './components/OTPInputHandler';
export { default as OTPProvider } from './components/OTPProvider';
export {
  default as OTPInputCell,
  useOTPInputCellState,
  type OTPInputProps,
} from './components/OTPInputCell';
