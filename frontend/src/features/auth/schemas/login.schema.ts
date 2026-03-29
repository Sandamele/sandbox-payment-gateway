import * as Yup from "yup";
export const LoginSchema = Yup.object({
  email: Yup.string()
    .trim()
    .email("Invalid email")
    .required("Email is required"),
  password: Yup.string().trim().required("Password is required"),
});
