import { useState } from "react";
import type { PasswordFieldProps } from "../../types/forms.types";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
} from "../ui/input-group";
import { FieldGroup } from "./FieldGroup";
import { Eye, EyeOff } from "lucide-react";

export const PasswordField = ({
  label,
  id,
  name,
  value,
  handleChange,
  handleBlur,
  errors,
  autoComplete,
}: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const handleShowPassword = () => {
    setShowPassword((prev) => !prev);
  };
  return (
    <FieldGroup id={id} label={label} errors={errors}>
      <InputGroup>
        <InputGroupInput
          type={showPassword ? "text" : "password"}
          name={name}
          id={id}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          aria-invalid={errors.error !== "" && errors.touched}
          autoComplete={autoComplete}
        />
        <InputGroupAddon align="inline-end">
          {showPassword ? (
            <Eye onClick={handleShowPassword} />
          ) : (
            <EyeOff onClick={handleShowPassword} />
          )}
        </InputGroupAddon>
      </InputGroup>
    </FieldGroup>
  );
};
