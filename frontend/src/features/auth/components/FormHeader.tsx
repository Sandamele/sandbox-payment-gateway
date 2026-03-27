import { FormHeaderProps } from "../../../shared/types/forms.types";

export const FormHeader = ({ title, subTitle }: FormHeaderProps) => {
  return (
    <header>
      <h2 className="text-3xl font-extrabold">{title}</h2>
      <h3 className="text-[#3D494C]">{subTitle}</h3>
    </header>
  );
};
