import type { TextFieldProps } from "../../types/forms.types";
import { Input } from "../ui/input";
import { FieldGroup } from "./FieldGroup";

export const TextField = ({
  label,
  type,
  name,
  id,
  value,
  handleChange,
  handleBlur,
  errors,
  autoComplete = "",
}: TextFieldProps) => {
  return (
    <FieldGroup id={id} label={label} errors={errors}>
      <Input
        type={type}
        name={name}
        id={id}
        value={value}
        onChange={handleChange}
        onBlur={handleBlur}
        aria-invalid={errors.error !== "" && errors.touched}
        autoComplete={autoComplete}
      />
    </FieldGroup>
  );
};
