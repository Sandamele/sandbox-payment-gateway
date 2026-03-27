import * as Yup from "yup";
export const SignUpSchema = Yup.object({
  firstName: Yup.string()
    .trim()
    .min(3, "Minimum 3 characters required")
    .max(50, "Maximum 50 characters required")
    .required("First name is required"),
  lastName: Yup.string()
    .trim()
    .min(3, "Minimum 3 characters required")
    .max(50, "Maximum 50 characters required")
    .required("Last name is required"),
  email: Yup.string()
    .trim()
    .email("Invalid email")
    .required("Email is required"),
  newPassword: Yup.string()
    .trim()
    .min(8, "Password must be at least 8 characters")
    .matches(
      /(?=.*[a-z])/,
      "Password must contain at least one lowercase letter",
    )
    .matches(
      /(?=.*[A-Z])/,
      "Password must contain at least one uppercase letter",
    )
    .matches(/(?=.*[0-9])/, "Password must contain at least one number")
    .required("Password is required"),

  confirmPassword: Yup.string()
    .trim()
    .oneOf([Yup.ref("newPassword")], "Passwords must match")
    .required("Confirm password is required"),
});
