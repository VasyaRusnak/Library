export namespace Validators {
  export function required(value: string) {
    return value.trim().length > 0;
  }
  export function numeric(value: string) {
    return /^\d+$/.test(value);
  }
  export function year(value: string) {
    return /^\d{4}$/.test(value);
  }
  export function email(value: string) {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);
  }
}
