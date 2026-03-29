import { useFormik } from "formik";
import { SignUpSchema } from "../schemas/signup.schema";
import { SignUpType } from "../types";
import { registerService } from "../services/auth";
import { AppError } from "../../../shared/lib/appError";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
export const useSignup = () => {
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
    validationSchema: SignUpSchema,
    onSubmit: async (values: SignUpType) => {
      try {
        const body = {
          name: `${values.firstName} ${values.lastName}`,
          email: values.email,
          password: values.password,
          role: "MERCHANT",
        };
        await registerService(body);
        toast.success("Signup successfully", {
          position: "top-center",
        });
        setTimeout(() => {
          navigate("/dashboard/on-boarding");
        }, 1500);
      } catch (error) {
        if (error instanceof AppError) {
          const { code, message } = error.error;
          if (code === "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL") {
            formik.setFieldError("email", message);
          } else {
            toast.error(message || "Something went wrong", {
              position: "top-center",
            });
          }
        } else {
          toast.error("Something went wrong", {
            position: "top-center",
          });
        }
      }
    },
  });

  return { formik };
};
