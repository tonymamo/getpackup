declare module 'string-mask' {
  export interface StringMaskResult {
    result: string;
    valid: boolean;
  }
  export interface StringMaskOptions {
    reverse?: boolean;
  }
  export function process(
    value: unknown,
    pattern: string,
    options?: StringMaskOptions
  ): StringMaskResult;
}
