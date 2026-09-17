import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/userAuth";
import { toast } from "react-toastify";
// import { useRateLimitCooldown } from "../hooks/useRateLimitCooldown";

export default function LoginPage() {
    const navigate = useNavigate()
    // const { cooldown, isLimited, handleApiError } = useRateLimitCooldown()

    const { login, error, cooldown, isLimited } = useAuth()

    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState({ email: "", password: "" });

    const togglePasswordShow = () => {

        setShowPassword(prev => !prev)
    }

    const validateEmail = (value) => {
        const trimmed = value.trim().toLowerCase();
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (!trimmed) return "This field is required";
        if (!emailRegex.test(trimmed)) return "Enter a valid email address";
        return "";
    };

    const validatePassword = (value) => {
        if (!value) return "This field is required";
        if (value.length < 8) return "Password must be at least 8 characters";
        if (!/[A-Z]/.test(value)) return "Password must contain at least one uppercase letter";
        if (!/[a-z]/.test(value)) return "Password must contain at least one lowercase letter";
        if (!/[0-9]/.test(value)) return "Password must contain at least one number";
        if (!/[^A-Za-z0-9]/.test(value)) return "Password must contain at least one special character";
        return "";
    };


    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        if (isLimited) return

        const newErrors = { email: "", password: "" };
        if (!email.trim()) newErrors.email = "This field is required";
        if (!password.trim()) newErrors.password = "This field is required";

        setErrors(newErrors);

        if (newErrors.email || newErrors.password) return;

        try {
            await login({ email, password });

            toast.success("User logged in successfully! 🎉");

            setEmail("");
            setPassword("");

            navigate("/");
        } catch (err) {
            toast.error(err.response?.data?.message || error || "Invalid email or password.");
        }

    }


    return (
        <div className="min-h-screen flex items-center justify-center bg-[#0d0d10] px-4 relative overflow-hidden">
            {/* Ambient glow accents */}
            <div className="pointer-events-none absolute -top-32 -left-24 w-96 h-96 rounded-full bg-emerald-500/10 blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 -right-24 w-96 h-96 rounded-full bg-teal-400/10 blur-3xl" />

            <div className="w-full max-w-sm relative">
                <div className="rounded-2xl border border-white/10 bg-white/[0.04] backdrop-blur-xl shadow-2xl shadow-black/40 px-8 py-10">
                    {/* Logo / Title */}
                    <div className="flex flex-col items-center mb-8">
                        <div className="w-11 h-11 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center mb-5 shadow-lg shadow-emerald-500/20">
                            <svg viewBox="0 0 24 24" fill="none" className="w-5 h-5 text-[#0d0d10]">
                                <path
                                    d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"
                                    stroke="currentColor"
                                    strokeWidth="1.8"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                        </div>
                        <h1 className="text-xl font-semibold text-white tracking-tight">
                            Welcome back
                        </h1>
                        <p className="text-sm text-white/40 mt-1.5">
                            Log in to pick up your conversation
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-xs font-medium text-white/50 mb-1.5">
                                Email address
                            </label>
                            <div className="relative">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2"
                                >
                                    <path
                                        d="M3 6.5C3 5.67 3.67 5 4.5 5h15c.83 0 1.5.67 1.5 1.5v11c0 .83-.67 1.5-1.5 1.5h-15A1.5 1.5 0 0 1 3 17.5v-11Z"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                    />
                                    <path d="m3.5 6 8.5 6 8.5-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                <input
                                    id="email"
                                    onChange={(e) => {
                                        setEmail(e.target.value);
                                        setErrors((prev) => ({ ...prev, email: validateEmail(e.target.value) }));
                                    }} type="email"
                                    placeholder="you@example.com"
                                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/5 border text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${errors.email ? "border-red-400/50 focus:ring-red-400/50" : "border-white/10 focus:ring-emerald-400/50"
                                        }`}
                                />
                            </div>
                            {errors.email && (
                                <p className="text-xs text-red-400 mt-1.5">{errors.email}</p>
                            )}
                        </div>

                        <div>
                            <label htmlFor="password" className="block text-xs font-medium text-white/50 mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2"
                                >
                                    <rect x="4.5" y="10" width="15" height="9.5" rx="2" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M8 10V7a4 4 0 0 1 8 0v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                <input
                                    id="password"
                                    onChange={(e) => {
                                        setPassword(e.target.value);
                                        setErrors((prev) => ({ ...prev, password: validatePassword(e.target.value) }));
                                    }}
                                    type={showPassword ? "text" : "password"}
                                    placeholder="Enter your password"
                                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/5 border text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${errors.email ? "border-red-400/50 focus:ring-red-400/50" : "border-white/10 focus:ring-emerald-400/50"
                                        }`}
                                />
                                <button
                                    type="button"
                                    onClick={togglePasswordShow}
                                    aria-label="Toggle password visibility"
                                    className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-white/30 hover:text-white/70 transition-colors"
                                >
                                    {showPassword ? (
                                        <>
                                            {/* Eye (visible password) */}
                                            <svg svg id="eye-open" viewBox="0 0 24 24" fill="none" className="w-4 h-4">
                                                <path
                                                    d="M2 12s3.5-6.5 10-6.5S22 12 22 12s-3.5 6.5-10 6.5S2 12 2 12Z"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                    strokeLinejoin="round"
                                                />
                                                <circle cx="12" cy="12" r="2.5" stroke="currentColor" strokeWidth="1.5" />
                                            </svg>
                                        </>
                                    ) : (
                                        <>
                                            {/* Eye-off (hidden password) */}
                                            <svg id="eye-closed" viewBox="0 0 24 24" fill="none" className="w-4 h-4 ">
                                                <path
                                                    d="M3 3l18 18M10.6 10.7a2.5 2.5 0 0 0 3.5 3.5M6.6 6.8C4.3 8.2 2 12 2 12s3.5 6.5 10 6.5c1.8 0 3.3-.5 4.6-1.2M9.9 5.6c.7-.1 1.4-.2 2.1-.2 6.5 0 10 6.5 10 6.5s-.8 1.5-2.3 3"
                                                    stroke="currentColor"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                            </svg>
                                        </>
                                    )}

                                </button>
                            </div>
                            {errors.password && (
                                <p className="text-xs text-red-400 mt-1.5">{errors.password}</p>
                            )}
                        </div>

                        <div className="flex justify-end">
                            <a href="#" className="text-xs text-white/40 hover:text-white/70 transition-colors">
                                Forgot password?
                            </a>
                        </div>

                        <button
                            disabled={isLimited}
                            type="submit"
                            className="w-full bg-gradient-to-r from-emerald-400 to-teal-500 text-[#0d0d10] text-sm font-semibold py-2.5 rounded-xl hover:brightness-110 active:brightness-95 transition-all shadow-lg shadow-emerald-500/20"
                        >
                            {isLimited ? `Try again in ${cooldown}s` : "Log in"}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-white/40 mt-6">
                    Don&apos;t have an account?{" "}
                    <Link to="/register" className="text-white font-medium hover:underline">
                        Sign up
                    </Link>
                </p>
            </div >
        </div >
    );
}