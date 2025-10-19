export const Validators = {
  required(value: string) {
    return value.trim().length > 0;
  },
  numeric(value: string) {
    return /^\d+$/.test(value);
  },
рр
  year(value: string) {
    return /^\d{4}$/.test(value);
  },
  email(value: string) {
    return /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value);
  },
};
