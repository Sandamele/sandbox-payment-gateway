import type { FieldGroupProps } from "../../types/forms.types";
import { ErrorMessage } from "../Error/ErrorMessage";
import { Label } from "../ui/label";

export const FieldGroup = ({ id, label, children, errors }: FieldGroupProps) => {
  return (
    <div className="w-full">
      <Label htmlFor={id}className="text-[#3D494C] text-[12px] font-semibold mb-2 uppercase">
        {label}
      </Label>
      {children}
      {errors.error !== "" && errors.touched && (
        <ErrorMessage message={errors.error} />
      )}
    </div>
  );
};
