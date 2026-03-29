import { BrowserRouter, Routes, Route } from "react-router-dom";
import NotFound from "../shared/components/Error/NotFound";
import SignUp from "../features/auth/pages/SignUp";
import Login from "../features/auth/pages/Login";
import OnBoarding from "../features/onboarding/pages/OnBoarding";

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/auth">
          <Route element={<Login />} path="login" />
          <Route element={<SignUp />} path="signup" />
        </Route>

        <Route element={<NotFound />} path="*" />
        <Route element={<OnBoarding />} path="/dashboard/on-boarding" />
      </Routes>
    </BrowserRouter>
  );
}
