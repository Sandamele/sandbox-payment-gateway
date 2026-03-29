import { TextField } from "../../../shared/components/forms/TextField";
import { PasswordField } from "../../../shared/components/forms/PasswordField";
import { Button } from "../../../shared/components/ui/button";
import { Link } from "react-router-dom";
import { useSignup } from "../hooks/useSignUp";
import { Spinner } from "../../../shared/components/ui/spinner";
export const SignUpForm = () => {
  const { formik } = useSignup();
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
            autoComplete="username"
          />
        </div>
        <div className="mt-6">
          <PasswordField
            label="Password"
            name="password"
            id="password"
            value={formik.values.password}
            handleChange={formik.handleChange}
            handleBlur={formik.handleBlur}
            errors={{
              error: formik.errors.password ?? "",
              touched: formik.touched.password ?? false,
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
        <Button
          className="uppercase font-semibold mt-6 w-full"
          type="submit"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? (
            <Spinner color="secondary" />
          ) : (
            "Create Account"
          )}
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
