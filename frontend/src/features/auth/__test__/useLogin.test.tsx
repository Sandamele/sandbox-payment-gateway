import { describe, it, expect, vi, beforeEach } from "vitest";
import { renderHook, act, waitFor } from "@testing-library/react";
import { useLogin } from "../hooks/useLogin";
import { loginService } from "../services/auth";
import { AppError } from "../../../shared/lib/appError";
import { toast } from "sonner";

vi.mock("../services/auth", () => ({
  loginService: vi.fn(),
}));
vi.mock("sonner", () => ({ toast: { error: vi.fn() } }));
vi.mock("react-router-dom", () => ({
  useNavigate: () => vi.fn(),
}));

const mockNavigate = vi.fn();
vi.mock("react-router-dom", () => ({
  useNavigate: () => mockNavigate,
}));
const submitForm = async (
  formik: ReturnType<typeof useLogin>["formik"],
  email = "johndoe@gmail.com",
  password = "Password123",
) => {
  await act(async () => {
    formik.setFieldValue("email", email);
    formik.setFieldValue("password", password);
  });
  await act(async () => {
    formik.handleSubmit();
  });
};
beforeEach(() => vi.clearAllMocks());
describe("useLogin", () => {
  describe("form validation", () => {
    it("sets an error for an invalid email format", async () => {
      const { result } = renderHook(() => useLogin());

      await act(async () => {
        result.current.formik.setFieldTouched("email", true);
        result.current.formik.setFieldValue("email", "not-an-email");
      });

      await waitFor(() => {
        expect(result.current.formik.errors.email).toBeDefined();
      });
    });

    it("sets an error when email is empty", async () => {
      const { result } = renderHook(() => useLogin());

      await act(async () => {
        result.current.formik.setFieldTouched("email", true);
        result.current.formik.setFieldValue("email", "");
      });

      await waitFor(() => {
        expect(result.current.formik.errors.email).toBeDefined();
      });
    });

    it("sets an error when password is empty", async () => {
      const { result } = renderHook(() => useLogin());

      await act(async () => {
        result.current.formik.setFieldTouched("password", true);
        result.current.formik.setFieldValue("password", "");
      });

      await waitFor(() => {
        expect(result.current.formik.errors.password).toBeDefined();
      });
    });

    it("does not call loginService when the form is invalid", async () => {
      const { result } = renderHook(() => useLogin());

      await act(async () => {
        result.current.formik.handleSubmit();
      });

      expect(loginService).not.toHaveBeenCalled();
    });
  });
  describe("successful login", () => {
    it("calls loginService with email and password", async () => {
      vi.mocked(loginService).mockResolvedValueOnce(undefined);
      const { result } = renderHook(() => useLogin());

      await submitForm(result.current.formik);

      expect(loginService).toHaveBeenCalledWith({
        email: "johndoe@gmail.com",
        password: "Password123",
      });
    });

    it("navigates to /dashboard after successful login", async () => {
      vi.mocked(loginService).mockResolvedValueOnce(undefined);
      const { result } = renderHook(() => useLogin());

      await submitForm(result.current.formik);

      await waitFor(() => {
        expect(mockNavigate).toHaveBeenCalledWith({ pathname: "/dashboard" });
      });
    });
  });
  describe("useLogin catch block tests", () => {
    it("sets invalidCredentials when AppError code is INVALID_EMAIL_OR_PASSWORD", async () => {
      vi.mocked(loginService).mockRejectedValueOnce(
        new AppError(
          {
            code: "INVALID_EMAIL_OR_PASSWORD",
            message: "Invalid email or password",
          },
          { requestId: "req-1", timeStamp: "2026-03-28T17:32:19.961Z" },
        ),
      );

      const { result } = renderHook(() => useLogin());

      // Set form values first
      act(() => {
        result.current.formik.setValues({
          email: "johndoe@gmail.com",
          password: "Password",
        });
      });

      await act(async () => {
        await result.current.formik.submitForm();
      });

      await waitFor(() => {
        expect(result.current.invalidCredentials).toBe(
          "Invalid email or password",
        );
      });

      expect(toast.error).not.toHaveBeenCalled();
    });

    it("calls toast.error for other AppError codes", async () => {
      vi.mocked(loginService).mockRejectedValueOnce(
        new AppError(
          {
            code: "INTERNAL_SERVER_ERROR",
            message: "Something went wrong. Please try again.",
          },
          { requestId: "req-2", timeStamp: "2026-03-28T17:35:00.000Z" },
        ),
      );

      const { result } = renderHook(() => useLogin());

      act(() => {
        result.current.formik.setValues({
          email: "johndoe@gmail.com",
          password: "Password123",
        });
      });

      await act(async () => {
        await result.current.formik.submitForm();
      });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith(
          "Something went wrong. Please try again.",
          {
            position: "top-center",
          },
        );
      });

      expect(result.current.invalidCredentials).toBe("");
    });

    it("calls toast.error for unknown errors", async () => {
      vi.mocked(loginService).mockRejectedValueOnce(new Error("Random error"));

      const { result } = renderHook(() => useLogin());

      act(() => {
        result.current.formik.setValues({
          email: "johndoe@gmail.com",
          password: "Password123",
        });
      });

      await act(async () => {
        await result.current.formik.submitForm();
      });

      await waitFor(() => {
        expect(toast.error).toHaveBeenCalledWith("Something went wrong", {
          position: "top-center",
        });
      });

      expect(result.current.invalidCredentials).toBe("");
    });
  });
});
