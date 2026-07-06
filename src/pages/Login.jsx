import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { ArrowRight, Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import logo from "../assets/muetlogo.png";
import { useAuth } from "../context/AuthContext";
import { DEFAULT_CREDENTIALS } from "../portal/portalConfig";
import { inferPortalTypeFromEmail } from "../portal/portalAuth";
import "../components/DashboardLayout.css";

const portalLabels = {
  undergraduate: "Undergraduate Student Portal",
  postgraduate: "Postgraduate Student Portal",
  faculty: "Faculty & Dedicated Researcher Portal",
};

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();

  const detectedPortal = useMemo(() => inferPortalTypeFromEmail(identifier), [identifier]);

  async function handleSubmit(event) {
    event.preventDefault();
    const result = await login(identifier, password);

    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success("Login successful.");
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#f4f6f9] px-4 py-10">
      <div className="mx-auto grid max-w-5xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl md:grid-cols-[0.9fr_1.1fr]">
        <aside className="bg-[#0b2348] p-8 text-white">
          <div className="flex items-center gap-3">
            <img src={logo} alt="MUET Logo" className="h-12 w-12 rounded-full bg-white object-contain p-1" />
            <div>
              <h1 className="text-xl font-semibold text-white">ORIC Portal</h1>
              <p className="text-sm text-slate-300">MUET Jamshoro</p>
            </div>
          </div>

          <div className="mt-10 rounded-md border border-white/10 bg-white/5 p-5">
            <ShieldCheck className="h-8 w-8 text-emerald-300" />
            <h2 className="mt-4 text-2xl font-semibold text-white">Secure Gateway to Opportunities</h2>
            <p className="mt-3 text-sm leading-6 text-slate-300">
              University users sign in with official MUET emails. Industry partners, startup incubatees, and ORIC admin use credentials assigned by admin.
            </p>
          </div>

          {/* <div className="mt-6 rounded-md bg-white/5 p-4 text-xs text-slate-300">
            <p className="font-semibold text-white">Demo credentials</p>
            <p className="mt-2">Admin: {DEFAULT_CREDENTIALS.admin.username} / {DEFAULT_CREDENTIALS.admin.password}</p>
            <p>Undergrad: {DEFAULT_CREDENTIALS.undergraduate.username} / {DEFAULT_CREDENTIALS.undergraduate.password}</p>
            <p>Postgrad: {DEFAULT_CREDENTIALS.postgraduate.username} / {DEFAULT_CREDENTIALS.postgraduate.password}</p>
            <p>Faculty: {DEFAULT_CREDENTIALS.faculty.username} / {DEFAULT_CREDENTIALS.faculty.password}</p>
            <p>Industry: {DEFAULT_CREDENTIALS.industry.username} / {DEFAULT_CREDENTIALS.industry.password}</p>
            <p>Startup: {DEFAULT_CREDENTIALS.startup.username} / {DEFAULT_CREDENTIALS.startup.password}</p>
          </div> */}
        </aside>

        <form className="p-6 md:p-10" onSubmit={handleSubmit}>
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Portal Login</p>
            <h2 className="mt-1 text-3xl font-semibold text-[#102b53]">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-600">
              Enter your university email or assigned username.
            </p>
          </div>

          <div className="space-y-5">
            <label className="block">
              <span className="mb-1 flex items-center gap-2 text-sm font-medium text-slate-700">
                <Mail size={15} /> Email or username
              </span>
              <input
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                placeholder="enter your official university email"
                className="portal-input"
              />
            </label>

            {identifier && (
              <div className="rounded-md bg-slate-50 p-3 text-sm text-slate-600">
                {detectedPortal
                  ? `Detected: ${portalLabels[detectedPortal]}`
                  : "Assigned username login will be checked for admin, industry, or startup access."}
              </div>
            )}

            <label className="block">
              <span className="mb-1 flex items-center gap-2 text-sm font-medium text-slate-700">
                <Lock size={15} /> Password
              </span>
              <div className="relative">
                <input
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  type={showPassword ? "text" : "password"}
                  placeholder="enter password"
                  className="portal-input pr-10"
                />
                <button type="button" className="absolute right-3 top-3 text-slate-500" onClick={() => setShowPassword((value) => !value)}>
                  {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                </button>
              </div>
            </label>

            <button type="submit" disabled={!identifier || !password || isLoading} className="portal-primary w-full bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300">
              {isLoading ? "Signing in..." : "Sign In"} <ArrowRight size={16} />
            </button>
          </div>

          <p className="mt-6 text-center text-sm text-slate-600">
            University user without an account?{" "}
            <button type="button" onClick={() => navigate("/signup")} className="font-semibold text-[#0d2e5c]">
              Create account
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}
