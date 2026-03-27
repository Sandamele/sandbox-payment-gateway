import { useFormik } from "formik";
import { Button } from "../../../shared/components/ui/button";
import { TextField } from "../../../shared/components/forms/TextField";
import { PasswordField } from "../../../shared/components/forms/PasswordField";
import { LoginSchema } from "../schemas/login.schema";
import { Link } from "react-router-dom";


export const LoginForm = () => {
  const formik = useFormik({
    initialValues: {
      email: "",
      passwords: "",
    },
    validationSchema: LoginSchema,
    onSubmit: (values) => {},
  });
  return (
    <div>
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
            name="passwords"
            id="passwords"
            value={formik.values.passwords}
            handleChange={formik.handleChange}
            handleBlur={formik.handleBlur}
            errors={{
              error: formik.errors.passwords ?? "",
              touched: formik.touched.passwords ?? false,
            }}
            autoComplete="new-password"
          />
        </div>
        <Button className="uppercase font-semibold mt-6 w-full" type="submit">
          Sign Into Dashboard
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
