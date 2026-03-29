import { useFormik } from "formik";
import { OnBoardingSchema } from "../schema/onboarding.schema";

export const useOnBoardingForm = () => {
  const formik = useFormik({
    initialValues: {
      organizationName: "",
    },
    validationSchema: OnBoardingSchema,
    onSubmit: async (values) => {},
  });

  return { formik };
};
