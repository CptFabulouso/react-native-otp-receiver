import { useCallback, type ReactElement } from 'react';
import type { OTPInputProps } from './OTPInputCell';
import OTPProvider, {
  useOTPContextSelect,
  type OTPProviderProps,
} from './OTPProvider';

type ChildrenProps = {
  codeValue: string[];
  isValid: boolean;
  renderOTPInput: () => ReactElement[];
  submitCode: () => void;
};

export type CodeInputCellComponentProps = OTPInputProps;

type Props = Omit<OTPProviderProps, 'children'> & {
  /** The UI to render */
  children?: (renderProps: ChildrenProps) => ReactElement;

  /** The UI component to render as an input cell */
  CodeInputCellComponent: (
    otpHandles: CodeInputCellComponentProps
  ) => ReactElement;
};

export default function OTPInputHandler({
  children,
  CodeInputCellComponent,
  ...providerProps
}: Props) {
  return (
    <OTPProvider {...providerProps}>
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
