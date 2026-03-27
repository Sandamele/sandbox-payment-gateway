import { BrowserRouter } from "react-router-dom";
import { describe, expect, it } from "vitest";
import { SignUpForm } from "../components/SignUpForm";
import { render, screen } from "@testing-library/react";
import "@testing-library/jest-dom";
import userEvent from "@testing-library/user-event";

const renderForm = () => {
  return render(
    <BrowserRouter>
      <SignUpForm />
    </BrowserRouter>,
  );
};
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
});
