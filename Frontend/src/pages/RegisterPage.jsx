import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../hooks/userAuth";
import { toast } from "react-toastify";

export default function RegisterPage() {
    const navigate = useNavigate()

    const { register, cooldown, isLimited } = useAuth()

    const [showPassword, setShowPassword] = useState(false);
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [age, setAge] = useState("")
    const [password, setPassword] = useState("")
    const [errors, setErrors] = useState({ name: "", email: "", age: "", password: "" });

    const togglePasswordShow = () => {
        setShowPassword(prev => !prev)
    }

    const validateName = (value) => {
        const trimmed = value.trim();
        if (!trimmed) return "This field is required";
        if (trimmed.length < 3) return "Name must be at least 2 characters";
        if (trimmed.length > 30) return "Name must be under 50 characters";
        return "";
    };

    // Age is optional — only validate if the user actually typed something
    const validateAge = (value) => {
        if (value === "" || value === null || value === undefined) return "";
        const num = Number(value);
        if (Number.isNaN(num)) return "Age must be a number";
        if (num < 10) return "The age should be minimum 10";
        if (num > 100) return "Age must be under 100";
        return "";
    };

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

    const handleRegisterSubmit = async (e) => {
        e.preventDefault();
        if (isLimited) return   // <-- add this line

        const newErrors = {
            name: validateName(name),
            email: validateEmail(email),
            age: validateAge(age),
            password: validatePassword(password),
        };

        setErrors(newErrors);

        if (newErrors.name || newErrors.email || newErrors.age || newErrors.password) return;

        try {
            await register({
                name,
                email,
                password,
                ...(age !== "" && { age: Number(age) }),
            });

            toast.success("Account created successfully! 🎉");

            setName("");
            setEmail("");
            setAge("");
            setPassword("");

            navigate("/");
        } catch (err) {
            toast.error(err.response?.data?.message || "Something went wrong. Please try again.");
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
                            Create your account
                        </h1>
                        <p className="text-sm text-white/40 mt-1.5">
                            Sign up to start a new conversation
                        </p>
                    </div>

                    {/* Form */}
                    <form onSubmit={handleRegisterSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="name" className="block text-xs font-medium text-white/50 mb-1.5">
                                Full name
                            </label>
                            <div className="relative">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2"
                                >
                                    <circle cx="12" cy="8" r="3.2" stroke="currentColor" strokeWidth="1.5" />
                                    <path
                                        d="M5 19c0-3.3 3.1-6 7-6s7 2.7 7 6"
                                        stroke="currentColor"
                                        strokeWidth="1.5"
                                        strokeLinecap="round"
                                    />
                                </svg>
                                <input
                                    id="name"
                                    onChange={(e) => {
                                        setName(e.target.value);
                                        setErrors((prev) => ({ ...prev, name: validateName(e.target.value) }));
                                    }}
                                    type="text"
                                    placeholder="Your name"
                                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/5 border text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${errors.name ? "border-red-400/50 focus:ring-red-400/50" : "border-white/10 focus:ring-emerald-400/50"
                                        }`}
                                />
                            </div>
                            {errors.name && (
                                <p className="text-xs text-red-400 mt-1.5">{errors.name}</p>
                            )}
                        </div>

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
                                    }}
                                    type="email"
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
                            <label htmlFor="age" className="block text-xs font-medium text-white/50 mb-1.5">
                                Age <span className="text-white/25">(optional)</span>
                            </label>
                            <div className="relative">
                                <svg
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    className="w-4 h-4 text-white/30 absolute left-3 top-1/2 -translate-y-1/2"
                                >
                                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.5" />
                                    <path d="M12 7v5l3 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                                </svg>
                                <input
                                    id="age"
                                    onChange={(e) => {
                                        setAge(e.target.value);
                                        setErrors((prev) => ({ ...prev, age: validateAge(e.target.value) }));
                                    }}
                                    type="number"
                                    placeholder="Your age"
                                    className={`w-full pl-9 pr-3 py-2.5 rounded-xl bg-white/5 border text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${errors.age ? "border-red-400/50 focus:ring-red-400/50" : "border-white/10 focus:ring-emerald-400/50"
                                        }`}
                                />
                            </div>
                            {errors.age && (
                                <p className="text-xs text-red-400 mt-1.5">{errors.age}</p>
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
                                    placeholder="Create a password"
                                    className={`w-full pl-9 pr-10 py-2.5 rounded-xl bg-white/5 border text-sm text-white placeholder-white/25 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${errors.password ? "border-red-400/50 focus:ring-red-400/50" : "border-white/10 focus:ring-emerald-400/50"
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
                                            <svg id="eye-open" viewBox="0 0 24 24" fill="none" className="w-4 h-4">
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
                                            <svg id="eye-closed" viewBox="0 0 24 24" fill="none" className="w-4 h-4">
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

                        <button
                            disabled={isLimited}
                            type="submit"
                            className="w-full bg-gradient-to-r from-emerald-400 to-teal-500 text-[#0d0d10] text-sm font-semibold py-2.5 rounded-xl hover:brightness-110 active:brightness-95 transition-all shadow-lg shadow-emerald-500/20 disabled:opacity-40 disabled:cursor-not-allowed"
                        >
                            {isLimited ? `Try again in ${cooldown}s` : "Sign up"}
                        </button>
                    </form>
                </div>

                {/* Footer */}
                <p className="text-center text-sm text-white/40 mt-6">
                    Already have an account?{" "}
                    <Link to="/login" className="text-white font-medium hover:underline">
                        Log in
                    </Link>
                </p>
            </div >
        </div >
    );
}