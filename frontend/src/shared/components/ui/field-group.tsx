import type { ReactNode } from "react";
import { Label } from "./label";
import { ErrorMessage } from "../Error/ErrorMessage";

type FieldGroupProps = {
  label: string;
  children: ReactNode;
  error: string;
};
export const FieldGroup = ({ label, children, error }: FieldGroupProps) => {
  return (
    <div>
      <Label className="text-[#3D494C] text-md font-semibold">{label}</Label>
      {children}
      {error !== "" && <ErrorMessage message={error} />}
    </div>
  );
};
