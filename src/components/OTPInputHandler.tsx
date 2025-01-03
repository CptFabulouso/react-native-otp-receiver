import { useCallback, type ReactElement } from 'react';
import type { OTPInputProps } from './OTPInputCell';
import OTPProvider, { useOTPContextSelect } from './OTPProvider';
import type {
  CodeCharValidator,
  OnCodeEnteredData,
  OnSubmitCodeData,
} from '../types';

type ChildrenProps = {
  codeValue: string[];
  isValid: boolean;
  renderOTPInput: () => ReactElement[];
  submitCode: () => void;
};

export type CodeInputCellComponentProps = OTPInputProps;

type Props = {
  codeInputShape: number[];
  children?: (renderProps: ChildrenProps) => ReactElement;
  CodeInputCellComponent: (
    otpHandles: CodeInputCellComponentProps
  ) => ReactElement;
  onCodeEntered?: (data: OnCodeEnteredData) => void;
  onSubmitCode?: (data: OnSubmitCodeData) => void;
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
  const submitCode = useOTPContextSelect((v) => v.submitCode);

  const renderOTPInput = useCallback(() => {
    return codeInputs.map((_, index) =>
      CodeInputCellComponent({
        index,
      })
    );
  }, [CodeInputCellComponent, codeInputs]);

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
