export interface Metadata {
  title?: string;
  description?: string;
}

export interface SelectOption<T> {
  label: string;
  value: T;
}
