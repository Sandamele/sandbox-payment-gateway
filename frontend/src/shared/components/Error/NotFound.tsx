import { Ghost } from "lucide-react";
import { Button } from "../ui/button";
import { useNavigate } from "react-router-dom";

export default function NotFound({}) {
  const navigate = useNavigate();
  const handleGoToDashboard = () => {
    navigate("/dashboard");
  };
  const handleBack = () => {
    navigate(-1);
  };
  return (
    <div className="flex flex-col items-center justify-self-center place-content-center h-screen">
      <h1 className="text-[200px] md:text-[350px] ml-4 md:m-0 text-slate-200 font-bold">
        404
      </h1>
      <div className="absolute flex flex-col text-center items-center gap-6 ml-4 md:m-0">
        <div className="w-16 h-14 bg-white flex items-center justify-center shadow-lg shadow-cyan-200/50">
          <Ghost size={40} className="text-cyan-600" />
        </div>
        <h2 className="text-3xl font-bold">Page not found</h2>
        <p className="text-sm">
          The page you are looking for does not exist or has been moved.
        </p>
        <div className="flex gap-4">
          <Button className="uppercase" size="lg" onClick={handleGoToDashboard}>
            Go to dashboard
          </Button>
          <Button
            variant="secondary"
            size="lg"
            className="uppercase"
            onClick={handleBack}
          >
            Go back
          </Button>
        </div>
      </div>
    </div>
  );
}
