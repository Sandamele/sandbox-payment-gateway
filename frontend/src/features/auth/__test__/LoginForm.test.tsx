import { describe, expect, it, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { LoginForm } from "../components/LoginForm";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
import { AppError } from "../../../shared/lib/appError";
import * as authService from "../services/auth";
import { toast } from "sonner";
const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const renderForm = () => {
  return render(
    <BrowserRouter>
      <LoginForm />
    </BrowserRouter>,
  );
};

describe("LoginForm", () => {
  it("renders inputs and button", () => {
    renderForm();

    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /sign into dashboard/i }),
    ).toBeInTheDocument();
  });
  it("renders validation error then submitted with empty fields", async () => {
    const user = userEvent.setup();
    renderForm();
    const submitButton = screen.getByRole("button", {
      name: /sign into dashboard/i,
    });
    await user.click(submitButton);
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();
    expect(
      await screen.findByText(/password is required/i),
    ).toBeInTheDocument();
  });
  it("does not show errors when fields are valid", async () => {
    const user = userEvent.setup();
    renderForm();

    await user.type(
      screen.getByLabelText(/email address/i),
      "johndoe@gmail.com",
    );
    await user.tab();
    await user.type(screen.getByLabelText(/password/i), "secret123");
    await user.click(
      screen.getByRole("button", { name: /sign into dashboard/i }),
    );

    expect(screen.queryByText(/email is required/i)).not.toBeInTheDocument();
    expect(screen.queryByText(/password is required/i)).not.toBeInTheDocument();
  });
  it("shows invalid credentials message when API returns invalid login error", async () => {
    const user = userEvent.setup();

    vi.spyOn(authService, "loginService").mockRejectedValue(
      new AppError(
        {
          code: "INVALID_EMAIL_OR_PASSWORD",
          message: "Invalid email or password",
        },
        { requestId: "req-1", timeStamp: "2026-03-28T17:32:19.961Z" },
      ),
    );

    renderForm();

    await user.type(screen.getByLabelText(/email/i), "test@gmail.com");
    await user.type(screen.getByLabelText(/password/i), "wrongpass");

    await user.click(
      screen.getByRole("button", { name: /sign into dashboard/i }),
    );

    expect(
      await screen.findByText(/invalid email or password/i),
    ).toBeInTheDocument();
  });
  it("logs in successfully and navigates to dashboard", async () => {
    const user = userEvent.setup();

    vi.spyOn(authService, "loginService").mockResolvedValue({});

    renderForm();

    await user.type(screen.getByLabelText(/email/i), "test@gmail.com");
    await user.type(screen.getByLabelText(/password/i), "Password@123");

    await user.click(
      screen.getByRole("button", { name: /sign into dashboard/i }),
    );

    expect(authService.loginService).toHaveBeenCalledWith({
      email: "test@gmail.com",
      password: "Password@123",
    });

    expect(mockNavigate).toHaveBeenCalledWith({ pathname: "/dashboard" });
  });
  it("shows generic error toast for unknown error", async () => {
    const user = userEvent.setup();

    vi.spyOn(authService, "loginService").mockRejectedValue(
      new Error("Random failure"),
    );

    renderForm();

    await user.type(screen.getByLabelText(/email/i), "test@gmail.com");
    await user.type(screen.getByLabelText(/password/i), "Password@123");

    await user.click(
      screen.getByRole("button", { name: /sign into dashboard/i }),
    );

    expect(toast.error).toHaveBeenCalledWith(
      "Something went wrong",
      expect.any(Object),
    );
  });
  it("disables button while submitting", async () => {
    const user = userEvent.setup();

    vi.spyOn(authService, "loginService").mockImplementation(
      () => new Promise(() => {}),
    );

    renderForm();

    await user.type(screen.getByLabelText(/email/i), "test@gmail.com");
    await user.type(screen.getByLabelText(/password/i), "Password@123");

    const button = screen.getByRole("button", {
      name: /sign into dashboard/i,
    });

    await user.click(button);

    expect(button).toBeDisabled();
  });
});
