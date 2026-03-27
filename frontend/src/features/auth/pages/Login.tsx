import { FormHeader } from "../components/FormHeader";
import { LoginForm } from "../components/LoginForm";
import { LoginLeftPanel } from "../components/LoginLeftPanel";

export default function Login() {
  return (
    <main className="grid grid-cols-1 lg:grid-cols-3">
      <div className="hidden lg:block">
        <LoginLeftPanel />
      </div>
      <div className="flex flex-col justify-center mx-10 lg:mx-40 col-span-2 h-screen">
        <div className="mb-8">
          <FormHeader
            title="Login"
            subTitle="Enter your credentials to manage your account."
          />
        </div>
        <LoginForm />
      </div>
    </main>
  );
}
