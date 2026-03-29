import { Button } from "../../../shared/components/ui/button";
import { TextField } from "../../../shared/components/forms/TextField";
import { PasswordField } from "../../../shared/components/forms/PasswordField";
import { Link } from "react-router-dom";
import { useLogin } from "../hooks/useLogin";
import { ErrorMessage } from "../../../shared/components/Error/ErrorMessage";
import { Spinner } from "../../../shared/components/ui/spinner";

export const LoginForm = () => {
  const { formik, invalidCredentials } = useLogin();
  return (
    <div>
      {invalidCredentials !== "" && (
        <ErrorMessage
          message={invalidCredentials}
          className="text-red-800 bg-red-200 text-center py-1 w-full mb-6"
        />
      )}
      <form onSubmit={formik.handleSubmit}>
        <TextField
          label="Email Address"
          type="text"
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
        <Button
          className="uppercase font-semibold mt-6 w-full"
          type="submit"
          disabled={formik.isSubmitting}
        >
          {formik.isSubmitting ? <Spinner color="secondary" /> : "Sign Into Dashboard"}
        </Button>
      </form>
      <p className="text-sm mt-4 text-center">
        Don't have a merchant account?{" "}
        <Link to="/auth/signup" className="text-[#006879]">
          Apply for Access
        </Link>{" "}
      </p>
    </div>
  );
};
