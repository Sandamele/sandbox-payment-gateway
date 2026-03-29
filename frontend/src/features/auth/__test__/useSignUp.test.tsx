import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useSignup } from "../hooks/useSignUp";
import { registerService } from "../services/auth";
import { AppError } from "../../../shared/lib/appError";
import { toast } from "sonner";

vi.mock("../services/auth", () => ({
  registerService: vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const formValues = {
  firstName: "John",
  lastName: "Doe",
  email: "johndoe@example.com",
  password: "Password123",
  confirmPassword: "Password123",
};
const submitForm = async (
  formik: ReturnType<typeof useSignup>["formik"],
  overrides: Partial<typeof formValues> = {},
) => {
  const values = { ...formValues, ...overrides };
  await act(async () => {
    formik.setFieldValue("firstName", values.firstName);
    formik.setFieldValue("lastName", values.lastName);
    formik.setFieldValue("email", values.email);
    formik.setFieldValue("password", values.password);
    formik.setFieldValue("confirmPassword", values.confirmPassword);
  });
  await act(async () => {
    formik.handleSubmit();
  });
};

beforeEach(() => {
  vi.clearAllMocks();
  vi.useFakeTimers();
});

afterEach(() => {
  vi.useRealTimers();
});
describe("useSignup", () => {
  describe("form validation", () => {
    it("does not call registerService when the form is empty", async () => {
      const { result } = renderHook(() => useSignup());

      await act(async () => {
        result.current.formik.handleSubmit();
      });

      expect(registerService).not.toHaveBeenCalled();
    });
    it.each([
      "firstName",
      "lastName",
      "email",
      "password",
      "confirmPassword",
    ] as const)("sets an error when %s is empty", async (field) => {
      const { result } = renderHook(() => useSignup());

      await act(async () => {
        result.current.formik.setFieldTouched(field, true);
        result.current.formik.setFieldValue(field, "");
      });
      await act(async () => {
        await result.current.formik.submitForm();
      });

      expect(result.current.formik.errors[field]).toBeDefined();
    });
    it("sets an error for an invalid email format", async () => {
      const { result } = renderHook(() => useSignup());

      await act(async () => {
        result.current.formik.setFieldTouched("email", true);
        result.current.formik.setFieldValue("email", "emailgmail.com");
      });
      expect(result.current.formik.errors.email).toBeDefined();
    });
  });
  describe("successful signup", () => {
    it("calls registerService with the correctly shaped body", async () => {
      vi.mocked(registerService).mockResolvedValueOnce(undefined);
      const { result } = renderHook(() => useSignup());

      await submitForm(result.current.formik);

      expect(registerService).toHaveBeenCalledWith({
        name: `${formValues.firstName} ${formValues.lastName}`,
        email: formValues.email,
        password: formValues.password,
        role: "MERCHANT",
      });
    });

    it("shows a success toast after submission", async () => {
      vi.mocked(registerService).mockResolvedValueOnce(undefined);
      const { result } = renderHook(() => useSignup());

      await submitForm(result.current.formik);

      expect(toast.success).toHaveBeenCalledWith("Signup successfully", {
        position: "top-center",
      });
    });

    it("navigates to /dashboard/on-boarding after 1.5s delay", async () => {
      const { result } = renderHook(() => useSignup());

      await submitForm(result.current.formik);

      // advance timers by 1.5s
      act(() => {
        vi.advanceTimersByTime(1500);
      });

      expect(mockNavigate).toHaveBeenCalledWith("/dashboard/on-boarding");
    });
  });
  describe("useSignUp catch block tests", () => {
    it("sets a field error on the email field", async () => {
      vi.mocked(registerService).mockRejectedValueOnce(
        new AppError(
          {
            code: "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL",
            message: "User already exists. Use another email",
          },
          { requestId: "req-1", timeStamp: "2026-03-28T17:32:19.961Z" },
        ),
      );
      const { result } = renderHook(() => useSignup());

      await submitForm(result.current.formik);

      expect(result.current.formik.errors.email).toBe(
        "User already exists. Use another email",
      );
    });

    it("calls toast.error for unknown errors", async () => {
      vi.mocked(registerService).mockRejectedValueOnce(
        new Error("Random error"),
      );

      const { result } = renderHook(() => useSignup());

      act(() => {
        result.current.formik.setValues(formValues);
      });

      await act(async () => {
        await result.current.formik.submitForm();
      });

      expect(toast.error).toHaveBeenCalledWith("Something went wrong", {
        position: "top-center",
      });
    });
    it("calls toast.error for other AppError codes", async () => {
      vi.mocked(registerService).mockRejectedValueOnce(
        new AppError(
          {
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong. Please try again.",
          },
          { requestId: "req-2", timeStamp: "2026-03-28T17:35:00.000Z" },
        ),
      );

      const { result } = renderHook(() => useSignup());

      act(() => {
        result.current.formik.setValues(formValues);
      });

      await act(async () => {
        await result.current.formik.submitForm();
      });

      expect(toast.error).toHaveBeenCalledWith(
        "Something went wrong. Please try again.",
        {
          position: "top-center",
        },
      );
    });
  });
});
