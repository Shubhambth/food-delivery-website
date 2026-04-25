import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FcGoogle } from "react-icons/fc";
import axios from "axios";

function SignIn() {
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            setLoading(true);
            setMessage("");

            const response = await axios.post(
                "http://localhost:8000/api/v1/auth/signin",
                formData,
                { withCredentials: true }
            );

            setMessage("✅ Login successful!");
            console.log(response.data);

            // optional: redirect user
            // window.location.href = "/";

        } catch (error) {
            console.error(error);

            if (error.response) {
                setMessage(`❌ ${error.response.data.message}`);
            } else {
                setMessage("❌ Something went wrong");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100">
            <div className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">

                <h2 className="text-2xl font-bold text-center mb-6">
                    Sign In
                </h2>

                {/* Message */}
                {message && (
                    <p className="text-center mb-3 text-sm text-gray-700">
                        {message}
                    </p>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">

                    {/* Email */}
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-orange-400"
                        required
                    />

                    {/* Password */}
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full px-4 py-2 border rounded-lg pr-10 focus:ring-2 focus:ring-orange-400"
                            required
                        />
                        <span
                            className="absolute right-3 top-2.5 cursor-pointer"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </span>
                    </div>

                    {/* Reset Password Link */}
                    <div className="text-right">
                        <a
                            href="/forgot-pass"
                            className="text-sm text-orange-500 hover:underline"
                        >
                            Forgot Password?
                        </a>
                    </div>

                    {/* Submit */}
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-500 text-white py-2 rounded-lg hover:bg-orange-600 transition"
                    >
                        {loading ? "Logging in..." : "Sign In"}
                    </button>
                </form>

                {/* Divider */}
                <div className="my-4 flex items-center">
                    <hr className="flex-grow border-gray-300" />
                    <span className="mx-2 text-gray-500 text-sm">OR</span>
                    <hr className="flex-grow border-gray-300" />
                </div>

                {/* Google Login UI */}
                <button
                    type="button"
                    className="w-full flex items-center justify-center gap-3 border py-2 rounded-lg hover:bg-gray-100 transition"
                >
                    <FcGoogle size={20} />
                    Continue with Google
                </button>

            </div>
        </div>
    );
}

export default SignIn;