import { useFormik } from "formik";
import { TextField } from "../../../shared/components/forms/TextField";
import { PasswordField } from "../../../shared/components/forms/PasswordField";
import { Button } from "../../../shared/components/ui/button";
import { Link } from "react-router-dom";
import { SignUpSchema } from "../schemas/signup.schema";
export const SignUpForm = () => {
  const formik = useFormik({
    initialValues: {
      firstName: "",
      lastName: "",
      email: "",
      newPassword: "",
      confirmPassword: "",
    },
    validationSchema: SignUpSchema,
    onSubmit: (values) => {
      console.log(values);
    },
  });
  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div className="flex gap-4">
          <TextField
            type="text"
            label="First Name"
            name="firstName"
            id="firstName"
            value={formik.values.firstName}
            handleChange={formik.handleChange}
            handleBlur={formik.handleBlur}
            errors={{
              error: formik.errors.firstName ?? "",
              touched: formik.touched.firstName ?? false,
            }}
          />
          <TextField
            type="text"
            label="Last Name"
            name="lastName"
            id="lastName"
            value={formik.values.lastName}
            handleChange={formik.handleChange}
            handleBlur={formik.handleBlur}
            errors={{
              error: formik.errors.lastName ?? "",
              touched: formik.touched.lastName ?? false,
            }}
          />
        </div>
        <div className="mt-6">
          <TextField
            type="email"
            label="Email Address"
            name="email"
            id="email"
            value={formik.values.email}
            handleChange={formik.handleChange}
            handleBlur={formik.handleBlur}
            errors={{
              error: formik.errors.email ?? "",
              touched: formik.touched.email ?? false,
            }}
          />
        </div>
        <div className="mt-6">
          <PasswordField
            label="Password"
            name="newPassword"
            id="newPassword"
            value={formik.values.newPassword}
            handleChange={formik.handleChange}
            handleBlur={formik.handleBlur}
            errors={{
              error: formik.errors.newPassword ?? "",
              touched: formik.touched.newPassword ?? false,
            }}
            autoComplete="new-password"
          />
        </div>
        <div className="mt-6">
          <PasswordField
            label="Confirm Password"
            name="confirmPassword"
            id="confirmPassword"
            value={formik.values.confirmPassword}
            handleChange={formik.handleChange}
            handleBlur={formik.handleBlur}
            errors={{
              error: formik.errors.confirmPassword ?? "",
              touched: formik.touched.confirmPassword ?? false,
            }}
            autoComplete="new-password"
          />
        </div>
        <Button className="uppercase font-semibold mt-6 w-full" type="submit">
          Create Account
        </Button>
      </form>
      <p className="text-sm mt-4 text-center">
        Already have an account?{" "}
        <Link to="/auth/login" className="text-[#006879]">
          Sign In
        </Link>
      </p>
    </div>
  );
};
