import { isEmpty, map, get, isNaN } from "lodash";

export function phoneFormat(string: string): string {
  if (!isEmpty(string)) {
    const cleanString = string.replace(/[^\d]/g, "");
    if (cleanString.length === 10) {
      return cleanString.replace(/(\d{3})(\d{3})(\d{4})/, "($1) $2-$3");
    }
    if (cleanString.length === 11) {
      return cleanString.replace(/(\d{1})(\d{3})(\d{3})(\d{4})/, "$1 ($2) $3-$4");
    }
    return cleanString;
  }
  return "";
}

export function RNCFormat(string: string): string {
  if (!isEmpty(string)) {
    const cleanString = string.replace(/[^\d]/g, "");
    if (cleanString.length === 9) {
      return cleanString.replace(/(\d{3})(\d{5})(\d{1})/, "$1-$2-$3");
    }
    if (cleanString.length === 11) {
      return cleanString.replace(/(\d{3})(\d{7})(\d{1})/, "$1-$2-$3");
    }
    return cleanString;
  }
  return "";
}

export function padWithZero(number: number): string {
  if (isNaN(number)) return "";
  const string = number.toString();
  if (number < 10) {
    return `0${string}`;
  }
  return string;
}

export function dropdownFormat<T>(data: T[], label: string, value: string): { key: number; text: string; value: string }[] {
  const formatData = map(data, (item, index) => {
    return {
      key: index + 1,
      text: String(get(item, label, "")), // Coerce to string
      value: String(get(item, value, "")), // Coerce to string
    };
  });
  return formatData;
}
