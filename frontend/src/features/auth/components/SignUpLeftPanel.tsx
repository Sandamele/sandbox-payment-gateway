import { CircleCheck } from "lucide-react";
import { ReviewCard } from "../../../shared/components/ReviewCard";
export const SignUpLeftPanel = () => {
  return (
    <div className="flex flex-col justify-between h-screen py-15 px-10 bg-[linear-gradient(150deg,#F7F2F2_30.39%,#a8c7d0_79.33%)]">
      <div className="">
        <label>SandPay</label>
        <h1 className="text-4xl font-extrabold">
          Modern payment infrastructure
        </h1>
        <ul className="text-sm mt-6">
          <li className="flex gap-2 ">
            <CircleCheck className="mt-0.5 text-[#00A6C0]" size={18} />
            Global multi-currency ledger with milliseconds finality
          </li>
          <li className="flex gap-2 ">
            <CircleCheck className="mt-0.5 text-[#00A6C0]" size={18} />
            Developer-first API with 99.99% uptime SLA
          </li>
        </ul>
      </div>
      <ReviewCard
        initials="JS"
        name="James Sterling"
        jobPosition="CTO at FinShere"
        review="The precision of SandPay's ledger system allowed us to scale our cross-border operations in weeks, not months."
      />
    </div>
  );
};
