import { FormHeader } from "../components/FormHeader";
import { SignUpForm } from "../components/SignUpForm";
import { SignUpLeftPanel } from "../components/SignUpLeftPanel";

export default function SignUp() {
  return (
    <main className="grid grid-cols-1 lg:grid-cols-3">
      <div className="hidden lg:block">
        <SignUpLeftPanel />
      </div>
      <div className="flex flex-col justify-center mx-10 lg:mx-40 col-span-2 h-screen">
        <div className="mb-8">
          <FormHeader
            title="Create your account"
            subTitle="Join the next generation of financial infrastructure."
          />
        </div>
        <SignUpForm />
      </div>
    </main>
  );
}
