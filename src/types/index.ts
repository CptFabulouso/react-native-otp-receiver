export type CodeCharValidator = RegExp | ((char: string) => boolean);
export type CodeInputOrigin = 'manual' | 'sms' | 'cta';
