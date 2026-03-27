import { describe, expect, it } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { LoginForm } from "./LoginForm";
import "@testing-library/jest-dom";
import { BrowserRouter } from "react-router-dom";
import userEvent from "@testing-library/user-event";
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
});
