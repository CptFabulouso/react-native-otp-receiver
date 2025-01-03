import { useCallback, type ReactElement } from 'react';
import type { OTPInputProps } from './OTPInputCell';
import OTPProvider, {
  useOTPContextSelect,
  useOTPInputContext,
} from './OTPProvider';
import { View, TextInput } from 'react-native';
import type { CodeCharValidator } from '../types';

type ChildrenProps = {
  codeValue: string[];
  isValid: boolean;
  renderOTPInput: () => ReactElement[];
  submitCode: () => void;
};

export type CodeInputCellComponentProps = OTPInputProps & {
  isFocused: boolean;
  getRef: () => TextInput | null;
};

type Origin = 'manual' | 'sms' | 'cta';
type Props = {
  codeInputShape: number[];
  children?: (renderProps: ChildrenProps) => ReactElement;
  CodeInputCellComponent: (
    otpHandles: CodeInputCellComponentProps
  ) => ReactElement;
  onCodeEntered?: (data: { code: string; origin: Origin }) => void;
  onSubmitCode?: (data: {
    isValid: boolean;
    code: string;
    origin: Origin;
  }) => void;
  parseSMS?: (sms: string) => string | null | undefined;
  parseEnteredCodeChar?: (char: string) => string;
  parsePastedCode?: (code: string, codeInputShape: number[]) => string[];
  validateCodeChar?: CodeCharValidator;
  expectSMSOnMount?: boolean;
};

export default function OTPInputHandler({
  codeInputShape,
  children,
  onCodeEntered,
  CodeInputCellComponent,
  onSubmitCode,
  parseSMS,
  parseEnteredCodeChar,
  parsePastedCode,
  validateCodeChar,
  expectSMSOnMount,
}: Props) {
  return (
    <OTPProvider
      codeInputShape={codeInputShape}
      onCodeEntered={onCodeEntered}
      onSubmitCode={onSubmitCode}
      parseSMS={parseSMS}
      parseEnteredCodeChar={parseEnteredCodeChar}
      parsePastedCode={parsePastedCode}
      validateCodeChar={validateCodeChar}
      expectSMSOnMount={expectSMSOnMount}
    >
      <Handler CodeInputCellComponent={CodeInputCellComponent}>
        {children}
      </Handler>
    </OTPProvider>
  );
}

function Handler({
  children,
  CodeInputCellComponent,
}: Pick<Props, 'children' | 'CodeInputCellComponent'>) {
  const codeValue = useOTPContextSelect((v) => v.codeValue);
  const isValid = useOTPContextSelect((v) => v.isCodeValid);
  const codeInputs = useOTPContextSelect((v) => v.codeInputs);
  const focusedIndex = useOTPContextSelect((v) => v.focusedIndex);
  const submitCode = useOTPContextSelect((v) => v.submitCode);

  const inputProps = useOTPInputContext();

  const renderOTPInput = useCallback(() => {
    return codeInputs.map((_, index) => (
      <View key={index}>
        {CodeInputCellComponent({
          ...inputProps,
          index,
          isFocused: focusedIndex === index,
          getRef: () => inputProps.getRef(index),
        })}
      </View>
    ));
  }, [CodeInputCellComponent, codeInputs, focusedIndex, inputProps]);

  return (
    <>
      {children?.({
        codeValue,
        isValid,
        renderOTPInput,
        submitCode,
      })}
    </>
  );
}
