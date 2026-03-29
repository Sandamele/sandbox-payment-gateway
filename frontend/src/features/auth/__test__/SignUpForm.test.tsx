import { BrowserRouter } from "react-router-dom";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { SignUpForm } from "../components/SignUpForm";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";
import { AppError } from "../../../shared/lib/appError";
import { toast } from "sonner";
import { registerService } from "../services/auth";
vi.mock("../services/auth", () => ({
  registerService: vi.fn(),
}));
vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

const mockNavigate = vi.fn();

vi.mock("react-router-dom", async () => {
  const actual = await vi.importActual("react-router-dom");
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

const renderForm = () => {
  return render(
    <BrowserRouter>
      <SignUpForm />
    </BrowserRouter>,
  );
};
beforeEach(() => {
  vi.clearAllMocks();
});
describe("SignUpForm", () => {
  it("renders inputs and button", () => {
    renderForm();
    expect(screen.getByLabelText(/first name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/last name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/^password$/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/confirm password/i)).toBeInTheDocument();
  });
  it("shows required errors on empty submit", async () => {
    const user = userEvent.setup();
    renderForm();
    await user.click(screen.getByRole("button", { name: /create account/i }));
    expect(
      await screen.findByText(/first name is required/i),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/last name is required/i),
    ).toBeInTheDocument();
    expect(await screen.findByText(/email is required/i)).toBeInTheDocument();

    expect(
      await screen.findByText(/^password is required$/i),
    ).toBeInTheDocument();
    expect(
      await screen.findByText(/confirm password is required/i),
    ).toBeInTheDocument();
  });
  it("does not show errors when fields are valid", async () => {
    const user = userEvent.setup();
    renderForm();
    await user.type(screen.getByLabelText(/first name/i), "John");
    await user.type(screen.getByLabelText(/last name/i), "Doe");
    await user.type(
      screen.getByLabelText(/email address/i),
      "johndoe@gmail.com",
    );
    await user.type(screen.getByLabelText(/^password$/i), "Password@123");
    await user.type(screen.getByLabelText(/confirm password/i), "Password@123");
    await user.click(screen.getByRole("button", { name: /create account/i }));
    expect(
      screen.queryByLabelText(/first name is require/i),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText(/last name is require/i),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText(/email is require/i),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText(/password is require/i),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByLabelText(/confirm password is require/i),
    ).not.toBeInTheDocument();
  });
  it("shows a field error when the email is already taken", async () => {
    const user = userEvent.setup();

    vi.mocked(registerService).mockRejectedValue(
      new AppError(
        {
          code: "USER_ALREADY_EXISTS_USE_ANOTHER_EMAIL",
          message: "User already exists. Use another email.",
        },
        { requestId: "req-1", timeStamp: "2026-03-28T17:32:19.961Z" },
      ),
    );

    renderForm();

    await user.type(screen.getByLabelText(/first name/i), "John");
    await user.type(screen.getByLabelText(/last name/i), "Doe");
    await user.type(
      screen.getByLabelText(/email address/i),
      "johndoe@gmail.com",
    );
    await user.type(screen.getByLabelText(/^password$/i), "Password@123");
    await user.type(screen.getByLabelText(/confirm password/i), "Password@123");

    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(
      await screen.findByText(/user already exists. use another email./i),
    ).toBeInTheDocument();
  });
  it("submits successfully and navigates", async () => {
    const user = userEvent.setup();

    vi.mocked(registerService).mockResolvedValue({} as any);

    renderForm();

    await user.type(screen.getByLabelText(/first name/i), "John");
    await user.type(screen.getByLabelText(/last name/i), "Doe");
    await user.type(screen.getByLabelText(/email/i), "john@gmail.com");
    await user.type(screen.getByLabelText(/^password$/i), "Password@123");
    await user.type(screen.getByLabelText(/confirm password/i), "Password@123");

    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(registerService).toHaveBeenCalledWith({
      name: "John Doe",
      email: "john@gmail.com",
      password: "Password@123",
      role: "MERCHANT",
    });

    expect(toast.success).toHaveBeenCalledWith(
      "Signup successfully",
      expect.any(Object),
    );
  });
  it("submits successfully and navigates", async () => {
    const user = userEvent.setup();

    vi.mocked(registerService).mockResolvedValue({} as any);

    renderForm();

    await user.type(screen.getByLabelText(/first name/i), "John");
    await user.type(screen.getByLabelText(/last name/i), "Doe");
    await user.type(screen.getByLabelText(/email/i), "john@gmail.com");
    await user.type(screen.getByLabelText(/^password$/i), "Password@123");
    await user.type(screen.getByLabelText(/confirm password/i), "Password@123");

    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(registerService).toHaveBeenCalledWith({
      name: "John Doe",
      email: "john@gmail.com",
      password: "Password@123",
      role: "MERCHANT",
    });

    expect(toast.success).toHaveBeenCalledWith(
      "Signup successfully",
      expect.any(Object),
    );
  });
  it("disables button and shows spinner while submitting", async () => {
    const user = userEvent.setup();

    vi.mocked(registerService).mockImplementation(
      () => new Promise(() => {}), // never resolves
    );

    renderForm();

    await user.type(screen.getByLabelText(/first name/i), "John");
    await user.type(screen.getByLabelText(/last name/i), "Doe");
    await user.type(screen.getByLabelText(/email/i), "john@gmail.com");
    await user.type(screen.getByLabelText(/^password$/i), "Password@123");
    await user.type(screen.getByLabelText(/confirm password/i), "Password@123");

    const button = screen.getByRole("button", {
      name: /create account/i,
    });

    await user.click(button);

    expect(button).toBeDisabled();
  });
  it("shows generic error toast for unknown errors", async () => {
    const user = userEvent.setup();

    vi.mocked(registerService).mockRejectedValue(new Error("Random error"));

    renderForm();

    await user.type(screen.getByLabelText(/first name/i), "John");
    await user.type(screen.getByLabelText(/last name/i), "Doe");
    await user.type(screen.getByLabelText(/email/i), "john@gmail.com");
    await user.type(screen.getByLabelText(/^password$/i), "Password@123");
    await user.type(screen.getByLabelText(/confirm password/i), "Password@123");

    await user.click(screen.getByRole("button", { name: /create account/i }));

    expect(toast.error).toHaveBeenCalledWith(
      "Something went wrong",
      expect.any(Object),
    );
  });
});
