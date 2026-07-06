/* eslint-disable react/prop-types */
import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import {
  ArrowRight,
  CheckCircle2,
  Eye,
  EyeOff,
  Lock,
  Mail,
  Phone,
  User,
  Users,
} from "lucide-react";
import logo from "../assets/muetlogo.png";
import { useAuth } from "../context/AuthContext";
import { DEPARTMENTS } from "../portal/portalConfig";
import { inferDepartmentFromEmail, inferPortalTypeFromEmail } from "../portal/portalAuth";
import "../components/DashboardLayout.css";

const initialForm = {
  fullName: "",
  email: "",
  rollNumber: "",
  employeeId: "",
  designation: "",
  department: "",
  phone: "",
  password: "",
  confirmPassword: "",
  agreeTerms: false,
};

function passwordScore(password) {
  return [
    password.length >= 8,
    /[A-Z]/.test(password),
    /[a-z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;
}

const portalLabels = {
  undergraduate: "Undergraduate Student Portal",
  postgraduate: "Postgraduate Student Portal",
  faculty: "Faculty & Dedicated Researcher Portal",
};

export default function SignUp() {
  const [form, setForm] = useState(initialForm);
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const inferredPortal = useMemo(() => inferPortalTypeFromEmail(form.email), [form.email]);
  const inferredDepartment = useMemo(() => inferDepartmentFromEmail(form.email), [form.email]);
  const score = passwordScore(form.password);
  const passwordsMatch = form.password && form.password === form.confirmPassword;

  function updateField(event) {
    const { name, value, type, checked } = event.target;
    setForm((current) => {
      const next = { ...current, [name]: type === "checkbox" ? checked : value };
      if (name === "email") {
        const dept = inferDepartmentFromEmail(value);
        if (dept && !current.department) next.department = dept;
      }
      return next;
    });
  }

  function canContinue() {
    return (
      form.fullName.trim().length > 2 &&
      form.email.trim() &&
      inferredPortal &&
      form.password &&
      score >= 4 &&
      passwordsMatch
    );
  }

  async function handleSubmit(event) {
    event.preventDefault();

    if (!form.department) {
      toast.error("Please select your department.");
      return;
    }

    if (!form.agreeTerms) {
      toast.error("Please accept the portal terms.");
      return;
    }

    const result = await register(form);
    if (!result.success) {
      toast.error(result.error);
      return;
    }

    toast.success(`Account created for ${portalLabels[result.user.portalType]}.`);
    navigate("/dashboard");
  }

  return (
    <div className="min-h-screen bg-[#f4f6f9] px-4 py-10">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-lg border border-slate-200 bg-white shadow-xl md:grid-cols-[0.9fr_1.2fr]">
        <aside className="bg-[#0b2348] p-8 text-white">
          <div className="flex items-center gap-3">
            <img src={logo} alt="MUET Logo" className="h-12 w-12 rounded-full bg-white object-contain p-1" />
            <div>
              <h1 className="text-xl font-semibold text-white">ORIC Portal</h1>
              <p className="text-sm text-slate-300">MUET Jamshoro</p>
            </div>
          </div>

          <div className="mt-10 space-y-5">
            {[
              "Official university email verification",
              "Automatic student/faculty portal assignment",
              "Industry and startup access is assigned by admin",
            ].map((item) => (
              <div className="flex gap-3" key={item}>
                <CheckCircle2 className="mt-0.5 h-5 w-5 text-emerald-300" />
                <span className="text-sm text-slate-100">{item}</span>
              </div>
            ))}
          </div>

          <div className="mt-10 rounded-md border border-white/10 bg-white/5 p-4">
            <p className="text-xs uppercase tracking-wide text-slate-400">Portal Assigned</p>
            <p className="mt-2 text-lg font-semibold text-white">
              {inferredPortal ? portalLabels[inferredPortal] : "Enter your official email"}
            </p>
            {inferredDepartment && <p className="mt-1 text-sm text-slate-300">{inferredDepartment}</p>}
          </div>
        </aside>

        <form className="p-6 md:p-10" onSubmit={handleSubmit}>
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-wide text-emerald-700">Step {step} of 2</p>
            <h2 className="mt-1 text-3xl font-semibold text-[#102b53]">Create your account</h2>
            <p className="mt-2 text-sm text-slate-600">
              Students, faculty, researchers, and eligible admin-domain university staff can register here.
            </p>
          </div>

          {step === 1 && (
            <div className="space-y-4">
              <Field icon={User} label="Full name">
                <input name="fullName" value={form.fullName} onChange={updateField} placeholder="enter your first name & last name" className="portal-input" />
              </Field>

              <Field icon={Mail} label="Official email">
                <input name="email" value={form.email} onChange={updateField} type="email" placeholder="enter your official university email" className="portal-input" />
              </Field>

              <div className="grid gap-4 md:grid-cols-2">
                <Field icon={Lock} label="Password">
                  <div className="relative">
                    <input name="password" value={form.password} onChange={updateField} type={showPassword ? "text" : "password"} placeholder="enter password" className="portal-input pr-10" />
                    <button type="button" className="absolute right-3 top-3 text-slate-500" onClick={() => setShowPassword((value) => !value)}>
                      {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </Field>

                <Field icon={Lock} label="Confirm password">
                  <div className="relative">
                    <input name="confirmPassword" value={form.confirmPassword} onChange={updateField} type={showConfirm ? "text" : "password"} placeholder="re-enter password" className="portal-input pr-10" />
                    <button type="button" className="absolute right-3 top-3 text-slate-500" onClick={() => setShowConfirm((value) => !value)}>
                      {showConfirm ? <EyeOff size={17} /> : <Eye size={17} />}
                    </button>
                  </div>
                </Field>
              </div>

              <div className="rounded-md bg-slate-50 p-3 text-sm text-slate-600">
                Password strength: <strong>{score}/5</strong>. Use 8+ characters with uppercase, lowercase, number, and special character.
              </div>

              <button type="button" disabled={!canContinue()} onClick={() => setStep(2)} className="portal-primary w-full bg-blue-600 disabled:cursor-not-allowed disabled:bg-slate-300">
                Continue <ArrowRight size={16} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="grid gap-4 md:grid-cols-2">
                <Field icon={User} label="Roll number">
                  <input name="rollNumber" value={form.rollNumber} onChange={updateField} placeholder="For students" className="portal-input" />
                </Field>
                <Field icon={User} label="Employee ID">
                  <input name="employeeId" value={form.employeeId} onChange={updateField} placeholder="For faculty/staff" className="portal-input" />
                </Field>
              </div>

              <Field icon={Users} label="Designation">
                <input name="designation" value={form.designation} onChange={updateField} placeholder="Student, Lecturer, Research Assistant, Chairman..." className="portal-input" />
              </Field>

              <Field icon={Users} label="Department">
                <select name="department" value={form.department} onChange={updateField} className="portal-input">
                  <option value="">Select department</option>
                  {DEPARTMENTS.map((department) => (
                    <option key={department} value={department}>{department}</option>
                  ))}
                </select>
              </Field>

              <Field icon={Phone} label="Phone number">
                <input name="phone" value={form.phone} onChange={updateField} type="tel" placeholder="+92..." className="portal-input" />
              </Field>

              <label className="flex items-start gap-3 rounded-md bg-slate-50 p-3 text-sm text-slate-600">
                <input name="agreeTerms" type="checkbox" checked={form.agreeTerms} onChange={updateField} className="mt-1" />
                <span>I confirm that this information is accurate and agree to follow MUET ORIC portal usage rules.</span>
              </label>

              <div className="flex gap-3">
                <button type="button" className="portal-secondary flex-1" onClick={() => setStep(1)}>Back</button>
                <button type="submit" disabled={isLoading} className="portal-primary flex-1 disabled:opacity-60">
                  {isLoading ? "Creating..." : "Create Account"} <ArrowRight size={16} />
                </button>
              </div>
            </div>
          )}

          <p className="mt-6 text-center text-sm text-slate-600">
            Already have access?{" "}
            <button type="button" onClick={() => navigate("/login")} className="font-semibold text-[#0d2e5c]">
              Sign in
            </button>
          </p>
        </form>
      </div>
    </div>
  );
}

function Field({ icon: Icon, label, children }) {
  return (
    <label className="block">
      <span className="mb-1 flex items-center gap-2 text-sm font-medium text-slate-700">
        <Icon size={15} /> {label}
      </span>
      {children}
    </label>
  );
}
