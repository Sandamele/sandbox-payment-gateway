import * as Yup from "yup";
export const OnBoardingSchema = Yup.object({
  organizationName: Yup.string()
    .trim()
    .min(3, "Minimum 3 characters required")
    .max(50, "Maximum 50 characters required")
    .required("Organization name is required"),
});
