import { useFormik } from "formik";
import { LoginSchema } from "../schemas/login.schema";
import { loginService } from "../services/auth";
import { AppError } from "../../../shared/lib/appError";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
export const useLogin = () => {
  const [invalidCredentials, setInvalidCredentials] = useState("");
  const navigate = useNavigate();
  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: LoginSchema,
    onSubmit: async (values: { email: string; password: string }) => {
      try {
        await loginService(values);
        navigate({ pathname: "/dashboard" });
      } catch (error) {
        if (error instanceof AppError) {
          const { code, message } = error.error;
          if (code === "INVALID_EMAIL_OR_PASSWORD") {
            setInvalidCredentials(error.error.message);
            return;
          }
          toast.error(message || "Something went wrong", {
            position: "top-center",
          });
        } else {
          toast.error("Something went wrong", {
            position: "top-center",
          });
        }
      }
    },
  });
  return { formik, invalidCredentials };
};
