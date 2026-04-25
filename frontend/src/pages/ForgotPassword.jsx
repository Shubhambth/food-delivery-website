import React, { useState } from "react";

const BASE_URL = "http://localhost:8000/api/v1/auth";

function ForgotPassword() {
    const [step, setStep] = useState(1);

    const [email, setEmail] = useState("");
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [loading, setLoading] = useState(false);

    // 1️⃣ SEND OTP
    const handleSendOtp = async () => {
        try {
            setLoading(true);

            const res = await fetch(`${BASE_URL}/sent-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            alert("OTP sent");
            setStep(2);

        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    // 2️⃣ VERIFY OTP
    const handleVerifyOtp = async () => {
        try {
            setLoading(true);

            const res = await fetch(`${BASE_URL}/verify-otp`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            alert("OTP verified");
            setStep(3);

        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    // 3️⃣ RESET PASSWORD
    const handleResetPassword = async () => {
        if (newPassword !== confirmPassword) {
            return alert("Passwords do not match");
        }

        try {
            setLoading(true);

            const res = await fetch(`${BASE_URL}/reset-password`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    email,
                    newPassword,
                }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.message);

            alert("Password reset successful");

            setStep(1);
            setEmail("");
            setOtp("");
            setNewPassword("");
            setConfirmPassword("");

        } catch (err) {
            alert(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="p-6 bg-white shadow-md w-96 rounded">

                <h2 className="text-xl font-bold mb-4">Forgot Password</h2>

                {/* STEP 1 */}
                {step === 1 && (
                    <>
                        <input
                            className="border p-2 w-full mb-2"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <button onClick={handleSendOtp} className="bg-blue-500 text-white w-full p-2">
                            Send OTP
                        </button>
                    </>
                )}

                {/* STEP 2 */}
                {step === 2 && (
                    <>
                        <input
                            className="border p-2 w-full mb-2"
                            placeholder="Enter OTP"
                            value={otp}
                            onChange={(e) => setOtp(e.target.value)}
                        />
                        <button onClick={handleVerifyOtp} className="bg-green-500 text-white w-full p-2">
                            Verify OTP
                        </button>
                    </>
                )}

                {/* STEP 3 */}
                {step === 3 && (
                    <>
                        <input
                            className="border p-2 w-full mb-2"
                            type="password"
                            placeholder="New Password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />

                        <input
                            className="border p-2 w-full mb-2"
                            type="password"
                            placeholder="Confirm Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                        />

                        <button onClick={handleResetPassword} className="bg-orange-500 text-white w-full p-2">
                            Reset Password
                        </button>
                    </>
                )}

            </div>
        </div>
    );
}

export default ForgotPassword;