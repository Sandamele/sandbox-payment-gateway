import { TextField } from "../../../shared/components/forms/TextField";
import { Button } from "../../../shared/components/ui/button";
import { Card, CardContent } from "../../../shared/components/ui/card";
import { Building2 } from "lucide-react";
import { useOnBoardingForm } from "../hooks/useOnBoardingForm";
export const OnBoardingForm = () => {
  const { formik } = useOnBoardingForm();
  return (
    <Card className="w-96 py-10 px-6">
      <CardContent>
        <div className="flex flex-col items-center text-center">
          <div className="w-10 h-10 bg-[#006879] flex items-center justify-center mb-4">
            <Building2 className="text-white" size={35} />
          </div>
          <h1 className="text-lg font-bold">Tell us about your business</h1>
          <p className="text-[12px]">
            We need a few details to set up your merchant account and verify
            your business identity.
          </p>
        </div>
        <form onSubmit={formik.handleSubmit} className="w-full mt-6">
          <TextField
            label="Organization Name"
            name="organizationName"
            type="text"
            value={formik.values.organizationName}
            id="organizationName"
            handleChange={formik.handleChange}
            handleBlur={formik.handleBlur}
            errors={{
              error: formik.errors.organizationName ?? "",
              touched: formik.touched.organizationName ?? false,
            }}
          />
          <Button className="w-full mt-6" type="submit">
            Get Started
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
