export type CodeCharValidator = RegExp | ((char: string) => boolean);
export type CodeInputOrigin = 'manual' | 'sms' | 'cta';
export type OnSubmitCodeData = {
  isValid: boolean;
  code: string;
  origin: CodeInputOrigin;
};
export type OnCodeEnteredData = {
  code: string;
  origin: CodeInputOrigin;
};
