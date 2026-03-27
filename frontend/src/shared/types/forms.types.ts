import type { ChangeEvent, ReactNode } from "react";

export type FieldGroupProps = {
  label: string;
  children: ReactNode;
  id: string;
  errors: {
    error: string;
    touched: boolean;
  }; 
};
type TypeProps = "text" | "email" | "password" | "number";
export type TextFieldProps = {
  label: string;
  type: TypeProps;
  name: string;
  id: string;
  value: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: ChangeEvent<HTMLInputElement>) => void;
  errors: {
    error: string;
    touched: boolean;
  };
};
export type PasswordFieldProps = {
  label: string;
  name: string;
  id: string;
  value: string;
  autoComplete: string;
  handleChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: ChangeEvent<HTMLInputElement>) => void;
  errors: {
    error: string;
    touched: boolean;
  };
};

export type FormHeaderProps = {
  title: string;
  subTitle: string;
};
