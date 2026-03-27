import { ReviewCard } from "../../../shared/components/ReviewCard";

export const LoginLeftPanel = () => {
  return (
    <div className="flex flex-col justify-between h-screen py-15 px-10 bg-[linear-gradient(150deg,#F7F2F2_30.39%,#a8c7d0_79.33%)]">
      <div className="">
        <label>SandPay</label>
        <h1 className="text-4xl font-extrabold mt-10">Welcome Back!</h1>
        <p className="mt-8 text-sm">
          Access your merchant portal and manage global payments with surgical
          precision.
        </p>
      </div>
      <ReviewCard
        initials="JS"
        name="Marcus Thorne"
        jobPosition="CTO, Vertex Fintech"
        review="The integration was seamless. SandPay's API speed is exactly what our platform needed for high-frequency transactions"
      />
    </div>
  );
};
